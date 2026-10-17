// Sample menus. They are presented on the site as samples, never as records
// of real past evenings: every real menu is written for
// one table. They show the range: the season, the setting and the reason for
// gathering decide the food.
// Each menu carries one signature dish photograph (media slot), shown beside
// the card and changing with it.

import type { PlateTone } from "@/components/ui/Plate";

export type Course = { label: string; dish: string; note?: string };
export type Menu = {
  slug: string;
  title: string;
  occasion: string;
  setting: string;   // composer setting id, used to pre-fill the inquiry
  season: string;
  intro: string;
  courses: Course[];
  pairing: string;
  dish: { slot: string; label: string; alt: string; tone: PlateTone };
};

export const menus: Menu[] = [
  {
    slug: "after-midnight",
    title: "After midnight",
    occasion: "A late table",
    setting: "penthouse",
    season: "All year",
    intro: "For the evenings that start late and are not meant to end: small, sharp plates and one perfect bowl of pasta at the hour nobody else is cooking.",
    courses: [
      { label: "On arrival", dish: "Oysters, champagne mignonette", note: "and a very cold martini" },
      { label: "Raw", dish: "Yellowtail, blood orange, chili, olive oil" },
      { label: "Small plate", dish: "Beef tartare, smoked yolk, grilled bread" },
      { label: "The late pasta", dish: "Spaghetti, butter, black pepper, aged pecorino", note: "served at one in the morning" },
      { label: "To close", dish: "Dark chocolate, sea salt, espresso", note: "amaro on the table" },
    ],
    pairing: "Grower champagne to begin, a cool Nerello Mascalese until late.",
    dish: { slot: "menu-after-midnight", label: "The late pasta", tone: "ember", alt: "Spaghetti with butter, black pepper and pecorino in a shallow bowl by candlelight." },
  },
  {
    slug: "late-summer-outdoors",
    title: "Late summer, outdoors",
    occasion: "A long table on the lawn",
    setting: "estate",
    season: "August – September",
    intro: "Dinner timed to the last of the light, cooked from whatever the farms and boats brought in that morning.",
    courses: [
      { label: "To begin", dish: "Heirloom tomatoes, burrata, basil, new-season oil" },
      { label: "Raw", dish: "Day-boat scallops, green chili, lime, sea salt" },
      { label: "Pasta", dish: "Tagliatelle cut by hand, sweet corn, brown butter, sage" },
      { label: "From the fire", dish: "Whole fish over embers, salsa verde", note: "burnt lemon, crushed potatoes" },
      { label: "Dessert", dish: "Grilled peaches, almond crumb, crème fraîche" },
    ],
    pairing: "A coastal white through the first plates, a light red served cool once the sun is down.",
    dish: { slot: "menu-late-summer-outdoors", label: "Tomatoes, burrata, basil", tone: "linen", alt: "Heirloom tomatoes and burrata on an ivory plate at an outdoor table in golden light." },
  },
  {
    slug: "at-anchor",
    title: "At anchor",
    occasion: "Dinner at anchor",
    setting: "yacht",
    season: "Summer",
    intro: "Written for a narrow galley and a wide horizon: cold things first, then the grill, then something sweet as the deck lights come on.",
    courses: [
      { label: "On deck", dish: "Oysters on ice, shallot and champagne vinegar" },
      { label: "Raw", dish: "Fluke, blood orange, shaved fennel, pistachio" },
      { label: "Pasta", dish: "Linguine, clams, white wine, chili, parsley" },
      { label: "From the grill", dish: "Swordfish, charred peppers, capers, olives" },
      { label: "Dessert", dish: "Olive-oil cake, lemon, summer berries" },
    ],
    pairing: "Champagne while the anchor goes down, a saline white for the rest of the night.",
    dish: { slot: "menu-at-anchor", label: "Oysters, on deck", tone: "tide", alt: "Oysters on crushed ice on a yacht's teak table at sunset." },
  },
  {
    slug: "by-the-fire",
    title: "By the fire",
    occasion: "A milestone by the fire",
    setting: "residence",
    season: "December – February",
    intro: "The menu for a cold night and a long one: something braised since morning, a fire in the next room, nobody in a hurry to leave.",
    courses: [
      { label: "To begin", dish: "Chestnut soup, brown butter, crisp sage" },
      { label: "Pasta", dish: "Agnolotti of braised short rib, parmesan broth" },
      { label: "Main", dish: "Osso buco, saffron risotto, gremolata", note: "in the oven since nine that morning" },
      { label: "Alongside", dish: "Bitter leaves, blood orange, hazelnut" },
      { label: "Dessert", dish: "Espresso, salted dark chocolate", note: "and a digestif by the fire" },
    ],
    pairing: "A serious Nebbiolo with the braise; something amber and sweet with the chocolate.",
    dish: { slot: "menu-by-the-fire", label: "Osso buco, by the fire", tone: "smoke", alt: "Osso buco with saffron risotto and gremolata in a wide bowl by firelight." },
  },
];
