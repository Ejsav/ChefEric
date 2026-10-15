// CONFIRM: step 05 (a printed record after each evening) is a promise —
// keep it only if every evening will receive one.
export const method = [
  {
    n: "01",
    title: "A conversation",
    body: "A private call with Eric. The guests, the reason, the setting, the allergies nobody mentions until the night. Nothing is assumed.",
  },
  {
    n: "02",
    title: "A concept, written once",
    body: "The evening designed as a whole — room, light, sound, pace, and a menu written with the chef chosen for your table. Sent as a proposal, refined together, never repeated.",
  },
  {
    n: "03",
    title: "Production",
    body: "The chef and kitchen team, service, wine, rentals, florals, sound: sourced, briefed and scheduled so you have nothing to manage.",
  },
  {
    n: "04",
    title: "The evening",
    body: "Eric arrives hours before the first guest and directs the night from the first candle to the last pour. Service is warm, precise and nearly invisible.",
  },
  {
    n: "05",
    title: "A record after",
    body: "A printed card with the menu, the wine and the music of the night — so the evening can be remembered exactly, and repeated by nobody else.",
  },
] as const;
