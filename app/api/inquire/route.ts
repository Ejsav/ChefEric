import { NextResponse } from "next/server";
import { details, summarize } from "@/lib/inquiry";
import { inquirySchema } from "@/lib/inquiry-schema";
import { verifyInvite } from "@/lib/invite";

// Every request is validated against the same rules the conversation uses,
// tagged with where the visitor came from, given a reference, and sent to the
// office (Resend) — or logged when email is not configured, so nothing is lost.

// Best-effort burst protection per instance. Serverless instances don't share
// memory; put this behind Vercel Firewall rate limiting for a hard guarantee.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

const reference = () => `EJ-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please write to us directly." }, { status: 429 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const data = parsed.data;
  const ref = reference();
  if (data.company) return NextResponse.json({ ok: true, ref }); // honeypot: accept quietly

  const invite = data.invite ? verifyInvite(data.invite) : null;
  const invitedAs = invite?.ok ? invite.payload.n : null;
  const summary = summarize(data);
  const a = data.attribution;
  const origin = [
    a?.first && `First touch: ${[a.first.source, a.first.medium, a.first.campaign].filter(Boolean).join(" / ") || "direct"} — landed on ${a.first.landing ?? "?"}${a.first.referrer ? ` from ${a.first.referrer}` : ""}${a.first.ts ? ` (${new Date(a.first.ts).toDateString()})` : ""}`,
    a?.session && `This visit: ${[a.session.source, a.session.medium, a.session.campaign].filter(Boolean).join(" / ") || "direct"} — landed on ${a.session.landing ?? "?"}${a.session.referrer ? ` from ${a.session.referrer}` : ""}`,
    invitedAs && `Private invitation: ${invitedAs}`,
    data.invite && !invite?.ok && `Invitation token present but ${invite?.reason}`,
  ].filter(Boolean) as string[];

  const text = [
    summary,
    "",
    ...details(data).map((r) => `${r.label}: ${r.value}`),
    "",
    "— Origin —",
    ...(origin.length ? origin : ["No attribution captured"]),
    "",
    `Reference: ${ref}`,
  ].join("\n");

  const { RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && INQUIRY_TO_EMAIL && INQUIRY_FROM_EMAIL) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: INQUIRY_FROM_EMAIL,
        to: INQUIRY_TO_EMAIL,
        reply_to: data.email,
        subject: `${ref} · ${data.name} · ${summary}`.slice(0, 200),
        text,
      }),
    });
    if (!res.ok) {
      console.error("[inquire] Resend failed", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "We could not send your request. Please write to us directly." }, { status: 502 });
    }
  } else {
    console.info(`[inquire] Email not configured. Request received:\n${text}`);
  }

  return NextResponse.json({ ok: true, ref });
}
