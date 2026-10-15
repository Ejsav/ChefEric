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
    line: "The house becomes the restaurant for one night, then goes back to being a home before midnight. Your china, if you like. Your kitchen, left cleaner than it was.",
    approach: ["A walkthrough of the kitchen ahead of time", "Equipment brought in where the home kitchen needs it", "Service planned around the rooms you want to use"],
  },
  {
    id: "penthouse",
    name: "A Manhattan penthouse",
    phrase: "in a Manhattan penthouse",
    tone: "smoke",
    plateLabel: "Above the avenue",
    slot: "room-penthouse",
    line: "Above the city, the kitchen is often the smallest room in the apartment. It is enough. Service is planned around elevators, doormen and the view.",
    approach: ["Building access and freight timing arranged in advance", "Preparation finished off-site when space is tight", "Courses paced to the light over the skyline"],
  },
  {
    id: "estate",
    name: "A Hamptons estate",
    phrase: "on a Hamptons estate",
    tone: "linen",
    plateLabel: "Long table, late August",
    slot: "room-estate",
    line: "Long summer tables, a garden, the ocean somewhere beyond the hedges. The menu follows the East End's farms and the season's catch.",
    approach: ["Sourcing from local farms and day boats when the season allows", "An indoor plan and an outdoor plan — weather is a guest too", "Staffing for lawn, terrace or dining room"],
  },
  {
    id: "waterfront",
    name: "A waterfront home in Florida",
    phrase: "on the water in Florida",
    tone: "tide",
    plateLabel: "Doors open to the bay",
    slot: "room-waterfront",
    line: "Warm nights, open doors, a kitchen that gives onto the water. The cooking gets lighter; the hospitality stays exactly the same.",
    approach: ["Menus built around the coast's seafood", "Travelling team and provisioning planned in advance", "Service timed to the cooling of the evening"],
  },
  {
    id: "yacht",
    name: "Aboard a yacht",
    phrase: "aboard a yacht",
    tone: "tide",
    plateLabel: "Anchored, second course",
    slot: "room-yacht",
    line: "A galley is a precise place to cook. Everything is stowed, planned and accounted for before the lines are cast off.",
    approach: ["Coordination with the captain and interior crew", "Provisioning built around galley and storage", "Menus that respect motion, space and the sea"],
  },
  {
    id: "island",
    name: "On a private island",
    phrase: "on a private island",
    tone: "tide",
    plateLabel: "Lanterns along the dock",
    slot: "room-island",
    line: "The purest test of planning: what is not on the boat does not exist. Everything is planned before departure, with a backup for every ingredient.",
    approach: ["A full logistics plan before departure", "Redundancy for every critical ingredient and tool", "Multi-day menus that use everything that arrives"],
  },
  {
    id: "hangar",
    name: "In a private hangar",
    phrase: "in a private hangar",
    tone: "smoke",
    plateLabel: "Wheels down, table set",
    slot: "room-hangar",
    line: "Aviation spaces are vast, clean and dramatic. Dressed properly, a hangar becomes the most unexpected dining room of the year.",
    approach: ["Venue, rentals and power planned with the operator", "A mobile kitchen built for the space", "Service timed around arrivals"],
  },
  {
    id: "abroad",
    name: "Somewhere abroad",
    phrase: "abroad",
    tone: "linen",
    plateLabel: "A terrace, elsewhere",
    slot: "room-abroad",
    line: "A villa, a chalet, a borrowed palazzo. The chef travels by arrangement, bringing his standard and sourcing where he lands.",
    approach: ["Local suppliers vetted before arrival", "A team that travels, or is assembled on site", "Menus that honour exactly where you are"],
  },
];

export const occasions: Occasion[] = [
  { id: "friends", name: "Friends", title: "Dinner among friends", fragment: "an evening for friends who have eaten everywhere and would like, for once, to be looked after" },
  { id: "milestone", name: "A milestone", title: "A milestone", fragment: "a birthday or anniversary that deserves its own menu — written once, never served again" },
  { id: "business", name: "Hosting", title: "An evening of hosting", fragment: "a dinner where the conversation is the point, and the food makes everyone stay a little longer" },
  { id: "family", name: "Family", title: "Family, together", fragment: "a family gathering: one long table, every generation, and nobody stuck in the kitchen" },
  { id: "celebration", name: "A celebration", title: "A celebration", fragment: "an engagement, a closing, a homecoming — a night with toasts in it" },
  { id: "lesson", name: "A class", title: "A private class", fragment: "a private class, where everyone cooks, and everyone eats what they made" },
];

export const scales: Scale[] = [
  { id: "intimate", name: "Intimate", range: "Two to eight", guests: "2-8", line: "Set for a few, the table is close enough for every plate to be introduced by the chef himself." },
  { id: "gathering", name: "A gathering", range: "Ten to twenty-four", guests: "10-24", line: "A long table or several; service becomes choreography, and still no one sees it working." },
  { id: "grand", name: "An occasion", range: "Twenty-five and beyond", guests: "25-60", line: "At this scale the team grows and the planning deepens — and the feeling of a private table is what is being protected." },
];
