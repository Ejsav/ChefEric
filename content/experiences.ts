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
  /** what the guide covers, and what the proposal adds */
  priceNote: string;
  /** what the place needs to have, in plain terms */
  venue: string[];
  plate: { label: string; tone: PlateTone; slot?: string; src?: string; alt: string };
};

export const experiences: Experience[] = [
  {
    slug: "the-private-table",
    numeral: "I",
    name: "The Private Table",
    kicker: "In your residence",
    teaser: "Your dining room, run like the best restaurant you have never been able to book.",
    summary:
      "One table, one night, one menu that will not exist again. The chef takes the kitchen for the afternoon; you keep the dining room and every one of your guests.",
    body: [
      "The menu starts with a phone call about people, not food: who is coming, what they always order, what they secretly never would. The dishes are written around the answers.",
      "On the night the team works out of sight, serves without hovering and hands the kitchen back spotless. What stays behind is a printed card at every place, so the evening can be remembered course by course.",
    ],
    includes: [
      "A menu written for this table and this date",
      "Ingredients bought that week from producers the chef knows",
      "Cooks and servers, sized to the guest list",
      "A sommelier and paired wines, if you would like them",
      "A printed menu at every place",
    ],
    scale: "Two to twenty-four guests",
    notice: "Two to three weeks",
    from: "From $250 per guest",
    priceNote: "Covers the menu, ingredients, cooking, service and clean-up for a seated dinner. Wine, rentals and extra staff are priced separately in the proposal.",
    venue: [
      "A working stove and oven, and a little counter space",
      "Access for the team about three hours before guests arrive",
      "Plates, glasses and linen, or they are brought in",
    ],
    plate: { label: "The first course", tone: "ember", alt: "Chef Eric Jokl plating the first course in a private home kitchen.", slot: "exp-private-table" },
  },
  {
    slug: "the-island-and-the-water",
    numeral: "II",
    name: "The Island & The Water",
    kicker: "Yachts · Private islands · Destinations",
    teaser: "At anchor, offshore or a ferry ride from the nearest market.",
    summary:
      "Where there is no shop to run to, the menu is a logistics plan first. Every ingredient, knife and spare is packed before the boat leaves, so the table never finds out what it took.",
    body: [
      "Yachts, island houses and remote residences are planned as one operation: what is bought, how it travels, where it is stored, who cooks and who serves, with a second option for anything that cannot be replaced.",
      "The chef works with your captain, house manager or planner as part of the crew, from one dinner at anchor to every meal of a week away.",
    ],
    includes: [
      "A written provisioning and logistics plan",
      "Menus across the whole stay, breakfast to late supper",
      "A travelling team sized to the trip",
      "One point of contact for captain, house staff or planner",
      "Confidentiality agreements as standard",
    ],
    scale: "By arrangement",
    notice: "Six weeks or more",
    from: "By proposal",
    priceNote: "Priced as a whole stay: menus, provisioning, the travelling team, their travel and lodging, and any equipment that has to make the crossing.",
    venue: [
      "A galley or kitchen, even a compact one; without one, a field kitchen is planned",
      "Cold storage sized to the stay, confirmed with the captain or house manager",
      "A berth or room for the team on stays longer than a day",
    ],
    plate: { label: "Late service, open water", tone: "tide", alt: "Chef Eric Jokl at a grill on a private island beach at dusk, lanterns along the dock.", slot: "exp-island-water" },
  },
  {
    slug: "the-kitchen-lessons",
    numeral: "III",
    name: "The Kitchen Lessons",
    kicker: "Private cooking classes",
    teaser: "An afternoon at your own counter, flour to the elbows.",
    summary:
      "A private class in your kitchen: pasta rolled and cut by hand, fish cooked over fire, a sauce built properly from the pan. It ends with everyone sitting down to what they made.",
    body: [
      "Classes are for a family, a handful of friends or a team that would rather cook together than book another restaurant. Nobody needs to be good at it; the plan follows whoever turns up.",
      "Each guest leaves with printed recipes and the one thing a recipe cannot teach: the feel of a dough that is ready.",
    ],
    includes: [
      "A class planned around who is cooking",
      "Ingredients and every specialist tool",
      "Dinner at the end, made by the class",
      "Printed recipes for every guest",
    ],
    scale: "One to twelve participants",
    notice: "Two weeks",
    from: "From $1,500 per class",
    priceNote: "Covers a three-hour class for up to six, all ingredients and tools, and the dinner at the end. Larger groups and wine are added in the proposal.",
    venue: [
      "A counter long enough for everyone to stand at",
      "A stove and an oven; a pasta table or machine is brought in",
      "No more than twelve cooks, so everyone actually cooks",
    ],
    plate: { label: "Flour, eggs, hands", tone: "linen", alt: "Chef Eric Jokl guiding a guest's hands shaping fresh pasta at a marble counter.", slot: "exp-kitchen-lessons" },
  },
  {
    slug: "the-occasion",
    numeral: "IV",
    name: "The Occasion",
    kicker: "Celebrations · Launches · Hosted evenings",
    teaser: "Milestones up to eighty guests, run like a dinner for eight.",
    summary:
      "Big birthdays, engagements, anniversaries, a dinner for the people who built the company. The bigger the night, the more planning it takes to keep it feeling small.",
    body: [
      "A large evening is choreography: courses timed around the speeches, a team that moves without being noticed, plates that reach the far end of the table as hot as the near one.",
      "The chef plans it with you or with your planner, scales the kitchen, service and rentals to the guest list, and keeps one rule throughout: it should still feel like someone's home.",
    ],
    includes: [
      "Menu design, with a tasting if you would like one",
      "Kitchen, service and rentals, all in one proposal",
      "Coordination with your planner and venue",
      "Seated, shared or standing service",
    ],
    scale: "Up to eighty guests",
    notice: "Four weeks or more",
    from: "From $300 per guest",
    priceNote: "Covers the menu, kitchen team and service staff for a seated dinner. Rentals, tenting, bar service and a menu tasting are itemised in the proposal.",
    venue: [
      "A kitchen, or space and power for a temporary one",
      "Room for the service team to work out of sight",
      "A site visit or a floor plan at least three weeks ahead",
    ],
    plate: { label: "Toasts, third course", tone: "smoke", alt: "A long celebration table with glasses raised, Chef Eric Jokl at the pass beyond.", slot: "exp-occasion" },
  },
];
