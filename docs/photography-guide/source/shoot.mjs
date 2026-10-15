// Captures every photo slot on the live build, with the placeholder marked.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const B = "http://localhost:3100";
const OUT = new URL("./raw/", import.meta.url).pathname;

const HIDE = `#site-header,#mobile-bar,.skip-link,.cursor-ring,.cursor-dot{display:none!important}
.rg-mark{position:absolute;inset:0;z-index:50;pointer-events:none;outline:6px dashed #F5C542;outline-offset:-6px;background:rgba(245,197,66,.08)}
.rg-tag{position:absolute;left:14px;top:14px;z-index:51;font:700 26px/1.15 system-ui,sans-serif;letter-spacing:.01em;color:#1a1208;background:#F5C542;padding:12px 18px;border-radius:3px;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.rg-pin{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:51;font:700 48px/1 system-ui,sans-serif;color:#1a1208;background:#F5C542;padding:14px 20px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.45)}`;

async function prep(page) {
  await page.addStyleTag({ content: HIDE });
}
// Mark a <figure> (or its frame) with a dashed outline and a label.
async function mark(page, selector, text, pin = false) {
  await page.evaluate(({ selector, text, pin }) => {
    document.querySelectorAll(".rg-mark,.rg-tag,.rg-pin").forEach((n) => n.remove());
    const el = document.querySelector(selector);
    if (!el) throw new Error("missing " + selector);
    const host = el;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const m = document.createElement("div"); m.className = "rg-mark"; host.appendChild(m);
    const t = document.createElement("div"); t.className = pin ? "rg-pin" : "rg-tag"; t.textContent = text; host.appendChild(t);
  }, { selector, text, pin });
}
async function markAll(page, items) {
  await page.evaluate((items) => {
    for (const { selector, text } of items) {
      const el = document.querySelector(selector);
      if (!el) continue;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      const m = document.createElement("div"); m.className = "rg-mark"; el.appendChild(m);
      const t = document.createElement("div"); t.className = "rg-pin"; t.textContent = text; el.appendChild(t);
    }
  }, items);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await ctx.newPage();

// ── Home ────────────────────────────────────────────────────────────
await page.goto(B + "/", { waitUntil: "networkidle" }); await prep(page); await page.waitForTimeout(800);
await page.screenshot({ path: OUT + "home-hero.png" });

const rooms = ["residence", "penthouse", "estate", "waterfront", "yacht", "island", "hangar", "abroad"];
const files = ["setting-residence", "setting-penthouse", "setting-estate", "setting-waterfront", "setting-yacht", "setting-island", "setting-hangar", "setting-abroad"];
for (let i = 0; i < rooms.length; i++) {
  await page.evaluate((v) => { const r = document.querySelector(`#possibilities input[type=radio][value="${v}"]`); r.click(); }, rooms[i]);
  await page.waitForTimeout(500);
  await mark(page, "#possibilities figure", `PHOTO ${String(i + 1).padStart(2, "0")} · ${files[i]}.jpg`);
  const grid = page.locator("#possibilities .container-x > div").nth(1);
  await grid.screenshot({ path: OUT + `p${String(i + 1).padStart(2, "0")}.png` });
}
// reset composer to first room for the overview
await page.evaluate(() => document.querySelector('#possibilities input[value="residence"]').click());
await page.waitForTimeout(400);
await mark(page, "[aria-labelledby=chef-title] figure", "PHOTO 09 · chef-portrait.jpg");
await page.locator("[aria-labelledby=chef-title]").screenshot({ path: OUT + "p09.png" });

// Home overview with pins
await page.evaluate(() => document.querySelectorAll(".rg-mark,.rg-tag,.rg-pin").forEach((n) => n.remove()));
await markAll(page, [
  { selector: "#possibilities figure", text: "01–08" },
  { selector: "[aria-labelledby=chef-title] figure", text: "09" },
]);
await page.screenshot({ path: OUT + "overview-home.png", fullPage: true });

// ── Experiences ─────────────────────────────────────────────────────
await page.goto(B + "/experiences", { waitUntil: "networkidle" }); await prep(page); await page.waitForTimeout(800);
const exps = [
  ["the-private-table", "10", "private-table"],
  ["the-island-and-the-water", "11", "island-water"],
  ["the-kitchen-lessons", "12", "kitchen-lessons"],
  ["the-occasion", "13", "occasion"],
];
for (const [id, n, f] of exps) {
  await mark(page, `#${id} figure`, `PHOTO ${n} · ${f}.jpg`);
  await page.locator(`#${id}`).screenshot({ path: OUT + `p${n}.png` });
}
await page.evaluate(() => document.querySelectorAll(".rg-mark,.rg-tag,.rg-pin").forEach((n) => n.remove()));
await markAll(page, [
  { selector: "#possibilities figure", text: "01–08" },
  ...exps.map(([id, n]) => ({ selector: `#${id} figure`, text: n })),
]);
await page.screenshot({ path: OUT + "overview-experiences.png", fullPage: true });

// ── The Chef ────────────────────────────────────────────────────────
await page.goto(B + "/chef", { waitUntil: "networkidle" }); await prep(page); await page.waitForTimeout(1000);
const eras = [
  ["family-table", "14", "01-family-table"],
  ["the-line", "15", "02-the-line"],
  ["private-rooms", "16", "03-private-rooms"],
  ["islands", "17", "04-the-islands"],
  ["lessons", "18", "05-the-lessons"],
  ["now", "19", "06-now"],
];
for (const [id, n, f] of eras) {
  await mark(page, `#era-${id} figure`, `PHOTO ${n} · ${f}.jpg`);
  await page.locator(`#era-${id}`).screenshot({ path: OUT + `p${n}.png` });
}
await page.evaluate(() => document.querySelectorAll(".rg-mark,.rg-tag,.rg-pin").forEach((n) => n.remove()));
await markAll(page, eras.map(([id, n]) => ({ selector: `#era-${id} figure`, text: n })));
await page.screenshot({ path: OUT + "overview-chef.png", fullPage: true });

// ── Phone views ─────────────────────────────────────────────────────
const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce", isMobile: true, hasTouch: true });
const mp = await m.newPage();
await mp.goto(B + "/", { waitUntil: "networkidle" }); await prep(mp); await mp.waitForTimeout(800);
await mp.screenshot({ path: OUT + "phone-hero.png" });
await mark(mp, "[aria-labelledby=chef-title] figure", "09 · chef-portrait.jpg");
await mp.evaluate(() => document.querySelector("[aria-labelledby=chef-title] figure").scrollIntoView({ block: "start" }));
await mp.waitForTimeout(400);
await mp.screenshot({ path: OUT + "phone-portrait.png" });
await mp.goto(B + "/experiences", { waitUntil: "networkidle" }); await prep(mp); await mp.waitForTimeout(600);
await mark(mp, "#the-private-table figure", "10 · private-table.jpg");
await mp.evaluate(() => document.querySelector("#the-private-table figure").scrollIntoView({ block: "start" }));
await mp.waitForTimeout(400);
await mp.screenshot({ path: OUT + "phone-experience.png" });

await b.close();
console.log("done");
