import type { PlateTone } from "@/components/ui/Plate";

// The composer's vocabulary. Visitors don't pick a package; they set a room,
// a reason and a scale, and read the evening that results. Every line is
// written to combine naturally with every other.
// Each customer version sets the rooms it wants to be imagined in.

export type Setting = {
  id: string;
  name: string;      // option label
  phrase: string;    // "aboard a yacht"
  tone: PlateTone;
  plateLabel: string;
  slot: string;      // media slot (content/media.ts)
  line: string;      // what the place asks of the evening
  approach: string[];
};

export type Occasion = { id: string; name: string; title: string; fragment: string };
export type Scale = { id: string; name: string; range: string; line: string; guests: string };

export const settings: Setting[] = [
  {
    id: "residence",
    name: "A private home",
    phrase: "in a private home",
    tone: "ember",
    plateLabel: "Your dining room, after dark",
    slot: "room-residence",
    line: "For one night the house works like a restaurant with a single table. By the time the last guest leaves, it is simply your home again, and the kitchen is cleaner than you left it.",
    approach: ["A look at the kitchen a few days before", "Extra burners, ovens or tableware brought in if needed", "Service laid out around the rooms you actually want to use"],
  },
  {
    id: "penthouse",
    name: "A Manhattan penthouse",
    phrase: "in a Manhattan penthouse",
    tone: "smoke",
    plateLabel: "Above the avenue",
    slot: "room-penthouse",
    line: "City kitchens are small and the views are not. Most of the work is finished before the elevator ride up, so the apartment smells of dinner, not of a catering job.",
    approach: ["Doormen, freight elevators and delivery windows booked ahead", "Prep completed off-site, finishing done in your kitchen", "Courses timed to the skyline coming on"],
  },
  {
    id: "estate",
    name: "A Hamptons estate",
    phrase: "on a Hamptons estate",
    tone: "linen",
    plateLabel: "Long table, late August",
    slot: "room-estate",
    line: "A table across the lawn, the water somewhere past the hydrangeas, dinner moving at the pace of the sunset. What is on the plate comes from the farm stands and boats down the road.",
    approach: ["Produce and fish from East End growers and day boats", "A rain plan as finished as the dry one", "Service for the lawn, the terrace or the dining room"],
  },
  {
    id: "waterfront",
    name: "A waterfront home",
    phrase: "on the water",
    tone: "tide",
    plateLabel: "Blue hour, doors open",
    slot: "room-waterfront",
    line: "Glass doors folded back, the bay a few steps away, a warm night that does not need a jacket. The food follows the heat: citrus, raw fish, fire, nothing heavy.",
    approach: ["Menus written around Gulf and Atlantic seafood", "Team and supplies arranged before the flight down", "Courses held back until the evening cools"],
  },
  {
    id: "yacht",
    name: "Aboard a yacht",
    phrase: "aboard a yacht",
    tone: "tide",
    plateLabel: "Anchored, second course",
    slot: "room-yacht",
    line: "A galley is the most exact kitchen there is: every pan has a place and every ingredient is counted before the boat leaves the dock.",
    approach: ["Planned with the captain and the interior crew", "Provisioning sized to the galley and the cold storage", "Dishes that hold steady when the sea does not"],
  },
  {
    id: "island",
    name: "On a private island",
    phrase: "on a private island",
    tone: "tide",
    plateLabel: "The end of the dock",
    slot: "room-island",
    line: "If it is not on the boat, it does not exist. Island dinners are packed like expeditions and served as if the market were next door.",
    approach: ["A packing and transport plan signed off before departure", "A spare for every ingredient and tool that matters", "Menus across the stay that waste nothing that made the crossing"],
  },
  {
    id: "hangar",
    name: "In a private hangar",
    phrase: "in a private hangar",
    tone: "smoke",
    plateLabel: "Wheels down, table set",
    slot: "room-hangar",
    line: "Polished concrete, a jet parked overhead, a single long table lit by candles. Handled well, it is the most memorable dining room your guests will see all year.",
    approach: ["Power, rentals and access agreed with the FBO", "A field kitchen built to fit the space", "Service paced around landings and arrivals"],
  },
  {
    id: "abroad",
    name: "Somewhere abroad",
    phrase: "abroad",
    tone: "linen",
    plateLabel: "A terrace, elsewhere",
    slot: "room-abroad",
    line: "A rented villa, a chalet for the week, a terrace over somebody else's sea. The chef travels with the standard and buys locally the moment he lands.",
    approach: ["Local suppliers checked before arrival", "A travelling team, or one hired and briefed on site", "Menus that taste of the place you are in"],
  },
];

export const occasions: Occasion[] = [
  { id: "friends", name: "Friends", title: "Dinner among friends", fragment: "a night for friends who know every restaurant in town and would rather stay in" },
  { id: "milestone", name: "A milestone", title: "A milestone", fragment: "a birthday or anniversary with a menu nobody will ever be served again" },
  { id: "business", name: "Hosting", title: "An evening of hosting", fragment: "a dinner built for conversation, where the food keeps people at the table an hour longer than planned" },
  { id: "family", name: "Family", title: "Family, together", fragment: "a family gathering: one long table, every generation, and nobody stuck in the kitchen" },
  { id: "celebration", name: "A celebration", title: "A celebration", fragment: "an engagement, a deal closed, someone coming home: a night that needs a toast" },
  { id: "lesson", name: "A class", title: "A private class", fragment: "a private class where everyone cooks and everyone sits down to what they made" },
];

export const scales: Scale[] = [
  { id: "intimate", name: "Intimate", range: "Two to eight", guests: "2-8", line: "Small enough for the chef to bring each course out and say a word about it." },
  { id: "gathering", name: "A gathering", range: "Ten to twenty-four", guests: "10-24", line: "One long table or a few round ones, with a service team that moves like it has rehearsed, because it has." },
  { id: "grand", name: "An occasion", range: "Twenty-five and beyond", guests: "25-60", line: "More cooks, more planning, the same promise: it should still feel like dinner at someone's house." },
];
