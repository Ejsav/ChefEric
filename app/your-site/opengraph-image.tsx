import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og";
import { money, offer } from "@/content/offer";

// The share card for the offer: the promise, the price, the builder.
export const alt = "Your name, here — a luxury private-chef website by Eric Jokl";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const fonts = await ogFonts("Your name,", "here. A luxury private-chef website, made yours.");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#110c09", color: "#ede5d6", fontFamily: "Display, serif" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "radial-gradient(60% 70% at 70% 115%, rgba(205,140,70,0.42), rgba(120,62,28,0.15) 50%, transparent 80%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 18, letterSpacing: 6, color: "#a89b8c", fontFamily: "sans-serif" }}>
            <div style={{ width: 48, height: 1, background: "#be9c68" }} />
            {`GET THIS WEBSITE · ${money(offer.monthly)}/MONTH · NO MINIMUM TERM`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 140, lineHeight: 0.95, letterSpacing: -3 }}>
            <span>Your name,</span>
            <span style={{ fontStyle: "italic", color: "#be9c68", paddingLeft: 120 }}>here.</span>
          </div>
          <div style={{ marginTop: 34, fontSize: 30, color: "rgba(237,229,214,0.82)", fontStyle: "italic" }}>
            A luxury private-chef website, made yours.
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
