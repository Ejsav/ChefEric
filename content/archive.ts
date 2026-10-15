import type { PlateTone } from "@/components/ui/Plate";

// The Story: the chef's path as six chapters, each with a place and the
// lesson it left him — the "why" behind how he cooks and hosts today.
// Demo content for the persona "Chef Eric Jokl": deliberately free of dates,
// employers, awards or names. Each customer version tells its own story and
// can add `years` and real places; the layout already makes room.

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
    id: "family-table",
    numeral: "I",
    era: "The beginning",
    title: "The family table",
    place: "A crowded kitchen, Sundays",
    body: "It started where most cooks start: a small kitchen, a big table, more chairs than the room was built for. Feeding people properly was not a hobby there. It was how you showed respect.",
    lesson: "Feed people properly — generously, and without shortcuts.",
    plate: { tone: "linen", label: "Sunday, before noon", alt: "A young Eric Jokl at a family stove, a pot simmering.", slot: "era-family-table" },
  },
  {
    id: "the-line",
    numeral: "II",
    era: "The formation",
    title: "The line",
    place: "Restaurant kitchens",
    body: "Then the line: heat, speed and the discipline of service. A restaurant kitchen teaches what no home kitchen can — timing to the second, consistency at volume, and respect for the people working beside you.",
    lesson: "Consistency is a form of respect.",
    plate: { tone: "ember", label: "Service, nine o’clock", alt: "Chef Eric Jokl on a restaurant line mid-service, flame beneath a pan.", slot: "era-the-line" },
  },
  {
    id: "private-rooms",
    numeral: "III",
    era: "The turn",
    title: "The private rooms",
    place: "Homes, estates & private dining rooms",
    body: "Private service asks for something a restaurant never does. The guest is not a ticket on a rail; you are standing in their home. Precision has to sit beside warmth, and everything happens with absolute discretion.",
    lesson: "The guest should never see the effort.",
    plate: { tone: "smoke", label: "A private room", alt: "A low-lit private dining room, one table set for eight.", slot: "era-private-rooms" },
  },
  {
    id: "the-water",
    numeral: "IV",
    era: "The distance",
    title: "The water",
    place: "Yachts & private islands",
    body: "Cooking at sea or on an island is the purest test of planning. Every ingredient, tool and contingency is accounted for before departure — and the measure of success is that nobody at the table notices how far the food travelled.",
    lesson: "Plan for everything, so the evening feels like nothing was planned.",
    plate: { tone: "tide", label: "Open water", alt: "Chef Eric Jokl on a yacht's deck at dusk, a table set behind him.", slot: "era-the-water" },
  },
  {
    id: "the-lessons",
    numeral: "V",
    era: "The circle",
    title: "The lessons",
    place: "Counters, everywhere",
    body: "Teaching closes the circle: the feel of a dough, the patience of a sauce, the confidence to season by taste. What was handed to him, he hands on, one counter at a time.",
    lesson: "What you were given, you hand on.",
    plate: { tone: "linen", label: "Hands in the dough", alt: "Chef Eric Jokl's hands shaping fresh pasta on a floured counter.", slot: "era-the-lessons" },
  },
  {
    id: "now",
    numeral: "VI",
    era: "Now",
    title: "Wherever the table is",
    place: "New York, and beyond",
    body: "Today Chef Jokl cooks for private tables from New York and travels by arrangement — a Manhattan apartment, a Hamptons lawn, a yacht, an island. The family table is still the reference for all of it.",
    lesson: "Every menu is written once.",
    plate: { tone: "ember", label: "The table, tonight", alt: "Chef Eric Jokl in a doorway, a candlelit table glowing behind him.", slot: "era-now" },
  },
];

// How he works, in his terms. Each customer version rewrites these in their
// own voice.
export const standards = [
  { title: "The guest never sees the effort.", body: "Preparation, logistics, the problem with the oven at six o'clock — none of it reaches the table. What reaches the table is the evening." },
  { title: "Taste everything. Twice.", body: "Once when it is made, once before it leaves. Seasoning is a decision, not a habit." },
  { title: "Leave the kitchen cleaner than you found it.", body: "It is your home. The team leaves it as if nobody had cooked there — except for the smell of garlic, which is permanent." },
  { title: "No two tables get the same night.", body: "Menus are written for one table and one occasion. If you loved a dish, it can come back — but the evening is always new." },
  { title: "What is said at the table stays at the table.", body: "Discretion is not a policy; it is how you behave in someone else's home." },
] as const;
