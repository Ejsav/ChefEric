// Words for the home page and the shared closing sections. Each section has
// one job and says something no other section says; a customer version
// rewrites these in its own voice without touching the components.

export const home = {
  hero: {
    eyebrow: "Private Chef",
    eyebrowMore: " · New York & Beyond",
    lead: "Modern coastal and Italian cooking for one table at a time: in your home, aboard your yacht, on your island.",
    primary: { href: "/inquire", label: "Request an evening" },
    secondary: { href: "/menus", label: "See sample menus" },
    foot: "Dinners · Yachts · Islands · Classes",
  },

  // Why a private table at all.
  premise: {
    words:
      "The best seat in any city is not in a restaurant. It is at a private table, in a house with the candles lit and nobody else waiting for it. Eric Jokl cooks for that table, wherever it happens to be.",
    emphasis: ["private", "table,", "Eric", "Jokl"],
    lead:
      "No packages and no set menus. You bring the guests and the reason; the chef brings the kitchen team, the shopping, the service and the clean-up.",
  },

  // What is on offer: the four forms (content/experiences.ts).
  experiences: {
    lines: ["Four ways", "to the table."] as [string, string],
    lead: "In your home, on the water, at your own counter or for a celebration. A guide price is where an evening starts; your proposal prices it exactly.",
  },

  // The food (content/menus.ts).
  table: {
    lines: ["The menus,", "by example."] as [string, string],
    lead: "Coastal, fire-led and Italian in spirit, shaped by the week's market and the room it is served in. Four samples, to show the range.",
  },

  // Who cooks, and how.
  chef: {
    lines: ["Precise in the kitchen.", "Invisible in the room."] as [string, string],
    body: [
      "Eric Jokl cooks modern coastal and Italian food led by the season: raw fish and citrus, pasta rolled by hand, whole fish and meat over fire.",
      "The cooking is exact and the hospitality is warm. A small team serves without hovering, and the evening moves at the pace of the table, not the kitchen.",
    ],
    ledger: [
      ["Cuisine", "Modern coastal and Italian, led by the season"],
      ["Service", "Private dinners, yachts, islands and classes"],
      ["Based", "New York, travelling by arrangement"],
      ["The table", "From two guests to eighty"],
      ["The team", "A sous chef and servers, sized to the guest list"],
    ] as [string, string][],
  },

  gallery: {
    lines: ["The work,", "up close."] as [string, string],
  },

  // Trust without a logo wall.
  discretion: [
    { title: "No names, ever", body: "Who came to dinner is not a story the chef tells: not online, not to the next client, not to anyone." },
    { title: "No photographs of your home", body: "The team does not post, tag or keep pictures of where they cooked. If you want the evening captured, you choose the photographer." },
    { title: "Paper, if you need it", body: "A confidentiality agreement can be signed by the chef and every member of the team before anyone walks through the door." },
  ],

  close: {
    eyebrow: "Private requests",
    lines: ["Name the date.", "The rest is ours."] as [string, string],
    lead: "When, where and roughly how many. Everything after that is a conversation.",
  },

  footer: {
    line: "Dinner, by arrangement.",
  },
} as const;
