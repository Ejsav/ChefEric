// Sample menus. They are presented on the site as samples, never as records
// of real past evenings: every real menu is written with the chef chosen for
// one table. They show the range: the season, the setting and the reason for
// gathering decide the food.
// CONFIRM: rewrite with the chefs Eric works with, in their dishes.

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
  },
  {
    slug: "late-summer-outdoors",
    title: "Late summer, outdoors",
    occasion: "A dinner among friends",
    setting: "estate",
    season: "August – September",
    intro: "A long table on the lawn, built around the best of the season: tomatoes, corn, day-boat fish and stone fruit.",
    courses: [
      { label: "To begin", dish: "Heirloom tomatoes, burrata, torn basil, aged balsamic" },
      { label: "Crudo", dish: "Sea scallops, lemon, chili, olive oil" },
      { label: "Pasta", dish: "Hand-cut tagliatelle, sweet corn, brown butter, pecorino" },
      { label: "Main", dish: "Whole grilled striped bass, salsa verde", note: "charred lemons, new potatoes" },
      { label: "Dessert", dish: "Roasted peaches, amaretti, mascarpone" },
    ],
    pairing: "Vermentino with the fish, a chilled Frappato as the light goes.",
  },
  {
    slug: "a-night-aboard",
    title: "A night aboard",
    occasion: "Dinner at anchor",
    setting: "yacht",
    season: "Summer",
    intro: "Composed for a galley and a deck: bright, coastal, and served the moment it is ready.",
    courses: [
      { label: "On deck", dish: "Oysters, prosecco mignonette" },
      { label: "Crudo", dish: "Local fluke, blood orange, fennel, pistachio" },
      { label: "Pasta", dish: "Linguine with littleneck clams, garlic, white wine, parsley" },
      { label: "Main", dish: "Grilled swordfish, caponata" },
      { label: "Dessert", dish: "Lemon olive-oil cake, macerated berries" },
    ],
    pairing: "Franciacorta to start, Fiano through dinner.",
  },
  {
    slug: "a-winter-table",
    title: "A winter table",
    occasion: "A milestone",
    setting: "residence",
    season: "December – February",
    intro: "Slow cooking for a cold night: braises, rich pasta, firelight, and a dessert worth staying for.",
    courses: [
      { label: "To begin", dish: "Escarole and white bean soup, parmigiano broth" },
      { label: "Pasta", dish: "Short rib agnolotti, brown butter, sage" },
      { label: "Main", dish: "Osso buco, saffron risotto, gremolata" },
      { label: "Alongside", dish: "Roasted winter greens, garlic, lemon" },
      { label: "Dessert", dish: "Tiramisù, made that afternoon", note: "amaro to finish" },
    ],
    pairing: "Barolo with the osso buco; Vin Santo with dessert.",
  },
];
