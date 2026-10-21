import type { PlateTone } from "@/components/ui/Plate";
import { mediaImage } from "@/lib/media";

// The gallery: one evening, in order. From the counter and the fire, through
// the first plate and the pass, to the table, the toasts and the last
// espresso. Frames whose photograph has not been delivered are skipped, so
// the sequence always reads as photography, never as placeholders.
// `ratio` is the photograph's own width ÷ height: frames are laid out at
// their true shape (justified rows), so nothing is cropped.

export type Shot = {
  slot: string;
  /** short label, shown on the frame */
  label: string;
  /** a full sentence for the enlarged view */
  caption: string;
  alt: string;
  tone: PlateTone;
  ratio: number;
};

export const gallery: Shot[] = [
  { slot: "gallery-06", label: "The market", tone: "linen", ratio: 4 / 3, alt: "Crates of heirloom tomatoes and herbs at an early-morning market.", caption: "The market at seven in the morning, before the menu is final." },
  { slot: "gallery-11", label: "The lesson", tone: "linen", ratio: 1086 / 1448, alt: "Floured hands shaping orecchiette with a knife on a marble counter.", caption: "Orecchiette shaped one at a time on a floured counter, the way every class begins." },
  { slot: "gallery-04", label: "Hand-cut tagliatelle", tone: "linen", ratio: 1, alt: "Nests of hand-cut tagliatelle dusted with semolina on a wooden board.", caption: "Tagliatelle cut by hand and rested in nests until the water boils." },
  { slot: "gallery-08", label: "Fire", tone: "ember", ratio: 1, alt: "A whole fish in a grill basket over glowing coals, a burnt lemon beside it.", caption: "A whole fish over the coals, turned once, with a lemon burnt for the plate." },
  { slot: "gallery-01", label: "Crudo, blood orange", tone: "smoke", ratio: 1122 / 1402, alt: "Raw fluke with blood orange, shaved fennel and pistachio on a dark ceramic plate.", caption: "The first plate of the night: fluke, blood orange, fennel and pistachio." },
  { slot: "gallery-03", label: "At the pass", tone: "ember", ratio: 1086 / 1448, alt: "Chef Eric Jokl at the pass, wiping the rim of a plate.", caption: "At the pass, where the rim of every plate is wiped before it leaves the kitchen." },
  { slot: "gallery-02", label: "Before the guests", tone: "ember", ratio: 4 / 3, alt: "A long candlelit table set with ivory linen and brass, the room empty.", caption: "The table an hour before anyone arrives." },
  { slot: "gallery-09", label: "Menu cards", tone: "linen", ratio: 1122 / 1402, alt: "Printed menu cards with a gold EJ monogram beside a candle and a sprig of rosemary.", caption: "The printed menu, one at every place, for guests to take home." },
  { slot: "gallery-05", label: "Second course, at anchor", tone: "tide", ratio: 4 / 5, alt: "A plated course on a yacht's teak table at sunset.", caption: "The second course at anchor, as the light goes." },
  { slot: "gallery-10", label: "Toasts", tone: "smoke", ratio: 1448 / 1086, alt: "Glasses raised over a long candlelit table, faces out of frame.", caption: "Toasts over the third course. Guests are only ever hands and shoulders." },
  { slot: "gallery-07", label: "Dessert, last light", tone: "smoke", ratio: 1086 / 1448, alt: "A slice of olive-oil cake with macerated berries and a glass of dessert wine.", caption: "Olive-oil cake with macerated berries and a glass of something sweet." },
  { slot: "gallery-12", label: "Midnight", tone: "ember", ratio: 1122 / 1402, alt: "An espresso and a square of salted dark chocolate on a cleared table by candlelight.", caption: "Midnight: an espresso and a square of salted chocolate on a cleared table." },
];

/**
 * Pack frames into justified rows: each row fills the width, and every frame
 * in it shares one height because its width is proportional to its ratio.
 * A row closes once its ratios add up to `target` (higher = shorter rows).
 */
export function packRows<T extends { ratio: number }>(shots: T[], target = 2.4): T[][] {
  const rows: T[][] = [];
  let row: T[] = [];
  let sum = 0;
  for (const s of shots) {
    row.push(s);
    sum += s.ratio;
    if (sum >= target) {
      rows.push(row);
      row = [];
      sum = 0;
    }
  }
  if (row.length) rows.push(row);
  return rows;
}

/** The delivered frames, in sequence, with their image paths. */
export function deliveredShots(): (Shot & { src: string })[] {
  return gallery.flatMap((s) => {
    const src = mediaImage(s.slot);
    return src ? [{ ...s, src }] : [];
  });
}
