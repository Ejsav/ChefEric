import "server-only";
import { createHmac, randomBytes } from "node:crypto";
export { originLines } from "@/lib/attribution";

// Where a request goes once it has been validated. Every lead fans out to
// each configured channel; the visitor is told it arrived only when at least
// one channel that a person reads has accepted it.
//
//   Email    RESEND_API_KEY + LEADS_TO_EMAIL + LEADS_FROM_EMAIL
//            (INQUIRY_TO_EMAIL / INQUIRY_FROM_EMAIL are read as fallbacks)
//   Webhook  LEADS_WEBHOOK_URL: a CRM, Zapier/Make, a Slack workflow or a
//            sheet. Signed with LEADS_WEBHOOK_SECRET when set.
//
// No channel configured: locally and in CI the lead is printed to the server
// log so development works; on a Vercel production deployment the request
// FAILS, so the visitor is told to write directly rather than shown a
// success that nobody will ever read.

export type Lead = {
  kind: "website" | "evening";
  ref: string;
  /** client-generated id for this submission; the same id is never delivered twice */
  submissionId: string;
  subject: string;
  text: string;
  replyTo: string;
  /** structured copy for the webhook (CRM fields) */
  data: Record<string, unknown>;
  /** an acknowledgment to the person who wrote, sent once the lead is safe */
  ack?: { to: string; subject: string; text: string };
};

export type Delivery = { ok: boolean; channels: string[]; acknowledged: boolean; reason?: "unconfigured" | "failed" };

const env = () => ({
  key: process.env.RESEND_API_KEY,
  to: process.env.LEADS_TO_EMAIL || process.env.INQUIRY_TO_EMAIL,
  from: process.env.LEADS_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL,
  hook: process.env.LEADS_WEBHOOK_URL,
  hookSecret: process.env.LEADS_WEBHOOK_SECRET,
});

/** A short, unguessable reference such as EW-7K2QXM. */
export function reference(prefix: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return `${prefix}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

async function sendEmail(body: Record<string, unknown>, idempotencyKey: string) {
  const { key } = env();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

async function sendWebhook(lead: Lead) {
  const { hook, hookSecret } = env();
  const body = JSON.stringify({
    kind: lead.kind,
    ref: lead.ref,
    submissionId: lead.submissionId,
    receivedAt: new Date().toISOString(),
    subject: lead.subject,
    text: lead.text,
    ...lead.data,
  });
  const headers: Record<string, string> = { "Content-Type": "application/json", "Idempotency-Key": lead.submissionId };
  if (hookSecret) headers["X-Lead-Signature"] = `sha256=${createHmac("sha256", hookSecret).update(body).digest("hex")}`;
  const res = await fetch(hook!, { method: "POST", headers, body, signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

export async function deliver(lead: Lead): Promise<Delivery> {
  const e = env();
  const email = !!(e.key && e.to && e.from);

  if (!email && !e.hook) {
    if (process.env.VERCEL_ENV === "production") {
      console.error(`[leads] ${lead.ref}: no delivery channel configured in production; the visitor was asked to write directly.`);
      return { ok: false, channels: [], acknowledged: false, reason: "unconfigured" };
    }
    console.info(`[leads] No channel configured (development). ${lead.kind} lead received:\n${lead.text}`);
    return { ok: true, channels: ["log"], acknowledged: false };
  }

  const tasks: [string, Promise<void>][] = [];
  if (email) {
    tasks.push(["email", sendEmail({ from: e.from, to: e.to, reply_to: lead.replyTo, subject: lead.subject.replace(/[\r\n]+/g, " ").slice(0, 200), text: lead.text }, `${lead.kind}-${lead.submissionId}`)]);
  }
  if (e.hook) tasks.push(["webhook", sendWebhook(lead)]);

  const results = await Promise.allSettled(tasks.map(([, p]) => p));
  const channels = tasks.filter((_, i) => results[i]!.status === "fulfilled").map(([name]) => name);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[leads] ${lead.ref}: ${tasks[i]![0]} failed`, r.reason);
  });
  if (!channels.length) return { ok: false, channels, acknowledged: false, reason: "failed" };

  // The lead is safe. Acknowledge it; a failed acknowledgment never fails the request.
  let acknowledged = false;
  if (lead.ack && email) {
    try {
      await sendEmail({ from: e.from, to: lead.ack.to, reply_to: e.to, subject: lead.ack.subject, text: lead.ack.text }, `${lead.kind}-ack-${lead.submissionId}`);
      acknowledged = true;
    } catch (err) {
      console.error(`[leads] ${lead.ref}: acknowledgment failed`, err);
    }
  }
  return { ok: true, channels, acknowledged };
}

// Duplicate protection: a double-click, a retry after a slow network, or a
// resubmitted form returns the first answer instead of a second lead. Per
// instance; the email provider and the webhook also receive the same
// Idempotency-Key, which covers retries that land on another instance.
const seen = new Map<string, { at: number; body: unknown }>();
export function remembered(submissionId: string) {
  const hit = seen.get(submissionId);
  return hit && Date.now() - hit.at < 30 * 60_000 ? hit.body : null;
}
export function remember(submissionId: string, body: unknown) {
  seen.set(submissionId, { at: Date.now(), body });
  if (seen.size > 2_000) {
    const cutoff = Date.now() - 30 * 60_000;
    for (const [k, v] of seen) if (v.at < cutoff) seen.delete(k);
  }
}

/** Very rough spam signal: link-stuffed free text. Flagged, never dropped. */
export function looksLikeSpam(...texts: (string | undefined)[]) {
  const links = texts.join(" ").match(/https?:\/\/|www\./gi)?.length ?? 0;
  return links > 3;
}
