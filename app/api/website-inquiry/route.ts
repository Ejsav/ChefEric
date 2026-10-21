import { NextResponse } from "next/server";
import { websiteRequestSchema } from "@/lib/sales-schema";
import { websiteAckEmail, websiteLeadEmail, describeRequest, normalizeUrl } from "@/lib/sales";
import { deliver, looksLikeSpam, originLines, reference, remember, remembered } from "@/lib/leads";
import { clientIp, limited } from "@/lib/rate-limit";
import { builder, site } from "@/lib/site";

// A request for a website: the one form on this site that is real business.
// Validated, de-duplicated, rate-limited, screened for bots, then delivered
// to Eric (email and/or CRM webhook, lib/leads.ts) with an acknowledgment to
// the person who wrote. The visitor sees "received" only when a channel a
// person reads has accepted the request; otherwise they keep their answers
// and are given a direct way to write.

const fallback = () =>
  site.email ? `write to ${site.email}` : `reach Eric through ${builder.url.replace(/^https?:\/\//, "")}`;

export async function POST(req: Request) {
  if (limited(`website:${clientIp(req)}`, 5)) {
    return NextResponse.json({ ok: false, error: "Too many requests in a short time. Please wait a few minutes and try again." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = websiteRequestSchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;
    return NextResponse.json({ ok: false, errors, error: "A few details need another look." }, { status: 422 });
  }

  const { submissionId, startedAt, attribution, company, ...answers } = parsed.data;
  const r = { ...answers, website: normalizeUrl(answers.website) ?? "" };
  const ref = reference("EW");

  // Honeypot filled: a bot. Answer as if all is well and deliver nothing.
  if (company) return NextResponse.json({ ok: true, ref, acknowledged: false });

  const again = remembered(submissionId);
  if (again) return NextResponse.json(again);

  // Flag, never drop: a person can be fast, and a link-heavy note can be real.
  const flags: string[] = [];
  if (startedAt && Date.now() - startedAt < 4_000) flags.push("sent within 4 seconds");
  if (looksLikeSpam(r.notes, r.business)) flags.push("possible spam");

  const mail = websiteLeadEmail(r, ref, originLines(attribution), flags);
  const result = await deliver({
    kind: "website",
    ref,
    submissionId,
    subject: mail.subject,
    text: mail.text,
    replyTo: r.email,
    data: {
      name: r.name,
      email: r.email,
      phone: r.phone || null,
      business: r.business,
      website: r.website || null,
      type: r.type,
      design: r.design,
      palette: r.palette ?? null,
      features: r.features,
      timeline: r.timeline,
      budget: r.budget,
      notes: r.notes || null,
      flags,
      summary: Object.fromEntries(describeRequest(r)),
    },
    ack: flags.includes("possible spam") ? undefined : { to: r.email, ...websiteAckEmail(r, ref) },
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: `Your request could not be delivered just now. Your answers are saved on this device; please try again in a few minutes, or ${fallback()}.` },
      { status: 503 },
    );
  }

  const body = { ok: true, ref, acknowledged: result.acknowledged };
  remember(submissionId, body);
  return NextResponse.json(body);
}
