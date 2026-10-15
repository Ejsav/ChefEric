// Eric Jokl in his own words, and the people he has hosted in theirs.
// Every array here starts EMPTY on purpose: the site never shows an invented
// quote, testimonial or number. Each section appears automatically the moment
// its array has content. Fill these from docs/ERIC_VOICE.md.

/** Eric's own words. The first appears on the home page under the premise;
 *  others can be used across the site. Exact wording, approved by Eric. */
export const quotes: { text: string; context?: string }[] = [
  // { text: "…", context: "On designing a room" },
];

/** Client words, approved by the client in writing. Never a full name
 *  unless they ask for it. Attribution describes, it doesn't identify. */
export const testimonials: { quote: string; attribution: string }[] = [
  // { quote: "…", attribution: "A host in Manhattan" },
];

/** Verifiable figures for the Eric section ledger, e.g.
 *  { figure: "40", label: "private evenings hosted" }. Only once true. */
export const credentials: { figure: string; label: string }[] = [];

/** Press and appearances, when they exist. */
export const press: { outlet: string; title: string; url?: string; year?: string }[] = [];
