import type { PlateTone } from "@/components/ui/Plate";

// The Chapters: six parts of the craft, each with the principle behind it.
// Demo content for the persona "Chef Eric Jokl", written as how the work is
// done rather than as a life story: no dates, employers, awards, mentors or
// past clients are claimed. A customer version replaces these with its own
// verified history (years and real places fit the same layout).

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
    id: "patience",
    numeral: "I",
    era: "Patience",
    title: "Started before dawn",
    place: "The stove, since morning",
    body: "The dishes people remember are rarely the quick ones. A braise, a stock, a sauce reduced over hours: the best part of the evening is often already cooking when the host wakes up.",
    lesson: "Start the slow things first.",
    plate: { tone: "linen", label: "Since early morning", alt: "A large pot of sauce simmering on an old stove, a long table set beyond.", slot: "chapter-patience" },
  },
  {
    id: "fire",
    numeral: "II",
    era: "Fire",
    title: "Heat, controlled",
    place: "Over the flame",
    body: "Fire is the one ingredient that cannot be faked or rushed. Knowing exactly when a pan is ready, when to pull a fish off the embers, when to let something rest: that is most of cooking, and none of it can be read from a recipe.",
    lesson: "Watch the heat, not the clock.",
    plate: { tone: "ember", label: "Full flame", alt: "Chef Eric Jokl tossing a pan over a high flame in a busy kitchen.", slot: "chapter-fire" },
  },
  {
    id: "the-room",
    numeral: "III",
    era: "The room",
    title: "Set before anyone arrives",
    place: "The dining room, an hour early",
    body: "Linen pressed, glasses polished, candles trimmed to the same height, chairs a hand's width from the table. Guests do not notice any of it. They only notice when it is missing.",
    lesson: "A room is ready when it looks untouched.",
    plate: { tone: "smoke", label: "An hour before", alt: "A round table for eight set by candlelight in a dark wood-panelled dining room.", slot: "chapter-room" },
  },
  {
    id: "distance",
    numeral: "IV",
    era: "Distance",
    title: "Far from the market",
    place: "Decks, docks & islands",
    body: "At sea or on an island the kitchen is only what was packed. Planning becomes part of the cooking: lists, spares, storage, a second plan for every first one, so the table never learns how far the food came.",
    lesson: "Pack twice. Serve once.",
    plate: { tone: "tide", label: "Blue hour, on deck", alt: "Chef Eric Jokl at the rail of a yacht at dusk, a table set behind him.", slot: "chapter-distance" },
  },
  {
    id: "hands",
    numeral: "V",
    era: "Hands",
    title: "Made by hand",
    place: "A floured counter",
    body: "Pasta rolled and cut, ravioli sealed one at a time, bread shaped rather than bought. Machines are faster. Hands are the reason it tastes like someone made it for you.",
    lesson: "If it can be made by hand, make it by hand.",
    plate: { tone: "linen", label: "By hand", alt: "Hands sealing ravioli on a floured wooden board.", slot: "chapter-hands" },
  },
  {
    id: "tonight",
    numeral: "VI",
    era: "Tonight",
    title: "One table, one night",
    place: "New York, and wherever you are",
    body: "All of it comes down to one evening at one table: an apartment above the avenue, a lawn on the East End, a deck at anchor, a dock at the edge of an island. The menu is written for it and will not be cooked again.",
    lesson: "Every menu is written once.",
    plate: { tone: "ember", label: "The table, tonight", alt: "Chef Eric Jokl at the door of a candlelit dining room, looking back.", slot: "chapter-tonight" },
  },
];

// How he works, in his own terms. Each customer version rewrites these in
// their own voice.
export const standards = [
  { title: "Nobody sees the work.", body: "The late delivery, the oven that runs hot, the plan B for the rain: all of it is dealt with out of sight. What reaches the table is only the dinner." },
  { title: "Taste it twice.", body: "Once at the stove and once at the pass, every plate, every time. Seasoning is a decision made on purpose." },
  { title: "Hand the kitchen back better.", body: "Counters wiped, floors mopped, the dishwasher emptied. The only sign anyone cooked should be the leftovers wrapped in the fridge." },
  { title: "Never the same night twice.", body: "A favourite dish can return by request. The menu around it is always new, because the table and the occasion are." },
  { title: "Silence is part of the service.", body: "Conversations heard at the table are not repeated, names are not mentioned, and nobody posts about where they cooked." },
] as const;
