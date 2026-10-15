import type { PlateTone } from "@/components/ui/Plate";

// The Making: how a builder of digital systems came to build evenings —
// six chapters, each with a place and the lesson it left him. This is the
// "why" behind how he designs and hosts today.
// Nothing here is a dated biography: no years, employers or clients are
// claimed. CONFIRM: Eric approves every line, and adds `years` and named
// places only where he wants them published.

export type Era = {
  id: string;
  numeral: string;
  era: string;
  years?: string;
  title: string;
  place: string;
  body: string;
  lesson: string;
  plate: { tone: PlateTone; label: string; alt: string; slot?: string; src?: string };
};

export const archive: Era[] = [
  {
    id: "the-screen",
    numeral: "I",
    era: "The beginning",
    title: "The screen",
    place: "A desk, after midnight",
    body: "It started with a screen and a blank file. Code taught him the first rule of everything he builds now: every experience is a system, and a system can be designed down to the second — what loads first, what waits, what makes someone stay.",
    lesson: "Every feeling was designed by someone.",
    plate: { tone: "smoke", label: "After midnight", alt: "Eric Jokl at a desk at night, his face lit by a monitor.", slot: "era-screen" },
  },
  {
    id: "the-pressure",
    numeral: "II",
    era: "The formation",
    title: "The pressure",
    place: "Building with no safety net",
    body: "Then the years of building under pressure, with no shortcuts and nobody to hand the hard part to. Ship it, test it, fix it, raise the standard. Pressure is where taste stops being an opinion and becomes a discipline.",
    lesson: "Never confuse motion with progress.",
    plate: { tone: "tide", label: "Crossing, late", alt: "Eric Jokl crossing a wet city street at night, collar up.", slot: "era-pressure" },
  },
  {
    id: "the-attention",
    numeral: "III",
    era: "The turn",
    title: "The attention",
    place: "Brands, pages & offers",
    body: "Designing pages that make strangers trust, click and decide is a study of human attention: what people notice first, what they remember, what quietly makes them leave. A dining room obeys exactly the same laws.",
    lesson: "Trust is decided before anyone speaks.",
    plate: { tone: "linen", label: "The wall of drafts", alt: "Eric Jokl marking printed layouts pinned to a studio wall.", slot: "era-conversion" },
  },
  {
    id: "the-room",
    numeral: "IV",
    era: "The crossing",
    title: "The room",
    place: "From screens to rooms",
    body: "The next build was one people walk into instead of scroll past. Light, sound, pace, a seating plan, the moment the first plate lands: an evening is the most demanding interface there is, and nobody can refresh it.",
    lesson: "An evening is an interface. Design every touchpoint.",
    plate: { tone: "ember", label: "Setting the light", alt: "Eric Jokl adjusting a brass pendant over an empty table.", slot: "era-crossover" },
  },
  {
    id: "the-table",
    numeral: "V",
    era: "The craft",
    title: "The table",
    place: "Private rooms, anywhere",
    body: "Private evenings are where all of it meets: the systems, the taste, the obsession with how people feel. A chef's craft owns the kitchen. His craft is everything else — and the rule that the guest never sees any of it working.",
    lesson: "The guest should never see the effort.",
    plate: { tone: "linen", label: "The card at each place", alt: "Eric Jokl's hands placing a printed menu card at a place setting.", slot: "era-table" },
  },
  {
    id: "now",
    numeral: "VI",
    era: "Now",
    title: "Wherever the table is",
    place: "By arrangement",
    body: "Today Eric Jokl designs and hosts private evenings by arrangement — a city apartment, an estate, a yacht, an island — and builds the systems behind them in public. The standard is the same in every room.",
    lesson: "Every evening is built once.",
    plate: { tone: "ember", label: "The table, tonight", alt: "Eric Jokl in a doorway, a candlelit table glowing behind him.", slot: "era-now" },
  },
];

// How he works, in his terms. CONFIRM: Eric approves the wording of each
// standard — these should sound exactly like him.
export const standards = [
  { title: "The guest never sees the effort.", body: "Logistics, timing, the problem at six o'clock — none of it reaches the table. What reaches the table is the evening." },
  { title: "Design every second.", body: "Arrival, first light, first pour, the pause before dessert. Every moment is planned like a launch and timed like a show." },
  { title: "Taste is a decision.", body: "Every glass, every song, every candle height is chosen on purpose. If it does not make the night better, it does not make the room." },
  { title: "No two tables get the same night.", body: "Each evening is built for one table and one reason. If you loved a moment, it can come back — but the night is always new." },
  { title: "What is said at the table stays at the table.", body: "Eric builds in public. Your evening is never part of it. Discretion is not a policy; it is the job." },
] as const;
