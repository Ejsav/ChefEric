import type { PlateFallback, PlateTone } from "@/components/ui/Plate";

// Where Chef Jokl cooks: one page per place, for the people searching
// "private chef in …". Each page is written for its place
// (logistics, seasons, questions people there actually ask); none is a
// template with the town name swapped. New York is home in the demo;
// everywhere else is by arrangement. Photographs reuse the composer's room
// slots, so one shoot covers both.

export type Place = {
  slug: string;
  name: string;
  eyebrow: string;
  lines: [string, string];
  metaTitle: string;
  metaDescription: string;
  /** one line for the index of places */
  summary: string;
  setting: string; // composer + inquiry setting id
  menu: string;    // sample menu slug that suits the place
  plate: { tone: PlateTone; label: string; alt: string; slot?: string; src?: string; fallback?: PlateFallback };
  intro: string[];
  evening: { title: string; body: string }[];
  logistics: string[];
  areas?: string;
  faqs: { q: string; a: string }[];
};

export const places: Place[] = [
  {
    slug: "new-york-city",
    name: "New York City",
    eyebrow: "Private chef · New York City",
    lines: ["A private chef", "in Manhattan."],
    metaTitle: "Private Chef in New York City & Manhattan",
    metaDescription:
      "Private dinners in Manhattan apartments, townhouses and lofts with New York private chef Eric Jokl: a menu written for your guests, cooked in your kitchen, served without a single stranger in the room.",
    summary: "Apartments, townhouses and lofts: the building handled, the cooking finished in your kitchen.",
    setting: "penthouse",
    menu: "after-midnight",
    plate: {
      tone: "smoke", label: "Above the avenue", alt: "Chef Eric Jokl beside a set table before tall windows, the city lit beyond.", slot: "room-penthouse",
      fallback: { slot: "chapter-room", label: "The dining room, an hour early", alt: "A round table for eight set by candlelight in a dark wood-panelled dining room." },
    },
    intro: [
      "In a city with a reservation for everything, the rarest table is the one nobody else can book. A private dinner at home means no waiting list, no neighbouring tables and no one listening, and a menu that was written with your guests in mind.",
      "Home base is New York, so most evenings happen in Manhattan apartments, townhouses and lofts, often in kitchens that were designed for takeout. That is fine. Most of the cooking is done before the elevator ride up; your kitchen is for the finishing.",
    ],
    evening: [
      { title: "The building, handled", body: "Freight elevators, doormen, delivery windows and certificates of insurance are sorted with your management days ahead. You hear about none of it." },
      { title: "Timed to the skyline", body: "Drinks while it is still light, the first course as the city switches on, the pasta at the hour the street goes quiet." },
      { title: "Dinners with an agenda", body: "A board, a client, a founder's dinner after the round closes. The food holds the room; nobody outside it hears a word." },
    ],
    logistics: [
      "Building requirements arranged directly with your doorman or manager.",
      "Prep finished off-site whenever the kitchen is compact.",
      "One server for a dinner for six, a full team for a party of forty.",
      "Most weeknights are available; weekends book first.",
    ],
    areas: "Manhattan, Brooklyn and Westchester; Long Island and New Jersey by arrangement.",
    faqs: [
      { q: "My kitchen is tiny. Is that a problem?", a: "Not at all. Most courses are prepared in advance and finished in your kitchen, so a galley-sized city kitchen is enough." },
      { q: "Who deals with the building?", a: "The team does. Elevator bookings, insurance certificates and delivery times are arranged with your building before the date." },
      { q: "Can you do a weeknight business dinner?", a: "Yes, and often at short notice. Send the date and the number of guests and you will hear back the same day." },
    ],
  },
  {
    slug: "the-hamptons",
    name: "The Hamptons",
    eyebrow: "Private chef · The Hamptons",
    lines: ["A private chef", "on the East End."],
    metaTitle: "Private Chef in the Hamptons",
    metaDescription:
      "Long tables on the lawn, beach lunches and full summer weekends in the Hamptons with private chef Eric Jokl, cooked from the East End's farm stands and day boats.",
    summary: "Lawn dinners, beach lunches and whole summer weekends, cooked from the East End's farms and boats.",
    setting: "estate",
    menu: "late-summer-outdoors",
    plate: { tone: "linen", label: "Long table, late August", alt: "A long table on an estate lawn at golden hour.", slot: "room-estate" },
    intro: [
      "A Hamptons summer runs on meals: late breakfasts for a full house, lunch carried down to the beach, a dinner on the lawn that nobody wants to end. The chef can take one of them or all of them.",
      "Everything is bought locally that week, from the farm stands, the day boats and the duck farms down the road. Dinner goes wherever the evening is best: the lawn, the pool terrace, or indoors if the sky changes its mind.",
    ],
    evening: [
      { title: "On the lawn at golden hour", body: "A long table placed for the sunset, with a covered plan ready in case the weather turns." },
      { title: "The whole weekend", body: "Friday dinner to Sunday lunch, planned as one menu so nothing is served twice and nothing goes to waste." },
      { title: "The big summer party", body: "Birthdays, engagements, the annual party: kitchen, staff, tents and rentals brought in to match the guest list." },
    ],
    logistics: [
      "Produce and seafood from East End farms and boats whenever possible.",
      "Tents, rentals and extra staff coordinated with your house manager.",
      "Weekend stays written as one continuous menu.",
      "July and August weekends are the first to go; book in spring.",
    ],
    areas: "Southampton, Bridgehampton, Sagaponack, East Hampton, Amagansett, Montauk, Sag Harbor and Shelter Island.",
    faqs: [
      { q: "Can you cook for us all weekend?", a: "Yes. A weekend is planned as one menu across every meal, so each one is different and nothing is wasted." },
      { q: "When should we book a summer date?", a: "As early as you can. Holiday weekends and August go first, often by late spring." },
      { q: "What happens if it rains?", a: "Every outdoor dinner comes with a finished indoor or tented plan, decided with you in advance." },
    ],
  },
  {
    slug: "palm-beach",
    name: "Palm Beach",
    eyebrow: "Private chef · Palm Beach & South Florida",
    lines: ["A private chef", "in Palm Beach."],
    metaTitle: "Private Chef in Palm Beach & South Florida",
    metaDescription:
      "Terrace dinners on the water and season-long engagements in Palm Beach, Jupiter and Miami with private chef Eric Jokl, travelling from New York by arrangement.",
    summary: "Terraces and waterfront homes in the season, menus written for the heat.",
    setting: "waterfront",
    menu: "at-anchor",
    plate: { tone: "tide", label: "Blue hour, doors open", alt: "A terrace table on the water at blue hour.", slot: "room-waterfront" },
    intro: [
      "When the season moves south, so do the dinners. In Palm Beach and along the coast, evenings move outside: doors folded open, the table on the terrace, the water a few steps away.",
      "The cooking lightens to match: raw fish, citrus, things cooked over fire, cold wine. The team travels down for a single dinner or stays for a run of evenings across the winter.",
    ],
    evening: [
      { title: "On the terrace", body: "Dinner set for blue hour, with a menu built around what the Atlantic and the Gulf brought in." },
      { title: "A season of dinners", body: "One evening during your stay, or a standing week of dinners from December to April." },
      { title: "From the dock", body: "Drinks at home, dinner on the boat. Timed with your captain from the first pour." },
    ],
    logistics: [
      "Team, travel and supplies arranged before the flight down.",
      "Local fishmongers and growers lined up ahead of arrival.",
      "Travel and lodging listed line by line in the proposal.",
      "Winter season dates book early; ask by the autumn.",
    ],
    areas: "Palm Beach, Jupiter, Boca Raton, Miami and the Keys.",
    faqs: [
      { q: "Will you travel to Florida for one dinner?", a: "Yes. A single dinner is possible, though most clients book several evenings across their stay." },
      { q: "How is travel charged?", a: "Travel and lodging appear as separate lines in the proposal, so you see the whole cost before you say yes." },
      { q: "Can dinner start at home and finish on the boat?", a: "Yes. The timing is planned with your captain so the handover is seamless." },
    ],
  },
  {
    slug: "yachts",
    name: "Yachts",
    eyebrow: "Private chef · Yachts",
    lines: ["A private chef", "at sea."],
    metaTitle: "Private Yacht Chef for Owners & Charters",
    metaDescription:
      "Yacht chef Eric Jokl cooks for owners and charter guests: menus written for the galley, provisioning planned in full, and service run alongside your captain and crew.",
    summary: "Dinner at anchor or a week aboard, planned with the captain around the galley.",
    setting: "yacht",
    menu: "at-anchor",
    plate: { tone: "tide", label: "Blue hour, on deck", alt: "Chef Eric Jokl at the rail of a yacht at dusk, a table set behind him.", slot: "chapter-distance" },
    intro: [
      "Cooking on a yacht means a small galley, limited storage and a kitchen that sometimes moves. Every dish is chosen with that in mind before a single ingredient is bought.",
      "The chef cooks for owners and charter guests, for one dinner at anchor or a week of meals at sea, as part of the crew rather than a guest in the galley.",
    ],
    evening: [
      { title: "Dinner at anchor", body: "One evening on deck: cold plates as the anchor drops, the grill as the sun goes." },
      { title: "A week at sea", body: "Every meal of a charter, planned around what the galley can store and what the next port can supply." },
      { title: "From the dock", body: "A dinner that begins tied up and ends underway, with the timing set alongside the captain." },
    ],
    logistics: [
      "Galley, cold storage and equipment reviewed with the captain first.",
      "A full provisioning list, with a backup for anything irreplaceable at sea.",
      "Service and table settings agreed with the chief stew.",
      "Confidentiality agreements as standard.",
    ],
    faqs: [
      { q: "Do you cook on charters as well as private yachts?", a: "Yes, for owners and charter guests alike, working with the broker, the captain and the crew in each case." },
      { q: "Our galley is small. Does that limit the menu?", a: "It shapes the menu rather than limiting it. A compact galley gets dishes designed for it." },
      { q: "Who handles provisioning?", a: "The chef does, in full, before departure, with spares for every critical ingredient." },
    ],
  },
  {
    slug: "private-islands",
    name: "Private islands",
    eyebrow: "Private chef · Private islands",
    lines: ["A private chef", "for private islands."],
    metaTitle: "Private Island Chef",
    metaDescription:
      "Island dinners and full island stays with private chef Eric Jokl: every ingredient, tool and spare planned before the crossing, so nothing at the table shows how far it came.",
    summary: "Every ingredient, tool and spare packed before the crossing.",
    setting: "island",
    menu: "at-anchor",
    plate: { tone: "tide", label: "The end of the dock", alt: "A lantern-lit dock leading to a table on a private island at dusk.", slot: "room-island" },
    intro: [
      "On an island there is no store to send someone to. The menu, the shopping list and the packing list are the same document, and it is finished before the boat leaves.",
      "The result should feel effortless: a table at the end of the dock, a fire on the sand, a dinner that tastes as if the market were next door.",
    ],
    evening: [
      { title: "One unforgettable dinner", body: "A single table by the water, lanterns along the dock, cooked from what made the crossing." },
      { title: "The whole stay", body: "Every meal for several days, written as one menu so everything that arrives gets used." },
      { title: "Remote houses", body: "The same planning for ranches, mountain houses and estates hours from the nearest market." },
    ],
    logistics: [
      "A written plan for buying, packing and transport before departure.",
      "A spare for every ingredient and tool the menu depends on.",
      "Coordination with island managers, boat captains and house staff.",
      "No photographs of the property, ever.",
    ],
    faqs: [
      { q: "How much notice does an island booking need?", a: "Six weeks or more, so sourcing, transport and the team can be planned properly." },
      { q: "Can you work with our staff on the island?", a: "Yes. The chef brings a small team and works alongside house staff, managers and captains." },
      { q: "What if something is forgotten?", a: "That is what the spares list is for. Everything critical travels twice." },
    ],
  },
  {
    slug: "private-aviation",
    name: "Private aviation",
    eyebrow: "Private chef · Hangars & private terminals",
    lines: ["A private chef", "beneath the wing."],
    metaTitle: "Private Chef for Hangar Dinners & Aviation Events",
    metaDescription:
      "Candlelit dinners in private hangars and terminals with private chef Eric Jokl: a field kitchen built for the space, power and access agreed with the FBO, service timed around arrivals.",
    summary: "A long table in the hangar, or dinner waiting on arrival.",
    setting: "hangar",
    menu: "after-midnight",
    plate: { tone: "smoke", label: "Wheels down, table set", alt: "A candlelit dinner table beneath the wing of a private jet in a hangar.", slot: "room-hangar" },
    intro: [
      "A hangar is an empty room the size of a ballroom, with a jet parked in it. Lit properly, with one long table and a few hundred candles, it becomes the dining room your guests will talk about all year.",
      "There is no kitchen, so the chef builds one: a field kitchen sized to the menu, with power, water and access agreed with the operator well before the date.",
    ],
    evening: [
      { title: "A launch or a delivery", body: "A new aircraft, a company milestone, a homecoming. Dinner beside the reason for the evening." },
      { title: "Wheels-down dinners", body: "Guests step off the plane and sit straight down to the first course, timed to the landing." },
      { title: "The unexpected room", body: "For a host who has done every restaurant and every house: one night somewhere nobody has eaten before." },
    ],
    logistics: [
      "Access, power and safety rules agreed with the FBO or operator.",
      "A complete field kitchen designed for the space.",
      "Rentals, lighting and staff in one proposal.",
      "Service timed around arrivals and departures.",
    ],
    faqs: [
      { q: "Can you really cook in a hangar?", a: "Yes. A temporary kitchen is built for the evening, with everything it needs agreed with the operator in advance." },
      { q: "Who arranges access and permissions?", a: "The team, together with your FBO or flight department, well before the date." },
      { q: "How many guests can a hangar dinner seat?", a: "From a long table of nine to eighty seated, depending on the space. Larger receptions are possible by proposal." },
    ],
  },
];
