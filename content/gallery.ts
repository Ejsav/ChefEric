import type { PlateTone } from "@/components/ui/Plate";

// The gallery: food, rooms and the work, in one editorial sequence. The home
// page shows the first seven; /gallery shows all twelve. Ratios alternate so
// the masonry reads like a contact sheet, not a grid of thumbnails.

export type Shot = { slot: string; label: string; alt: string; tone: PlateTone; ratio: "aspect-[4/5]" | "aspect-[3/4]" | "aspect-square" | "aspect-[4/3]" };

export const gallery: Shot[] = [
  { slot: "gallery-01", label: "Crudo, blood orange", tone: "smoke", ratio: "aspect-[4/5]", alt: "Raw fluke with blood orange and fennel on a dark ceramic plate." },
  { slot: "gallery-02", label: "Before the guests", tone: "ember", ratio: "aspect-[4/3]", alt: "A long candlelit table set with ivory linen and brass, the room empty." },
  { slot: "gallery-03", label: "At the pass", tone: "ember", ratio: "aspect-[3/4]", alt: "Chef Eric Jokl at the pass, wiping the rim of a plate." },
  { slot: "gallery-04", label: "Hand-cut tagliatelle", tone: "linen", ratio: "aspect-square", alt: "Nests of hand-cut tagliatelle dusted with semolina on a wooden board." },
  { slot: "gallery-05", label: "Second course, at anchor", tone: "tide", ratio: "aspect-[4/5]", alt: "A plated course on a yacht's teak table at sunset." },
  { slot: "gallery-06", label: "The market", tone: "linen", ratio: "aspect-[4/3]", alt: "Crates of heirloom tomatoes and herbs at an early-morning market." },
  { slot: "gallery-07", label: "Dessert, last light", tone: "smoke", ratio: "aspect-[3/4]", alt: "A slice of olive-oil cake with macerated berries and a glass of dessert wine." },
  { slot: "gallery-08", label: "Fire", tone: "ember", ratio: "aspect-square", alt: "A whole fish over glowing coals on an outdoor grill." },
  { slot: "gallery-09", label: "Menu cards", tone: "linen", ratio: "aspect-[4/5]", alt: "Letterpress menu cards fanned on ivory linen." },
  { slot: "gallery-10", label: "Toasts", tone: "smoke", ratio: "aspect-[4/3]", alt: "Glasses raised over a long celebration table, faces out of frame." },
  { slot: "gallery-11", label: "The lesson", tone: "linen", ratio: "aspect-[3/4]", alt: "Floured hands shaping orecchiette on a marble counter." },
  { slot: "gallery-12", label: "Midnight", tone: "ember", ratio: "aspect-[4/5]", alt: "An espresso and a square of dark chocolate on a cleared table by candlelight." },
];
