// The questions serious clients ask before they inquire, answered with
// specifics. These are the demo persona's policies; each customer version
// states its own (prices, deposit, cancellation, staffing).

export const faqGroups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Booking and availability",
    faqs: [
      { q: "How do I book?", a: "Send a request with the date, the place and roughly how many guests. You hear back personally within one business day to set up a short call. After the call you receive a written proposal with the menu, the team and the full cost. The date is held once the proposal is signed and the deposit is paid." },
      { q: "How much notice do you need?", a: "Two to three weeks for a dinner at home; four to six for celebrations, yachts, islands and travel. Holidays and summer weekends book first, often two months out. If your date is next week, ask anyway: weeknights are often open." },
      { q: "How far ahead can I book?", a: "Up to a year ahead. Dates are held in the order signed proposals arrive, never by a request alone." },
      { q: "Can I give an evening as a gift?", a: "Yes. Choose “An evening as a gift” in the request. The date and details are arranged quietly with you; the person receiving it only has to show up." },
    ],
  },
  {
    title: "Cost and commitments",
    faqs: [
      { q: "What does an evening cost?", a: "As a guide, private dinners start from $250 per guest, celebrations from $300 per guest and classes from $1,500. Those are starting points, not quotes. The proposal prices your evening line by line before you commit: menu and ingredients, the team, rentals, wine and any travel." },
      { q: "What is in the price, and what is extra?", a: "The guide covers the menu, ingredients, cooking, service for a seated dinner and the clean-up. Paired wines, rentals, additional staff, tenting and travel are separate lines in the proposal, so nothing appears on the invoice that you did not see first." },
      { q: "Is there a deposit?", a: "Half the total holds the date once the proposal is signed. The balance is due seven days before the evening, when the final guest count is confirmed." },
      { q: "What if we need to cancel or move the date?", a: "Cancel thirty days or more ahead and the deposit is refunded in full. Between thirty and eight days, half the deposit is kept. Within seven days, costs already committed (ingredients, staff, rentals) are kept and the rest refunded. Moving the date once is free if the new date is available." },
      { q: "Do we tip?", a: "Service is included in the proposal. Gratuity is never expected; if you want to thank the team, it goes to them in full." },
    ],
  },
  {
    title: "Guests and staffing",
    faqs: [
      { q: "How many guests can you cook for?", a: "From two to eighty at a seated dinner. Classes are kept to twelve so that everyone actually cooks. Larger receptions are possible by proposal." },
      { q: "Who serves, and how many staff come?", a: "The chef's own team. As a rule: one server for every eight to ten seated guests, a sous chef from twelve guests, and a captain to run the room from thirty. Small dinners are often just the chef and one server." },
      { q: "Can you handle the wine?", a: "Yes. A sommelier can pair and pour, or the team serves from your own cellar at no extra charge." },
    ],
  },
  {
    title: "Food and diets",
    faqs: [
      { q: "Can you work around allergies and diets?", a: "Always, and from the first draft rather than as a substitution on the night. List everything in the request, including the things someone simply refuses to eat. Severe allergies are prepared separately, with their own boards and pans." },
      { q: "Vegetarian, vegan, gluten-free, kosher-style or halal?", a: "Yes to vegetarian, vegan and gluten-free menus, for one guest or the whole table. Kosher-style and halal menus are cooked with certified ingredients; a supervised kosher kitchen needs supervision arranged by the host." },
      { q: "Can you cook for children?", a: "Yes. Children can have their own menu, served at their own pace, often while the adults are still on the second course." },
    ],
  },
  {
    title: "Travel and settings",
    faqs: [
      { q: "Where do you cook?", a: "Home is New York, and most dinners are in the city and on the East End. Palm Beach, yachts, private islands, hangars and destinations abroad are all by arrangement." },
      { q: "What do we need to have?", a: "A working stove and oven is usually enough. Anything missing, from burners to platters to glassware, is brought in. Without a kitchen, a temporary one is built." },
      { q: "Do you cook on yachts and islands?", a: "Yes. On a yacht the menu is planned with the captain around the galley and storage. For an island, everything is packed and planned before departure, with spares for anything critical." },
      { q: "How is travel billed?", a: "Flights, lodging and transport for the team appear as separate lines in the proposal, at cost, so the total is clear before you agree to anything." },
    ],
  },
  {
    title: "Planning",
    faqs: [
      { q: "What happens after I send a request?", a: "A reply within one business day, then a twenty-minute call about the guests, the place and the reason. The written proposal follows within two business days of the call." },
      { q: "How involved do I need to be?", a: "As much or as little as you like. Most hosts take the call, approve the menu and then simply arrive at their own dinner." },
      { q: "Do you do brand work, events or appearances?", a: "Occasionally. Choose “A collaboration or appearance” in the request and describe the project. Every serious enquiry gets a reply." },
    ],
  },
  {
    title: "Privacy",
    faqs: [
      { q: "Will anyone find out I booked you?", a: "Not from the chef or the team. Clients are not named, homes are not photographed and nothing about your evening is posted anywhere." },
      { q: "Will you sign an NDA?", a: "Yes. Mention it in the request and it becomes part of the proposal, covering everyone who works the evening." },
    ],
  },
];
