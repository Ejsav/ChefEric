import type { PlateTone } from "@/components/ui/Plate";

// Where evenings by Eric Jokl travel: one page per place, for the people
// searching "private dining in …". Each page is written for its place
// (logistics, seasons, questions people there actually ask); none is a
// template with the town name swapped. No home base or local history is
// claimed — every place is by arrangement, and the copy says so.
// CONFIRM: the areas listed, and any place Eric wants to be found for.

export type Place = {
  slug: string;
  name: string;
  eyebrow: string;
  lines: [string, string];
  metaTitle: string;
  metaDescription: string;
  setting: string; // composer + inquiry setting id
  menu: string;    // sample menu slug that suits the place
  plate: { tone: PlateTone; label: string; alt: string; slot?: string; src?: string };
  intro: string[];
  evening: { title: string; body: string }[];
  logistics: string[];
  areas?: string;
  faqs: { q: string; a: string }[];
};

export const places: Place[] = [
  {
    slug: "connecticut",
    name: "Connecticut",
    eyebrow: "Private dining · Connecticut",
    lines: ["A private evening", "in Connecticut."],
    metaTitle: "Private Dining & Hosted Evenings in Connecticut",
    metaDescription:
      "Private dinners and hosted evenings in Connecticut homes, designed and directed by Eric Jokl with a chef chosen for your table. Fairfield County, the shoreline and beyond, by arrangement.",
    setting: "residence",
    menu: "late-summer-outdoors",
    plate: { tone: "ember", label: "Country house, after dark", alt: "Eric Jokl checking a place setting in a Connecticut dining room by candlelight.", slot: "place-connecticut" },
    intro: [
      "Connecticut's best rooms are private ones: country houses, shoreline homes, dining rooms built for exactly the kind of evening a restaurant cannot give you. Eric turns them into one for a single night.",
      "Most evenings take place in the host's own home. The kitchen belongs to the chef for the afternoon, the dining room becomes the most private restaurant in the state, and by midnight it is a home again.",
    ],
    evening: [
      { title: "The house becomes the room", body: "Eric and the team arrive hours before the first guest; the chef cooks in your kitchen, and the evening is directed from the first candle. You host; they do everything else." },
      { title: "The state's best, in season", body: "Shoreline oysters and scallops, farm tomatoes and corn in late summer; braises, fresh pasta and firelight when the weather turns." },
      { title: "From two to a long table", body: "An anniversary for two, a family table for twelve, or a celebration that fills the house." },
    ],
    logistics: [
      "A short walkthrough of your home before the evening, in person or by video.",
      "Any missing equipment, rentals, glassware or staff arranged for you.",
      "Wine pairing with a sommelier, on request.",
      "The kitchen is left cleaner than it was found.",
    ],
    areas: "Greenwich, Darien, New Canaan, Westport and the rest of Fairfield County; the shoreline from Guilford to Stonington; Litchfield County, by arrangement.",
    faqs: [
      { q: "Do you host evenings across all of Connecticut?", a: "Yes, by arrangement — most often in Fairfield County, along the shoreline and in Litchfield County." },
      { q: "What do I need to have in my kitchen?", a: "A working stove and oven is enough for the chef. Anything else, from extra burners to platters and glassware, is brought in or arranged ahead of the evening." },
      { q: "How far ahead should I book an evening in Connecticut?", a: "Two to three weeks is comfortable for most dinners. Holidays and summer weekends fill first, so earlier is better for those dates." },
    ],
  },
  {
    slug: "new-york-city",
    name: "New York City",
    eyebrow: "Private dining · New York City",
    lines: ["A private evening", "in Manhattan."],
    metaTitle: "Private Dining & Hosted Dinners in New York City",
    metaDescription:
      "Private dinners in Manhattan apartments, townhouses and lofts, designed and hosted by Eric Jokl with a chef chosen for your table. Complete discretion, by arrangement.",
    setting: "penthouse",
    menu: "after-midnight",
    plate: { tone: "smoke", label: "Above the avenue", alt: "Eric Jokl beside a set table before tall windows, the city lit beyond.", slot: "place-new-york-city" },
    intro: [
      "New Yorkers can eat anywhere, which is exactly why a private table matters here. No reservation to chase, no room to share. The conversation stays in the room, and the evening is built around the people in it.",
      "Eric designs evenings for Manhattan apartments, townhouses and lofts, working with whatever kitchen the city has given you. In some apartments that is the smallest room in the home. It is always enough.",
    ],
    evening: [
      { title: "Planned around the building", body: "Doormen, service elevators, delivery windows and building rules are arranged in advance, so nothing about the logistics reaches your evening." },
      { title: "Paced to the view", body: "Service is timed around the room: aperitivo as the light goes, dinner as the city comes on, the late course when the avenue goes quiet." },
      { title: "Dinners that do business", body: "A client dinner, a board evening, a founders' table, a launch. The evening is extraordinary and the room stays private." },
    ],
    logistics: [
      "Building access, freight timing and insurance certificates handled with your management.",
      "Preparation finished off-site when an apartment kitchen is small.",
      "Staffing sized for the room, from a single server to a full team.",
      "Travel, where needed, set out in your proposal.",
    ],
    areas: "Manhattan, Brooklyn and Westchester, by arrangement.",
    faqs: [
      { q: "Can an evening work in a small New York apartment kitchen?", a: "Yes. Much of the preparation is completed before arrival, so even a compact kitchen is enough for finishing and service." },
      { q: "Do you handle the building's requirements?", a: "Yes. Service elevator bookings, certificates of insurance and delivery windows are coordinated with your building before the evening." },
      { q: "Is New York available for weeknight dinners?", a: "Often. Weeknights are popular for business dinners and founders' tables in the city; share your preferred dates in the request and the office will confirm." },
    ],
  },
  {
    slug: "the-hamptons",
    name: "The Hamptons",
    eyebrow: "Private dining · The Hamptons",
    lines: ["A private evening", "in the Hamptons."],
    metaTitle: "Private Dining & Summer Evenings in the Hamptons",
    metaDescription:
      "Summer dinners, long tables and weekend stays in the Hamptons, designed and hosted by Eric Jokl with a chef chosen for your table. Served on your lawn or terrace, by arrangement.",
    setting: "estate",
    menu: "late-summer-outdoors",
    plate: { tone: "linen", label: "Long table, late August", alt: "A long dinner table on an estate lawn at golden hour.", slot: "place-the-hamptons" },
    intro: [
      "A Hamptons summer is built around the table: long lunches, dinners that run past dark, a house full of guests for the weekend. Eric designs for exactly that rhythm, from one perfect dinner to a full weekend of evenings.",
      "The food follows the East End — farm-stand tomatoes and corn, local fish, Long Island duck — written by the chef for your table. Dinner can be served on the lawn, the terrace, or indoors if the weather has other ideas.",
    ],
    evening: [
      { title: "Golden hour on the lawn", body: "Long tables timed to the light, with an indoor plan ready, because weather is always a guest." },
      { title: "The whole weekend, handled", body: "Breakfast, a beach lunch, a late dinner and Sunday's recovery, planned across the stay so nothing repeats." },
      { title: "Celebrations at scale", body: "Birthdays, engagements and summer parties, with the team, rentals and production sized to the occasion." },
    ],
    logistics: [
      "Sourcing from East End farms and fishmongers when the season allows.",
      "Staff, rentals and tenting coordinated with your house manager or planner.",
      "Multi-day stays planned as one arc.",
      "Summer weekends book early; holiday dates first of all.",
    ],
    areas: "Southampton, Bridgehampton, Sagaponack, East Hampton, Amagansett, Montauk, Sag Harbor and Shelter Island, by arrangement.",
    faqs: [
      { q: "Can you host a whole weekend in the Hamptons?", a: "Yes. Weekend stays are planned as a single arc of meals and evenings, so each one feels different and nothing is repeated." },
      { q: "How early should I book a summer date?", a: "As early as possible. July and August weekends, and the holiday weekends especially, are the first dates to go." },
      { q: "Can dinner be served outdoors?", a: "Yes, on the lawn, terrace or beach, always with an indoor plan prepared in case the weather changes." },
    ],
  },
  {
    slug: "florida",
    name: "Florida",
    eyebrow: "Private dining · Palm Beach & Miami",
    lines: ["A private evening", "in Florida."],
    metaTitle: "Private Dining in Palm Beach & Miami",
    metaDescription:
      "Waterfront dinners and winter-season evenings in Palm Beach and Miami, designed and hosted by Eric Jokl with a chef chosen for your table, by arrangement.",
    setting: "waterfront",
    menu: "a-night-aboard",
    plate: { tone: "tide", label: "Doors open to the bay", alt: "A terrace table on the water at blue hour in Florida.", slot: "place-florida" },
    intro: [
      "For many New York and Connecticut families, winter means Florida. In Palm Beach, Miami and along the coast, Eric brings the same standard to warm nights and open doors, travelling by arrangement.",
      "The menus get lighter as the temperature rises — coastal fish, citrus, olive oil — and the evenings move outside. The hospitality stays exactly the same.",
    ],
    evening: [
      { title: "Waterfront dinners", body: "Terrace tables timed to blue hour, with menus built around the coast's seafood." },
      { title: "The winter season", body: "A single evening during your stay, or a series of evenings across the season." },
      { title: "From the dock", body: "Evenings that begin at home and continue aboard, coordinated with your captain." },
    ],
    logistics: [
      "A travelling team and provisioning plan prepared in advance.",
      "Local chefs and suppliers vetted ahead of arrival.",
      "Travel and accommodation set out clearly in the proposal.",
      "Winter-season dates, December to April, book early.",
    ],
    areas: "Palm Beach, Jupiter, Boca Raton, Miami and the Florida Keys, by arrangement.",
    faqs: [
      { q: "Do you travel to Florida?", a: "Yes, by arrangement, for single evenings or longer stays, most often during the winter season." },
      { q: "How are travel costs handled?", a: "Travel and accommodation are set out clearly in your proposal, so the full cost is known before you confirm." },
      { q: "Can you host several evenings during our stay?", a: "Yes. A series of evenings can be planned across the season or a single visit." },
    ],
  },
  {
    slug: "yachts",
    name: "Yachts",
    eyebrow: "Private dining · Yachts",
    lines: ["A private evening", "aboard."],
    metaTitle: "Private Yacht Dining — Owners & Charters",
    metaDescription:
      "Private evenings aboard for owners and charter guests: galley-planned menus with a chef chosen for the voyage, full provisioning, and coordination with your captain and crew. Designed and hosted by Eric Jokl.",
    setting: "yacht",
    menu: "a-night-aboard",
    plate: { tone: "tide", label: "Anchored, second course", alt: "Eric Jokl at the rail of a yacht's aft deck beside a set table at sunset.", slot: "place-yachts" },
    intro: [
      "A yacht is a precise place to host. Everything is stowed and accounted for, and the evening has to respect motion, space and the sea. Eric plans for all of it before the lines are cast off.",
      "Evenings are designed for owners and charter guests, from a single dinner at anchor to days at sea, with the chef and team working alongside the captain and interior crew rather than around them.",
    ],
    evening: [
      { title: "Dinner at anchor", body: "One evening on board: a coastal menu served on deck as the light goes." },
      { title: "Days at sea", body: "Breakfast to dinner across a charter, planned around provisioning and storage." },
      { title: "Shore to ship", body: "An evening that begins at the dock and finishes underway, timed with the crew." },
    ],
    logistics: [
      "Galley, storage and equipment reviewed with the captain before the menu is final.",
      "Full provisioning lists, with redundancy for anything that can't be replaced at sea.",
      "Coordination with the chief stew on service and table settings.",
      "Confidentiality agreements as standard.",
    ],
    faqs: [
      { q: "Can you host on a charter yacht as well as a private one?", a: "Yes. Evenings are planned with owners, charter guests and their brokers, coordinating with the captain and crew in each case." },
      { q: "What if the galley is small?", a: "Menus are designed for the galley you have. A compact galley calls for different cooking, not lesser cooking." },
      { q: "Do you handle provisioning?", a: "Yes. Provisioning is planned in full before departure, including backups for critical ingredients." },
    ],
  },
  {
    slug: "private-islands",
    name: "Private islands",
    eyebrow: "Private dining · Private islands",
    lines: ["A private evening", "on your island."],
    metaTitle: "Private Island Dining & Hosted Evenings",
    metaDescription:
      "Island and remote-residence evenings where every ingredient, tool and contingency is planned before departure. Designed and hosted by Eric Jokl with a chef chosen for the stay, by arrangement.",
    setting: "island",
    menu: "a-night-aboard",
    plate: { tone: "tide", label: "Lanterns along the dock", alt: "A lantern-lit dock leading to a table on a private island at dusk.", slot: "place-private-islands" },
    intro: [
      "An evening on a private island is the purest test of planning. What isn't on the boat doesn't exist. Every ingredient, every tool and every contingency is decided before departure.",
      "Eric plans island evenings the way he builds anything that cannot fail on the night: as one system, with redundancy designed in. The measure of success is simple — nobody at the table notices how far anything has travelled.",
    ],
    evening: [
      { title: "The single extraordinary dinner", body: "One table at the water's edge, lanterns along the dock, a menu built from what made the crossing." },
      { title: "The island stay", body: "Every evening for several days, planned as one arc so everything that arrives is used well." },
      { title: "Remote residences", body: "The same discipline for mountain homes, ranches and estates far from a market." },
    ],
    logistics: [
      "A complete logistics and provisioning plan before departure.",
      "Redundancy for every critical ingredient and piece of equipment.",
      "Coordination with island managers, boat captains and staff.",
      "Confidentiality as standard, and no photographs unless you ask.",
    ],
    faqs: [
      { q: "How do you plan an evening on a private island?", a: "As one system: menus, provisioning, transport, power, staffing and weather planned together before departure, with a backup for everything that cannot be replaced on the island." },
      { q: "How much notice does an island engagement need?", a: "Six weeks or more is recommended, so sourcing, transport and staffing can be planned properly." },
      { q: "Can you work with our island staff?", a: "Yes. Eric coordinates with island managers, captains and house staff, and brings the chef and team the evening needs." },
    ],
  },
];
