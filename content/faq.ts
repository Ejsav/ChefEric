// The questions serious clients ask before they inquire. Demo answers for
// the persona; each customer version confirms its own.

export const faqGroups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Booking",
    faqs: [
      { q: "How do I book?", a: "Send a request with the date, the place and roughly how many guests. You will hear back personally, usually the same day, to set up a short call. After the call you receive a written proposal with the menu, the team and the full cost. The date is yours once the proposal is signed." },
      { q: "How much notice do you need?", a: "Two to three weeks is comfortable for a dinner at home. Celebrations, yachts, islands and travel need four to six. Holidays and summer weekends go first. If your date is next week, ask anyway." },
      { q: "What does an evening cost?", a: "Private dinners start from $250 per guest, celebrations from $300 per guest and classes from $1,500. The proposal then prices your evening exactly: guests, menu, ingredients, team, rentals, wine and any travel, all itemised before you commit." },
      { q: "Can I give a dinner as a gift?", a: "Yes. Choose “An evening as a gift” when you send the request. Dates and details are arranged quietly with you, so the person receiving it only has to show up." },
    ],
  },
  {
    title: "On the night",
    faqs: [
      { q: "What is included?", a: "The menu, the shopping, the cooking, the service and the clean-up. Paired wines, rentals, extra staff and printed menus can be added to the proposal." },
      { q: "Can you work around allergies and diets?", a: "Always, and from the first draft rather than as a substitution on the night. List everything in the request, including the things someone simply refuses to eat." },
      { q: "Who serves?", a: "The chef's own team: a single server for a small dinner, a full service team for a large one. You should be a guest at your own party." },
      { q: "What do we need to have?", a: "A working stove and oven is usually enough. Anything missing, from burners to platters to glassware, is brought in. Without a kitchen, a temporary one is built." },
    ],
  },
  {
    title: "Travel and settings",
    faqs: [
      { q: "Where do you cook?", a: "Home is New York, and most dinners are in the city and on the East End. Palm Beach, yachts, private islands, hangars and destinations abroad are all by arrangement." },
      { q: "Do you cook on yachts and islands?", a: "Yes. On a yacht the menu is planned with the captain around the galley and storage. For an island, everything is packed and planned before departure, with spares for anything critical." },
      { q: "How is travel billed?", a: "Flights, lodging and transport for the team appear as separate lines in the proposal, so the total is clear before you agree to anything." },
    ],
  },
  {
    title: "Classes and collaborations",
    faqs: [
      { q: "What happens in a private class?", a: "An afternoon at your counter for a family, a few friends or a team: fresh pasta, fish, sauces, whatever the group wants to learn. It ends with everyone eating what they cooked, and printed recipes to take home." },
      { q: "Do you do brand work, events or appearances?", a: "Occasionally. Choose “A collaboration or appearance” in the request and describe the project. Every serious enquiry gets a reply." },
    ],
  },
  {
    title: "Privacy",
    faqs: [
      { q: "Will anyone find out I booked you?", a: "Not from the chef or the team. Clients are never named, homes are never photographed and nothing about your evening is posted anywhere." },
      { q: "Will you sign an NDA?", a: "Yes. Mention it in the request and it becomes part of the proposal, covering everyone who works the evening." },
    ],
  },
];
