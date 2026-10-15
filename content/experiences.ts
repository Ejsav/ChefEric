// The four ways to have Chef Jokl cook for you. Demo content: every
// customer version sets its own services, scales, notice and price guides.

import type { PlateTone } from "@/components/ui/Plate";

export type Experience = {
  slug: string;
  numeral: string;
  name: string;
  kicker: string;
  /** one line for the home page card */
  teaser: string;
  summary: string;
  body: string[];
  includes: string[];
  scale: string;
  notice: string;
  /** price guide shown with the details; the proposal gives the full cost */
  from: string;
  plate: { label: string; tone: PlateTone; slot?: string; src?: string; alt: string };
};

export const experiences: Experience[] = [
  {
    slug: "the-private-table",
    numeral: "I",
    name: "The Private Table",
    kicker: "In your residence",
    teaser: "A dinner written for one evening and one table, cooked in your kitchen.",
    summary:
      "A dinner composed for one evening and one table. Chef Jokl and his team take over the kitchen; you never leave the room.",
    body: [
      "It begins with a conversation, not a menu: who is at the table, what they love, what they would never order for themselves. From there the chef writes a menu that exists once, for that night.",
      "The team arrives early, cooks in your kitchen, serves with the quiet of a great dining room and leaves it cleaner than they found it. The only trace is the menu card left at each place.",
    ],
    includes: [
      "A menu written for the evening",
      "Sourcing from trusted growers, fishmongers and butchers",
      "Kitchen team and table service",
      "Wine pairing with a sommelier, on request",
      "Printed menu cards for each guest",
    ],
    scale: "Two to twenty-four guests",
    notice: "Two to three weeks",
    from: "From $250 per guest",
    plate: { label: "The first course", tone: "ember", alt: "Chef Eric Jokl plating the first course in a private home kitchen.", slot: "exp-private-table" },
  },
  {
    slug: "the-island-and-the-water",
    numeral: "II",
    name: "The Island & The Water",
    kicker: "Yachts · Private islands · Destinations",
    teaser: "Galley-planned menus and full provisioning, at anchor or offshore.",
    summary:
      "Cooking far from a market is its own discipline. Every ingredient, tool and contingency is planned before departure, so nothing on the night reveals how far it travelled.",
    body: [
      "For yachts, island residences and destination weekends, the chef plans provisioning, staffing and service as one system, with a backup for anything that cannot be replaced at sea.",
      "He works alongside your captain, house manager or planner — not around them — from a single dinner at anchor to every meal of a stay.",
    ],
    includes: [
      "Full provisioning and logistics plan",
      "Multi-day menus across breakfast, lunch and dinner",
      "Travelling team sized to the stay",
      "Coordination with captain, estate staff or planner",
      "Confidentiality agreements as standard",
    ],
    scale: "By arrangement",
    notice: "Six weeks or more",
    from: "By proposal",
    plate: { label: "Late service, open water", tone: "tide", alt: "Chef Eric Jokl at a grill on a private island beach at dusk, lanterns along the dock.", slot: "exp-island-water" },
  },
  {
    slug: "the-kitchen-lessons",
    numeral: "III",
    name: "The Kitchen Lessons",
    kicker: "Private cooking classes",
    teaser: "The recipes are not secrets; the hands are. Taught at your counter.",
    summary:
      "Private classes at your counter: fresh pasta by hand, a sauce worth the afternoon, how to season with confidence. Everyone eats what they made.",
    body: [
      "For one family, a few friends, or a team that would rather cook together than sit through another dinner. The class is planned around the group's skill and appetite.",
      "It ends at the table, with the meal you cooked and a glass of something good — and the recipes are yours to keep.",
    ],
    includes: [
      "A class planned around the group",
      "All ingredients and specialist equipment",
      "The meal you cook, served at the end",
      "Printed recipes to keep",
    ],
    scale: "One to twelve participants",
    notice: "Two weeks",
    from: "From $1,500 per class",
    plate: { label: "Flour, eggs, hands", tone: "linen", alt: "Chef Eric Jokl guiding a guest's hands shaping fresh pasta at a marble counter.", slot: "exp-kitchen-lessons" },
  },
  {
    slug: "the-occasion",
    numeral: "IV",
    name: "The Occasion",
    kicker: "Celebrations · Launches · Hosted evenings",
    teaser: "Milestones and celebrations up to eighty, with nobody seen working.",
    summary:
      "Anniversaries, milestone birthdays, engagements, private evenings for clients. Nights where the food must be extraordinary and nobody can be seen working.",
    body: [
      "Larger evenings ask for more choreography: many courses for many guests, a room that flows, timing that lets speeches land and the next course arrive warm.",
      "The chef works with your planner or directly with you, and scales the team, rentals and service to the occasion without losing the feeling of a private table.",
    ],
    includes: [
      "Menu development and tasting, by arrangement",
      "Kitchen team, service staff and rentals",
      "Planner and venue coordination",
      "Seated, family-style or roaming service",
    ],
    scale: "Up to eighty guests",
    notice: "Four weeks or more",
    from: "From $300 per guest",
    plate: { label: "Toasts, third course", tone: "smoke", alt: "A long celebration table with glasses raised, Chef Eric Jokl at the pass beyond.", slot: "exp-occasion" },
  },
];
