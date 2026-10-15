#!/usr/bin/env node
// Which media slots are filled and which still show their tonal study.
//   node scripts/media-status.mjs
// Reads the slot list from content/media.ts and the files in public/media.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const source = readFileSync(join(root, "content/media.ts"), "utf8");
const slots = [...source.matchAll(/id: "([^"]+)", kind: "(image|film)"[^]*?priority: (\d)/g)].map((m) => ({ id: m[1], kind: m[2], priority: Number(m[3]) }));

let files = [];
try { files = readdirSync(join(root, "public/media")); } catch {}

const IMAGE = ["avif", "webp", "jpg", "jpeg", "png"];
const FILM = ["webm", "mp4"];
let filled = 0;
for (const s of slots) {
  const exts = s.kind === "film" ? FILM : IMAGE;
  const hits = files.filter((f) => exts.some((e) => f === `${s.id}.${e}`));
  if (hits.length) filled++;
  const size = hits.map((f) => `${f} ${(statSync(join(root, "public/media", f)).size / 1024).toFixed(0)} KB`).join(", ");
  console.log(`${hits.length ? "●" : "○"} P${s.priority} ${s.id.padEnd(22)} ${hits.length ? size : "— tonal study"}`);
}
console.log(`\n${filled}/${slots.length} slots filled.`);
const orphans = files.filter((f) => !f.startsWith(".") && !slots.some((s) => f.startsWith(`${s.id}.`)));
if (orphans.length) console.log(`Not matched to any slot: ${orphans.join(", ")}`);
