import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Private invitation links. A token is a small JSON payload (who, an optional
// note, an expiry) plus an HMAC-SHA256 signature made with INVITE_SECRET.
// Nothing is stored: the link is the record, it cannot be edited without
// breaking the signature, and it expires on its own. Generate with
// `node scripts/invite.mjs "Name" --note "..." --days 30`.
// This is the seed of client portals and private proposal pages.

export type InvitePayload = {
  n: string;   // name as it should be addressed
  m?: string;  // optional note from the chef's office
  s?: string;  // optional setting id to pre-select
  x: number;   // expiry, ms since epoch
};

export type InviteResult =
  | { ok: true; payload: InvitePayload }
  | { ok: false; reason: "invalid" | "expired" | "unconfigured" };

const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64url");

export function verifyInvite(token: string): InviteResult {
  const secret = process.env.INVITE_SECRET;
  if (!secret) return { ok: false, reason: "unconfigured" };
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, reason: "invalid" };
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as InvitePayload;
    if (typeof payload.n !== "string" || typeof payload.x !== "number") return { ok: false, reason: "invalid" };
    if (Date.now() > payload.x) return { ok: false, reason: "expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
