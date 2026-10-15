import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// 1200×630 share card rendered at build time: the name in Bodoni under a
// warm candle pool, the same scene as the hero. When the portrait slot is
// filled (public/media/portrait.jpg or .png) it takes the right of the card.
export const alt = "Chef Eric Jokl — Private tables, by arrangement";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function font(text: string, family: string, ital = false) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:${ital ? "ital@1" : "wght@400"}&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

// The share renderer reads JPEG and PNG only.
function portrait(): string | null {
  for (const [ext, mime] of [["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["png", "image/png"]] as const) {
    try {
      const buf = readFileSync(join(process.cwd(), "public", "media", `portrait.${ext}`));
      return `data:${mime};base64,${buf.toString("base64")}`;
    } catch {}
  }
  return null;
}

export default async function OG() {
  const [roman, italic] = await Promise.all([
    font("Eric", "Bodoni+Moda"),
    font("Chef Jokl Private dinners, written once, for one table.", "Bodoni+Moda", true),
  ]);
  const fonts = [
    roman && { name: "Bodoni", data: roman, style: "normal" as const, weight: 400 as const },
    italic && { name: "Bodoni", data: italic, style: "italic" as const, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 400 }[];
  const face = portrait();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#110c09", color: "#ede5d6", fontFamily: "Bodoni, serif" }}>
        {face ? (
          <img src={face} alt="" width={504} height={630} style={{ position: "absolute", right: 0, top: 0, width: 504, height: 630, objectFit: "cover" }} />
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: face
              ? "linear-gradient(90deg, #110c09 50%, rgba(17,12,9,0.55) 72%, rgba(17,12,9,0.05) 100%)"
              : "radial-gradient(60% 70% at 50% 110%, rgba(205,140,70,0.42), rgba(120,62,28,0.15) 50%, transparent 80%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 18, letterSpacing: 6, color: "#a89b8c", fontFamily: "sans-serif" }}>
            <div style={{ width: 48, height: 1, background: "#be9c68" }} />
            PRIVATE CHEF · NEW YORK
          </div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 28, fontSize: 150, lineHeight: 0.95, letterSpacing: -3 }}>
            <span style={{ fontSize: 34, fontStyle: "italic", color: "#be9c68", marginRight: 18 }}>Chef</span>
            Eric&nbsp;<span style={{ fontStyle: "italic" }}>Jokl</span>
          </div>
          <div style={{ marginTop: 34, fontSize: 30, color: "rgba(237,229,214,0.82)", fontStyle: "italic" }}>
            Private dinners, written once, for one table.
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
