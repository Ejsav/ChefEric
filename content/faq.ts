// The questions serious clients ask before they inquire. Demo answers for
// the persona; each customer version confirms its own.

export const faqGroups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Booking",
    faqs: [
      { q: "How does booking work?", a: "Send a request with the date, place and number of guests. The chef's office reads it personally and arranges a short call. From that call comes a written proposal: menu, staffing and the full cost. Your date is held once the proposal is agreed." },
      { q: "How far in advance should I book?", a: "Two to three weeks suits most private dinners. Celebrations, travel, yachts and islands need more, usually four to six weeks. Holidays and summer weekends fill first. If your date is close, ask anyway." },
      { q: "How is an evening priced?", a: "Private dinners begin from $250 per guest; celebrations from $300 per guest; classes from $1,500. Every engagement is then quoted individually — guests, menu and sourcing, team, rentals, wine and travel — and you see the complete cost before you confirm anything." },
      { q: "Can I give an evening as a gift?", a: "Yes. A private dinner or a cooking class makes a memorable gift. Choose “An evening as a gift” in the request and the office will arrange the details with you, discreetly." },
    ],
  },
  {
    title: "The evening",
    faqs: [
      { q: "What is included?", a: "A menu written for your table, sourcing, cooking in your kitchen, table service and a kitchen left cleaner than it was found. Wine pairing, rentals, extra staff and printed menu cards can all be added in the proposal." },
      { q: "Do you accommodate allergies and dietary needs?", a: "Always. Allergies, intolerances and preferences are designed into the menu from the first draft rather than substituted at the end. Tell us everything in the request, including things nobody at the table eats." },
      { q: "Who serves the meal?", a: "The chef's own team. For larger evenings the team grows to match, from a single server to a full brigade, so you can be a guest at your own table." },
      { q: "What do I need to provide?", a: "Usually a working stove and oven. Anything else, from extra burners to platters and glassware, is brought or arranged in advance. For venues without a kitchen, a mobile kitchen can be planned." },
    ],
  },
  {
    title: "Travel and settings",
    faqs: [
      { q: "Where do you cook?", a: "The chef is based in New York and cooks throughout the city, Connecticut and the Hamptons. Florida, yachts, private islands and destinations abroad are all by arrangement." },
      { q: "Do you cook on yachts and private islands?", a: "Yes. Yacht dinners are planned with the captain and crew around the galley and provisioning; island engagements are planned in full before departure, with a backup for every critical ingredient." },
      { q: "How is travel handled?", a: "Travel and accommodation for the chef and team are set out clearly in the proposal, so the full cost is known before you confirm." },
    ],
  },
  {
    title: "Classes and collaborations",
    faqs: [
      { q: "What happens in a private cooking class?", a: "A class at your counter for one family, a few friends or a team: fresh pasta by hand, sauces, technique. It is planned around the group's skill and appetite, everyone eats what they made, and the recipes are yours to keep." },
      { q: "Do you take on brand collaborations, events or appearances?", a: "Selectively. Choose “A collaboration or appearance” in the request and tell us about the project; the office replies to every serious inquiry." },
    ],
  },
  {
    title: "Discretion",
    faqs: [
      { q: "Will my name or home appear anywhere?", a: "No. Guests are never named, homes are never photographed for publicity, and nothing from your evening is published unless you ask for it." },
      { q: "Can you sign a confidentiality agreement?", a: "Yes. Say so in the request and it will be part of the proposal." },
    ],
  },
];
