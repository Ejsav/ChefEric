#!/usr/bin/env node
// Repository boundary. This repository is the Chef Eric Jokl template and
// must never carry material from the separate client project it was once
// built alongside. Fails (exit 1) if any tracked text file matches a term
// below. Runs first in `npm run check` and in CI.
//   node scripts/guard.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const self = "scripts/guard.mjs";
const forbidden = [
  [/gennaro/i, "client name"],
  [/chef-ray/i, "client Vercel project or domain"],
  [/\bRay\b(?![-\w])/, "client first name"],
  [/\bRG-[A-Z0-9]{2,}/, "client inquiry reference prefix"],
  [/["'`]rg:/, "client storage key prefix"],
  [/new haven/i, "client hometown"],
  [/sunday gravy/i, "client signature dish"],
];

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter((f) => f && f !== self && f !== "package-lock.json");

const hits = [];
for (const file of files) {
  let text;
  try { text = readFileSync(file, "utf8"); } catch { continue; }
  if (text.includes("\u0000")) continue; // binary
  text.split("\n").forEach((line, i) => {
    for (const [re, why] of forbidden) if (re.test(line)) hits.push(`${file}:${i + 1}  ${why}: ${line.trim().slice(0, 120)}`);
  });
}

if (hits.length) {
  console.error(`Repository boundary violated (${hits.length}):\n${hits.join("\n")}`);
  console.error("\nThis repository must stay independent of the client project. Remove the material above.");
  process.exit(1);
}
console.log(`Repository boundary holds (${files.length} files checked).`);
