// The four forms an evening by Eric Jokl usually takes.
// Eric designs, directs and hosts; the kitchen is led by a chef chosen for
// each table. CONFIRM: every `scale` and `notice` value, and that a chef
// partner is in place for each form before taking bookings.

import type { PlateTone } from "@/components/ui/Plate";

export type Experience = {
  slug: string;
  numeral: string;
  name: string;
  kicker: string;
  summary: string;
  body: string[];
  includes: string[];
  scale: string;
  notice: string;
  plate: { label: string; tone: PlateTone; slot?: string; src?: string; alt: string };
};

export const experiences: Experience[] = [
  {
    slug: "the-private-table",
    numeral: "I",
    name: "The Private Table",
    kicker: "In your residence",
    summary:
      "An evening designed for one table and one night. Eric directs the room; a chef chosen for your table takes the kitchen. You never leave your seat.",
    body: [
      "It begins with a conversation, not a package. Who is at the table, what they love, what the night is for. From there Eric builds the evening as a whole: the light, the music, the pace, the order of the room, and a menu written with the chef for that night only.",
      "The team arrives early, the house becomes a private dining room for a few hours, and by midnight it is a home again. The only trace is the card left at each place.",
    ],
    includes: [
      "An evening concept written for your table",
      "A chef and kitchen team chosen for the menu and the setting",
      "Table service, directed by Eric on the night",
      "Lighting, music and table design",
      "Wine pairing with a sommelier, on request",
      "Printed menu cards for each guest",
    ],
    scale: "Two to twenty-four guests",
    notice: "Two to three weeks recommended",
    plate: { label: "Before the guests", tone: "ember", alt: "Eric Jokl lighting the last candle on a set dinner table.", slot: "exp-private-table" },
  },
  {
    slug: "the-island-and-the-water",
    numeral: "II",
    name: "The Island & The Water",
    kicker: "Private islands · Yachts · Destinations",
    summary:
      "Evenings far from a market are a planning problem first. Eric treats them like a launch: every ingredient, every tool and every contingency decided before anyone sets off.",
    body: [
      "Nothing on the night should reveal how hard it was to get there. Provisioning, staffing, power, weather and timing are planned as one system, with redundancy for everything that cannot be replaced at sea or on an island.",
      "For yachts, island residences and destination weekends, Eric produces the whole stay and works alongside your captain, house manager or planner rather than around them.",
    ],
    includes: [
      "A full provisioning and logistics plan",
      "Multi-day evenings planned as one arc",
      "A travelling chef and team sized to the stay",
      "Coordination with captain, estate staff or planner",
      "Confidentiality agreements as standard",
    ],
    scale: "By arrangement",
    notice: "Six weeks or more recommended",
    plate: { label: "Late service, open water", tone: "tide", alt: "Eric Jokl walking a lantern-lit dock toward a table at the water's edge.", slot: "exp-island-water" },
  },
  {
    slug: "the-founders-table",
    numeral: "III",
    name: "The Founders' Table",
    kicker: "Salons · Builders · Ideas",
    summary:
      "A private dinner for founders, creators and operators: the right people in one room, one long conversation, and a table built to keep it going.",
    body: [
      "For a company, a fund, a brand or a host who wants a room to matter. The guest list, the seating, the single question for the table and the pace of the courses are designed around the conversation, so ideas land and introductions happen without anyone forcing them.",
      "It is the evening closest to Eric's own world: builders at a table, talking about what they are making next. Nothing is filmed or published unless every guest agrees.",
    ],
    includes: [
      "Seating plan and conversation design",
      "A menu written with the chef of the evening",
      "Invitations and guest communication, on request",
      "Printed cards and a record of the night",
    ],
    scale: "Eight to twenty-four guests",
    notice: "Three weeks recommended",
    plate: { label: "The long conversation", tone: "smoke", alt: "Eric Jokl at the head of a long candlelit table, listening.", slot: "exp-founders-table" },
  },
  {
    slug: "the-occasion",
    numeral: "IV",
    name: "The Occasion",
    kicker: "Celebrations · Launches · Hosted evenings",
    summary:
      "Anniversaries, milestone birthdays, engagements, launches, private evenings for clients. Nights where everything must be extraordinary and nobody can be seen working.",
    body: [
      "Larger evenings ask for more choreography: many guests, several courses, a room that flows, timing that lets speeches land and the next course arrive warm.",
      "Eric works with your planner or directly with you, and scales the kitchen, service, rentals and production to the occasion without losing the feeling of a private table.",
    ],
    includes: [
      "Concept, run of show and tasting, by arrangement",
      "Chef, kitchen team, service staff and rentals",
      "Planner and venue coordination",
      "Seated, family-style or roaming service",
    ],
    scale: "Up to eighty guests",
    notice: "Four weeks or more recommended",
    plate: { label: "Toasts, third course", tone: "smoke", alt: "Eric Jokl mid-toast at a long celebration table.", slot: "exp-occasion" },
  },
];
