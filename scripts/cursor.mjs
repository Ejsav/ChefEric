#!/usr/bin/env node
// Builds the fork cursor: a miniature dining fork drawn as vector geometry,
// rendered to crisp PNGs at 1x, 2x and 3x for every display density.
//   npm run cursor:build
// Writes public/cursor/fork{,-hover,-press}{.svg,.png,@2x.png,@3x.png}.
//
// Geometry is authored in "fork space": the point where the tines meet the
// plate is the origin, the fork's axis runs down +y towards the handle, and
// one unit is one CSS pixel. The fork is then turned so the tines point to
// the upper left and the handle to the lower right, like a pointer, and the
// origin is placed on the cursor's hotspot. The CSS hotspot (HOTSPOT below,
// mirrored in app/globals.css) is therefore exactly the tip of the tines.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const SIZE = 32;          // CSS px; the largest cursor every browser draws everywhere
export const HOTSPOT = [4, 4];   // the pixel the tines point at (app/globals.css uses the same)
export const ANGLE = -38;        // degrees; a pointer's lean, tines to the upper left

const TIP = [HOTSPOT[0] + 0.5, HOTSPOT[1] + 0.5]; // centre of the hotspot pixel

// ── Fork space ────────────────────────────────────────────────────────────
// Dinner-fork proportions: tines about a third of the length, a slender
// neck, a long handle that widens gently to a rounded end.
const TINE = 0.95;      // tine width
const GAP = 0.86;       // gap between tines
const PITCH = TINE + GAP;
const ROOT = 8.0;       // where the slots between tines end
const centres = [-1.5, -0.5, 0.5, 1.5].map((k) => k * PITCH);
const tipY = (c) => (Math.abs(c) < 1.5 ? 0 : 0.5); // inner tines lead, outer follow: a gentle arc
const half = TINE / 2;
const R = (n) => Math.round(n * 1000) / 1000;
const P = (x, y) => `${R(x)} ${R(y)}`;
const HEAD = centres[3] + half; // half-width of the head

function forkPath() {
  const d = [];
  centres.forEach((c, i) => {
    const t = tipY(c);
    const L = c - half, Rt = c + half;
    d.push(`${i === 0 ? "M" : "L"} ${P(L, t + 1.25)}`);
    // A tapered tip: pointed enough to read as a tine, rounded so it never looks sharp.
    d.push(`C ${P(L, t + 0.45)} ${P(c - 0.16, t)} ${P(c, t)}`);
    d.push(`C ${P(c + 0.16, t)} ${P(Rt, t + 0.45)} ${P(Rt, t + 1.25)}`);
    if (i < centres.length - 1) {
      // Down into the slot and round its floor.
      d.push(`L ${P(Rt, ROOT - GAP / 2)}`);
      d.push(`A ${R(GAP / 2)} ${R(GAP / 2)} 0 0 0 ${P(Rt + GAP, ROOT - GAP / 2)}`);
    }
  });
  // Right side: the shoulder sweeps into the neck, the handle widens, the end rounds off.
  d.push(`L ${P(HEAD, 9.0)}`);
  d.push(`C ${P(HEAD, 11.2)} ${P(1.35, 12.1)} ${P(0.75, 13.6)}`);
  d.push(`C ${P(0.7, 15.5)} ${P(0.95, 19)} ${P(1.18, 22)}`);
  d.push(`C ${P(1.32, 24)} ${P(1.5, 25.6)} ${P(1.48, 26.9)}`);
  d.push(`C ${P(1.46, 28.3)} ${P(0.85, 29.05)} ${P(0, 29.1)}`);
  // Left side, mirrored.
  d.push(`C ${P(-0.85, 29.05)} ${P(-1.46, 28.3)} ${P(-1.48, 26.9)}`);
  d.push(`C ${P(-1.5, 25.6)} ${P(-1.32, 24)} ${P(-1.18, 22)}`);
  d.push(`C ${P(-0.95, 19)} ${P(-0.7, 15.5)} ${P(-0.75, 13.6)}`);
  d.push(`C ${P(-1.35, 12.1)} ${P(-HEAD, 11.2)} ${P(-HEAD, 9.0)}`);
  d.push("Z");
  return d.join(" ");
}

// The bevel: a fine line just inside the handle's edge, as on a fiddle-pattern
// handle. Visible at 2x and 3x; at 1x it melts into the shading.
function bevelPath() {
  const k = 0.42;
  return [
    `M ${P(-1.18 + k, 22)}`,
    `C ${P(-1.32 + k, 24)} ${P(-1.5 + k, 25.6)} ${P(-1.48 + k, 26.9)}`,
    `C ${P(-1.46 + k, 27.9)} ${P(-0.7, 28.55)} ${P(0, 28.6)}`,
    `C ${P(0.7, 28.55)} ${P(1.46 - k, 27.9)} ${P(1.48 - k, 26.9)}`,
    `C ${P(1.5 - k, 25.6)} ${P(1.32 - k, 24)} ${P(1.18 - k, 22)}`,
  ].join(" ");
}

// ── Finish ────────────────────────────────────────────────────────────────
// Champagne-gold flatware in the site's brass, lit from the upper left:
// a cylindrical sweep across the width (the head curves away, so its outer
// tines fall into shade), a soft falloff along the length, a polished
// streak down the handle, a crisp ink rim and a small, close shadow.
const finishes = {
  rest: {
    metal: ["#5b4122", "#9c7a45", "#d9bd86", "#fbf1dc", "#fffaf0", "#e4c995", "#a9834b", "#5f4524"],
    rim: "#1d140d", rimOpacity: 0.92,
    shadow: { dx: 0.7, dy: 1.15, blur: 0.75, opacity: 0.42 },
    streak: 0.75, glint: false, scale: [1, 1],
  },
  // Over anything you can act on: polished brighter, a glint on the
  // shoulder, and a touch larger, anchored at the tips.
  hover: {
    metal: ["#6a4d29", "#b38f55", "#ecd3a0", "#fff8ea", "#ffffff", "#f1dbb0", "#bf9a5f", "#6c4f2a"],
    rim: "#1d140d", rimOpacity: 0.95,
    shadow: { dx: 0.8, dy: 1.3, blur: 0.85, opacity: 0.45 },
    streak: 0.95, glint: true, scale: [1.05, 1.05],
  },
  // Pressed into the plate: foreshortened along its length (the handle tips
  // up towards you), a shade darker, its shadow tucked in close.
  press: {
    metal: ["#4f381d", "#8c6b3b", "#c9aa72", "#efdfbf", "#f8edd6", "#d3b680", "#987442", "#523b1f"],
    rim: "#160f0a", rimOpacity: 0.95,
    shadow: { dx: 0.35, dy: 0.6, blur: 0.5, opacity: 0.55 },
    streak: 0.6, glint: false, scale: [0.97, 0.84],
  },
};

function svg(state) {
  const f = finishes[state];
  const stops = f.metal.map((c, i) => `<stop offset="${R(i / (f.metal.length - 1))}" stop-color="${c}"/>`).join("");
  const [sx, sy] = f.scale;
  const fork = forkPath();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="metal" gradientUnits="userSpaceOnUse" x1="-2.2" y1="0" x2="2.2" y2="0">${stops}</linearGradient>
    <linearGradient id="length" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="29.5">
      <stop offset="0" stop-color="#fff" stop-opacity="0.10"/>
      <stop offset="0.27" stop-color="#fff" stop-opacity="0.28"/>
      <stop offset="0.43" stop-color="#000" stop-opacity="0.22"/>
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.92" stop-color="#fff" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.12"/>
    </linearGradient>
    <linearGradient id="streak" gradientUnits="userSpaceOnUse" x1="0" y1="15" x2="0" y2="28.6">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.35" stop-color="#fff" stop-opacity="${f.streak}"/>
      <stop offset="0.8" stop-color="#fff" stop-opacity="${R(f.streak * 0.55)}"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feDropShadow dx="${f.shadow.dx}" dy="${f.shadow.dy}" stdDeviation="${f.shadow.blur}" flood-color="#000" flood-opacity="${f.shadow.opacity}"/>
    </filter>
    <clipPath id="body"><path d="${fork}"/></clipPath>
  </defs>
  <g filter="url(#shadow)">
    <g transform="translate(${TIP[0]} ${TIP[1]}) rotate(${ANGLE}) scale(${sx} ${sy})">
      <path d="${fork}" fill="url(#metal)" stroke="${f.rim}" stroke-opacity="${f.rimOpacity}" stroke-width="0.85" stroke-linejoin="round" paint-order="stroke"/>
      <g clip-path="url(#body)">
        <path d="${fork}" fill="url(#length)"/>
        <path d="M -0.3 15.4 C -0.36 19 -0.56 24 -0.5 28.2" fill="none" stroke="url(#streak)" stroke-width="0.45" stroke-linecap="round"/>
        <path d="${bevelPath()}" fill="none" stroke="#5a4020" stroke-opacity="0.4" stroke-width="0.22"/>
        <path d="M ${R(-HEAD + 0.3)} 9 C ${R(-HEAD + 0.34)} 10.9 -1.1 11.9 -0.5 13.3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.3" stroke-linecap="round"/>
      </g>
      ${f.glint ? `<g transform="translate(2.2 10.2)" opacity="0.88"><path d="M 0 -1.35 L 0.17 -0.17 L 1.35 0 L 0.17 0.17 L 0 1.35 L -0.17 0.17 L -1.35 0 L -0.17 -0.17 Z" fill="#fff"/><circle r="0.34" fill="#fff"/></g>` : ""}
    </g>
  </g>
</svg>
`;
}

// ── Build ─────────────────────────────────────────────────────────────────
const root = join(import.meta.dirname, "..");
const out = join(root, "public", "cursor");

export async function build() {
  mkdirSync(out, { recursive: true });
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  for (const state of Object.keys(finishes)) {
    const name = state === "rest" ? "fork" : `fork-${state}`;
    const markup = svg(state);
    writeFileSync(join(out, `${name}.svg`), markup);
    for (const scale of [1, 2, 3]) {
      const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: SIZE, height: SIZE } });
      await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${markup}</body></html>`);
      const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
      writeFileSync(join(out, `${name}${scale === 1 ? "" : `@${scale}x`}.png`), png);
      await page.close();
    }
    console.log(`Wrote public/cursor/${name}.svg and ${name}{,@2x,@3x}.png`);
  }
  await browser.close();
}

if (import.meta.url === `file://${process.argv[1]}`) await build();
