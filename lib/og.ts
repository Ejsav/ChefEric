// Shared by the share cards (opengraph-image.tsx files): fetch only the
// glyphs a card uses from Google Fonts at build time. If the network is
// unavailable the card still renders, in the fallback serif.
export async function ogFont(text: string, family: string, ital = false) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:${ital ? "ital@1" : "wght@400"}&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function ogFonts(roman: string, italic: string) {
  const [r, i] = await Promise.all([ogFont(roman, "Instrument+Serif"), ogFont(italic, "Instrument+Serif", true)]);
  return [
    r && { name: "Display", data: r, style: "normal" as const, weight: 400 as const },
    i && { name: "Display", data: i, style: "italic" as const, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 400 }[];
}
