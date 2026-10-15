#!/usr/bin/env node
// Generate a private invitation link.
//   INVITE_SECRET=... node scripts/invite.mjs "Mr. and Mrs. Whitman" --note "For the anniversary in June." --days 30 --setting yacht
// Optional: --base https://www.example.com (defaults to NEXT_PUBLIC_SITE_URL)
import { createHmac } from "node:crypto";

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1]?.startsWith("--") !== true);
const flag = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const secret = process.env.INVITE_SECRET;
if (!secret || !name) {
  console.error('Usage: INVITE_SECRET=... node scripts/invite.mjs "Name" [--note "..."] [--days 30] [--setting yacht] [--base https://...]');
  process.exit(1);
}
const days = Number(flag("days") ?? 30);
const payload = { n: name, x: Date.now() + days * 864e5 };
if (flag("note")) payload.m = flag("note");
if (flag("setting")) payload.s = flag("setting");
const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
const sig = createHmac("sha256", secret).update(body).digest("base64url");
const base = (flag("base") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
console.log(`${base}/invite/${body}.${sig}`);
console.error(`Expires ${new Date(payload.x).toDateString()}.`);
