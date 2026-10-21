import type { PlateFallback, PlateTone } from "@/components/ui/Plate";

// The planner's vocabulary. Visitors don't pick a package; they set a room,
// a reason and a scale, and read the evening that results. Every line is
// written to combine naturally with every other, and the rules at the end
// keep impossible evenings (a class in a galley, eighty guests at anchor)
// from ever being described.
// Each customer version sets the rooms it wants to be imagined in.

export type ScaleId = "intimate" | "gathering" | "grand";

export type Setting = {
  id: string;
  name: string;      // option label
  phrase: string;    // "aboard a yacht"
  tone: PlateTone;
  plateLabel: string;
  slot: string;      // media slot (content/media.ts)
  alt: string;       // describes the photograph in `slot`
  fallback?: PlateFallback;
  focus?: string;    // crop for the 16:11 frame
  line: string;      // what the place asks of a dinner
  /** what the place asks of a class; absent where a class cannot be taught */
  lessonLine?: string;
  /** why a class cannot be taught here */
  noLesson?: string;
  /** the table sizes this place can hold, smallest to largest */
  scales: ScaleId[];
  /** why a size outside `scales` does not work here */
  scaleNote?: string;
  approach: string[];
};

export type Occasion = { id: string; name: string; title: string; fragment: string; lesson?: boolean };
export type Scale = { id: ScaleId; name: string; range: string; line: string; lessonRange: string; lessonLine: string; guests: string };

const ALL: ScaleId[] = ["intimate", "gathering", "grand"];

export const settings: Setting[] = [
  {
    id: "residence",
    name: "A private home",
    phrase: "in a private home",
    tone: "ember",
    plateLabel: "Your dining room, after dark",
    slot: "room-residence",
    alt: "A long dinner table set with crystal and taper candles in a wood-panelled dining room.",
    line: "For one night the house works like a restaurant with a single table. By the time the last guest leaves, it is simply your home again, and the kitchen is cleaner than you left it.",
    lessonLine: "Your own counter becomes the classroom, and the dining room is set for the dinner the class makes.",
    scales: ALL,
    approach: ["A look at the kitchen a few days before", "Extra burners, ovens or tableware brought in if needed", "Service laid out around the rooms you actually want to use"],
  },
  {
    id: "penthouse",
    name: "A Manhattan penthouse",
    phrase: "in a Manhattan penthouse",
    tone: "smoke",
    plateLabel: "Above the avenue",
    slot: "room-penthouse",
    alt: "A table set before tall windows, Manhattan lit beyond.",
    fallback: { slot: "chapter-room", label: "The dining room, an hour early", alt: "A round table for eight set by candlelight in a dark wood-panelled dining room." },
    focus: "object-[50%_62%]",
    line: "City kitchens are small and the views are not. Most of the work is finished before the elevator ride up, so the apartment smells of dinner, not of a catering job.",
    lessonLine: "The kitchen island becomes the classroom; whatever will not fit is prepared before the class arrives.",
    scales: ALL,
    approach: ["Doormen, freight elevators and delivery windows booked ahead", "Prep completed off-site, finishing done in your kitchen", "Courses timed to the skyline coming on"],
  },
  {
    id: "estate",
    name: "A Hamptons estate",
    phrase: "on a Hamptons estate",
    tone: "linen",
    plateLabel: "Long table, late August",
    slot: "room-estate",
    alt: "A long linen table on the lawn of a shingled house at sunset.",
    line: "A table across the lawn, the water somewhere past the hydrangeas, dinner moving at the pace of the sunset. What is on the plate comes from the farm stands and boats down the road.",
    lessonLine: "A long counter with the garden in the window, and dinner on the terrace once the pasta is cut.",
    scales: ALL,
    approach: ["Produce and fish from East End growers and day boats", "A rain plan as finished as the dry one", "Service for the lawn, the terrace or the dining room"],
  },
  {
    id: "waterfront",
    name: "A waterfront home",
    phrase: "on the water",
    tone: "tide",
    plateLabel: "Blue hour, doors open",
    slot: "room-waterfront",
    alt: "A terrace table framed by open doors, palms and the bay at blue hour.",
    line: "Glass doors folded back, the bay a few steps away, a warm night that does not need a jacket. The food follows the heat: citrus, raw fish, fire, nothing heavy.",
    lessonLine: "Doors open to the water, citrus and fish on the board, and dinner outside as the light goes.",
    scales: ALL,
    approach: ["Menus written around Gulf and Atlantic seafood", "Team and supplies arranged before the flight down", "Courses held back until the evening cools"],
  },
  {
    id: "yacht",
    name: "Aboard a yacht",
    phrase: "aboard a yacht",
    tone: "tide",
    plateLabel: "Anchored, second course",
    slot: "room-yacht",
    alt: "A table set on a yacht's aft deck at sunset.",
    fallback: { slot: "menu-at-anchor", label: "On deck, at anchor", alt: "Oysters on ice on a yacht's teak table, the sun setting over the water." },
    line: "A galley is the most exact kitchen there is: every pan has a place and every ingredient is counted before the boat leaves the dock.",
    noLesson: "A galley is too tight to teach in",
    scales: ["intimate", "gathering"],
    scaleNote: "At anchor, a table seats up to twenty-four",
    approach: ["Planned with the captain and the interior crew", "Provisioning sized to the galley and the cold storage", "Dishes that hold steady when the sea does not"],
  },
  {
    id: "island",
    name: "On a private island",
    phrase: "on a private island",
    tone: "tide",
    plateLabel: "The end of the dock",
    slot: "room-island",
    alt: "A table for two at the end of a lantern-lit dock.",
    line: "If it is not on the boat, it does not exist. Island dinners are packed like expeditions and served as if the market were next door.",
    lessonLine: "Taught in the island house with what made the crossing, ending with dinner at the end of the dock.",
    scales: ALL,
    approach: ["A packing and transport plan signed off before departure", "A spare for every ingredient and tool that matters", "Menus across the stay that waste nothing that made the crossing"],
  },
  {
    id: "hangar",
    name: "In a private hangar",
    phrase: "in a private hangar",
    tone: "smoke",
    plateLabel: "Wheels down, table set",
    slot: "room-hangar",
    alt: "A candlelit table beneath the wing of a private jet.",
    line: "Polished concrete, a jet parked overhead, a single long table lit by candles. Handled well, it is the most memorable dining room your guests will see all year.",
    noLesson: "A hangar has no kitchen to teach in",
    scales: ["gathering", "grand"],
    scaleNote: "A hangar is set for a long table, from ten guests",
    approach: ["Power, rentals and access agreed with the FBO", "A field kitchen built to fit the space", "Service paced around landings and arrivals"],
  },
  {
    id: "abroad",
    name: "Somewhere abroad",
    phrase: "abroad",
    tone: "linen",
    plateLabel: "A terrace, elsewhere",
    slot: "room-abroad",
    alt: "A terrace under a vine pergola above the sea at sunset.",
    line: "A rented villa, a chalet for the week, a terrace over somebody else's sea. The chef travels with the standard and buys locally the moment he lands.",
    lessonLine: "The local market in the morning, the class in the afternoon, dinner on the terrace after.",
    scales: ALL,
    approach: ["Local suppliers checked before arrival", "A travelling team, or one hired and briefed on site", "Menus that taste of the place you are in"],
  },
];

export const occasions: Occasion[] = [
  { id: "friends", name: "Friends", title: "Dinner among friends", fragment: "a night for friends who know every restaurant in town and would rather stay in" },
  { id: "milestone", name: "A milestone", title: "A milestone", fragment: "a birthday or an anniversary, with a menu written for the person it is about" },
  { id: "business", name: "Hosting", title: "An evening of hosting", fragment: "a dinner built for conversation, where the food keeps people at the table an hour longer than planned" },
  { id: "family", name: "Family", title: "A family table", fragment: "a family gathering: one long table, every generation, and nobody stuck in the kitchen" },
  { id: "celebration", name: "A celebration", title: "A celebration", fragment: "an engagement, a deal closed, someone coming home: a night that needs a toast" },
  { id: "lesson", name: "A class", title: "A private class", fragment: "a private class where everyone cooks and everyone sits down to what they made", lesson: true },
];

export const scales: Scale[] = [
  { id: "intimate", name: "Intimate", range: "Two to eight", guests: "2-8", line: "Small enough for the chef to bring each course out and say a word about it.", lessonRange: "Two to eight", lessonLine: "Small enough for everyone to have a station and the chef's full attention." },
  { id: "gathering", name: "A gathering", range: "Ten to twenty-four", guests: "10-24", line: "One long table or a few round ones, with a service team that moves like it has rehearsed, because it has.", lessonRange: "Nine to twelve", lessonLine: "Up to twelve at the counter, cooking in pairs, with a second cook helping." },
  { id: "grand", name: "An occasion", range: "Twenty-five to eighty", guests: "25-60", line: "More cooks, more planning, the same promise: it should still feel like dinner at someone's house.", lessonRange: "", lessonLine: "" },
];

export const defaults = { room: "residence", reason: "milestone", table: "intimate" } as const;

// ── The rules ─────────────────────────────────────────────────────────────
// The latest choice wins; anything it rules out moves to the nearest choice
// that works, and the planner says why in one sentence.

export type Plan = { room: string; reason: string; table: ScaleId };
export type Dial = keyof Plan;

const LESSON_MAX: ScaleId = "gathering";
const order = (id: ScaleId) => ALL.indexOf(id);
const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1); // "A Hamptons estate" → "a Hamptons estate"
const nearest = (want: ScaleId, allowed: ScaleId[]) =>
  allowed.reduce((best, id) => (Math.abs(order(id) - order(want)) < Math.abs(order(best) - order(want)) ? id : best), allowed[0]!);

export const settingOf = (id: string) => settings.find((s) => s.id === id) ?? settings[0]!;
export const occasionOf = (id: string) => occasions.find((o) => o.id === id) ?? occasions[0]!;
export const scaleOf = (id: string) => scales.find((s) => s.id === id) ?? scales[0]!;

/** Table sizes possible for this room and reason. */
export function allowedScales(room: string, reason: string): ScaleId[] {
  const s = settingOf(room);
  const lesson = !!occasionOf(reason).lesson;
  return s.scales.filter((id) => !lesson || order(id) <= order(LESSON_MAX));
}

/**
 * Apply a choice and return a plan that can actually be cooked, with a note
 * describing anything that moved. `dial` is the choice just made (undefined
 * when validating a shared link).
 */
export function resolve(plan: Plan, dial?: Dial): { plan: Plan; note: string | null } {
  let { room, reason, table } = plan;
  if (!settings.some((s) => s.id === room)) room = defaults.room;
  if (!occasions.some((o) => o.id === reason)) reason = defaults.reason;
  if (!scales.some((s) => s.id === table)) table = defaults.table;
  const notes: string[] = [];

  // A class needs a kitchen to teach in.
  const s = settingOf(room);
  if (occasionOf(reason).lesson && !s.lessonLine) {
    if (dial === "reason") {
      room = defaults.room;
      notes.push(`${s.noLesson}, so the class moves to ${lc(settingOf(room).name)}`);
    } else {
      reason = "friends";
      notes.push(`${s.noLesson}, so the evening becomes ${lc(occasionOf(reason).title)}`);
    }
  }

  // The table has to fit the room (and a class stays at twelve).
  const allowed = allowedScales(room, reason);
  if (!allowed.includes(table)) {
    const lesson = !!occasionOf(reason).lesson;
    if (dial === "table") {
      // Keep the size just chosen; move whatever cannot hold it.
      if (lesson && order(table) > order(LESSON_MAX)) {
        reason = "celebration";
        notes.push(`Classes are kept to twelve cooks, so a table this size becomes ${lc(occasionOf(reason).title)}`);
      }
      const room2 = settingOf(room);
      if (!room2.scales.includes(table)) {
        room = settings.find((x) => x.scales.includes(table) && (!occasionOf(reason).lesson || x.lessonLine))!.id;
        notes.push(`${room2.scaleNote}, so the evening moves to ${lc(settingOf(room).name)}`);
      }
    } else {
      const before = table;
      table = nearest(table, allowed);
      const why = lesson ? "Classes are kept to twelve cooks" : settingOf(room).scaleNote!;
      const was = before === "grand" ? "the occasion" : `the ${lc(scaleOf(before).name)} table`;
      notes.push(`${why}, so ${was} becomes ${lc(scaleOf(table).name)}`);
    }
  }

  return { plan: { room, reason, table }, note: notes.length ? `${notes.join(". ")}.` : null };
}

/** The evening, in words: what the planner shows for a resolved plan. */
export function describe(plan: Plan) {
  const s = settingOf(plan.room);
  const o = occasionOf(plan.reason);
  const sc = scaleOf(plan.table);
  const lesson = !!o.lesson;
  return {
    eyebrow: `${lesson ? sc.lessonRange : sc.range} · ${s.name}`,
    title: o.title,
    phrase: s.phrase,
    body: `Imagine ${o.fragment}. ${lesson ? s.lessonLine : s.line} ${lesson ? sc.lessonLine : sc.line}`,
    approach: lesson
      ? ["Stations set and ingredients weighed before anyone arrives", "Every tool brought in, from pasta boards to fish knives", "Printed recipes for every cook to take home"]
      : s.approach,
  };
}
