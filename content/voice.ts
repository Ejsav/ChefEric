// The chef in his own words, and the people he has cooked for in theirs.
// This is a template: the demo shows each section with SAMPLE content, and
// every sample is labelled "Sample" on the page. A customer version replaces
// them with real, approved words — or empties an array to hide its section.

/** The chef's own words. The first appears on the home page. */
export const quotes: { text: string; context?: string; sample?: boolean }[] = [];

/** Client words, approved by the client in writing. Attribution describes,
 *  it doesn't identify. */
export const testimonials: { quote: string; attribution: string; sample?: boolean }[] = [
  { quote: "We have eaten in the best rooms in the world. This was better, because it was ours.", attribution: "A host on the Upper East Side", sample: true },
  { quote: "Twelve guests, three allergies, a galley the size of a closet. Nobody noticed anything but the food.", attribution: "A yacht owner, Newport", sample: true },
  { quote: "My children still talk about the night they made pasta with the chef. So do the adults.", attribution: "A family in Greenwich", sample: true },
];

/** Verifiable figures for the chef section, e.g.
 *  { figure: "15", label: "years in professional kitchens" }. */
export const credentials: { figure: string; label: string }[] = [];

/** Press and appearances, when they exist. */
export const press: { outlet: string; title: string; url?: string; year?: string }[] = [];
