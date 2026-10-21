import { NextResponse } from "next/server";
import { officeEmail, summarize } from "@/lib/inquiry";
import { inquirySchema } from "@/lib/inquiry-schema";
import { verifyInvite } from "@/lib/invite";
import { deliver, originLines, reference, remember, remembered } from "@/lib/leads";
import { clientIp, limited } from "@/lib/rate-limit";
import { site } from "@/lib/site";

// The request for an evening. Every request is validated against the same
// rules the conversation uses and given a reference.
//  - On the demo (site.demo) that is all: nothing is stored, logged or sent,
//    because nobody is booking a real chef. The visitor is shown the email a
//    chef using this site would receive.
//  - On a customer's site it is delivered to the office (lib/leads.ts), and
//    the visitor is told it arrived only once a channel has accepted it.

export async function POST(req: Request) {
  if (limited(`inquire:${clientIp(req)}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests in a short time. Please wait a few minutes and try again." }, { status: 429 });
  }

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
  const ref = reference("EJ");
  if (data.company) return NextResponse.json({ ok: true, ref, demo: site.demo }); // honeypot: accept quietly

  if (site.demo) return NextResponse.json({ ok: true, ref, demo: true });

  const submissionId = data.submissionId || ref;
  const again = remembered(submissionId);
  if (again) return NextResponse.json(again);

  const invite = data.invite ? verifyInvite(data.invite) : null;
  const origin = [
    ...originLines(data.attribution),
    ...(invite?.ok ? [`Private invitation: ${invite.payload.n}`] : []),
    ...(data.invite && !invite?.ok ? [`Invitation token present but ${invite?.reason}`] : []),
  ];
  const mail = officeEmail(data, ref, origin);
  const first = data.name.split(" ")[0];

  const result = await deliver({
    kind: "evening",
    ref,
    submissionId,
    subject: mail.subject,
    text: mail.text,
    replyTo: data.email,
    data: { name: data.name, email: data.email, phone: data.phone || null, summary: summarize(data), answers: { ...data, attribution: undefined, company: undefined } },
    ack: {
      to: data.email,
      subject: `Your request — ${ref}`,
      text: [`Dear ${first},`, "", "Thank you. Your request has arrived and will be read personally.", "", `“${summarize(data)}”`, "", `Your reference is ${ref}. To add anything, reply to this email.`, "", site.name].join("\n"),
    },
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: `Your request could not be delivered just now. Your answers are kept on this device; please try again in a few minutes${site.email ? `, or write to ${site.email}` : ""}.` },
      { status: 503 },
    );
  }
  const body = { ok: true, ref, acknowledged: result.acknowledged };
  remember(submissionId, body);
  return NextResponse.json(body);
}
