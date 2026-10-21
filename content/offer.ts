// The commercial offer behind the template: what a customer buys, what it
// costs, what is included and what is not. /your-site, the website inquiry,
// the terms page, the notice bar and structured data all read from here, so
// a price or a term changes in one place.
//
// CONFIRM: these are proposed terms. Eric confirms every figure and policy
// below before this ships to production (see README → Launch checklist).

export const offer = {
  /** The monthly plan, USD. */
  monthly: 50,
  /** One-time setup, USD. CONFIRM */
  setup: 500,
  /** Small edit requests included each month. CONFIRM */
  editsPerMonth: 2,
  /** Photographs prepared and placed during setup. CONFIRM */
  setupImages: 30,
  /** Support reply time. CONFIRM */
  supportReply: "two business days",
  /** Typical time from receiving your material to launch. CONFIRM */
  launchTime: "7–10 business days",
  /** Notice to cancel. CONFIRM */
  cancelNotice: "30 days",
  /** Days to hand over an export when a customer leaves. CONFIRM */
  exportDays: 5,
} as const;

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
/** Small counts read as words in running text: "two small requests". */
export const say = (n: number) => WORDS[n] ?? String(n);

/** Who the template is built for. */
export const audience = [
  { title: "Private chefs", body: "Dinners at home, yachts, villas, classes. The site this demo shows, made yours." },
  { title: "Caterers and event chefs", body: "Larger tables and celebrations, with the inquiry asking about guests, venue and service." },
  { title: "Supper clubs and chef's tables", body: "Seasonal menus and a request flow that reads like a reservation book." },
  { title: "Yacht and villa chefs", body: "Destination work, location pages and a planner built around where the table is." },
] as const;

/** Why this design is worth having. Every claim is true of this codebase. */
export const reasons = [
  { title: "Benchmarked against luxury hospitality", body: "Editorial type, one warm light, restraint and space. It is measured against hotel and members'-club sites, not other chef sites, so it reads as the top of the market." },
  { title: "Built to turn interest into inquiries", body: "Sample menus, an evening planner and a conversational request form that asks one question at a time and reads the request back before it is sent." },
  { title: "Fast, accessible, mobile-first", body: "Server-rendered pages, modern image formats, a thumb-reach request button on phones, and motion that steps aside for slow connections and reduced-motion settings." },
  { title: "Discreet by design", body: "No review widgets, no advertising trackers, no third-party chat bubbles. Privacy-friendly analytics only, so your clients are never followed around the web." },
] as const;

/** What changes when the site becomes yours. */
export const customized = [
  ["Name, mark and palette", "Your name set in the display type, your monogram, and a palette tuned to your work."],
  ["Words", "Every page in your voice, about your work: nothing invented, nothing borrowed from anyone else."],
  ["Photography", "Your photographs placed and cropped in every frame, or editorial imagery created from your likeness."],
  ["Offer", "Your services, menus, prices, locations and questions, and an inquiry that asks what you need to know."],
  ["Domain and inbox", "Your own domain, with every request arriving in your inbox and an acknowledgment sent to the client."],
] as const;

/** What stays as designed (the template), so the price stays where it is. */
export const fixed = "The layout system, motion and features stay as designed. Bespoke layouts and new features are available as quoted extras.";

/** The plan, line by line. `where`: monthly plan, one-time setup, or quoted extra. */
export type Coverage = "monthly" | "setup" | "extra" | "yours";
export const coverage: { item: string; where: Coverage[]; note: string }[] = [
  { item: "Hosting and HTTPS", where: ["monthly"], note: "Served from a global edge network, with security certificates renewed automatically." },
  { item: "Domain connection", where: ["setup", "monthly"], note: "Connected at launch and kept working. You register and own the domain yourself, typically $10–$20 a year paid to the registrar." },
  { item: "Inquiry form", where: ["monthly"], note: "Requests delivered to your inbox, an acknowledgment to the client, spam filtering and abuse limits." },
  { item: "Image placement", where: ["setup", "monthly", "extra"], note: `Up to ${offer.setupImages} photographs prepared and placed at setup; photo swaps count as monthly edits; larger sets are quoted.` },
  { item: "Copywriting", where: ["setup", "extra"], note: "Your notes edited into finished copy at setup. Writing every page from scratch is a quoted extra." },
  { item: "Ongoing edits", where: ["monthly", "extra"], note: `${say(offer.editsPerMonth).replace(/^./, (c) => c.toUpperCase())} small requests a month: text, prices, menus, a photo. Anything larger is quoted before work starts.` },
  { item: "Maintenance and security", where: ["monthly"], note: "Framework and dependency updates, uptime monitoring, and every version of the site kept in version control." },
  { item: "Analytics", where: ["monthly"], note: "Visits, sources and completed inquiries, measured without advertising cookies." },
  { item: "Technical support", where: ["monthly"], note: `By email, with a reply within ${offer.supportReply}.` },
  { item: "New pages and features", where: ["extra"], note: "Booking calendar, deposits or payments, a journal, a newsletter, a second language. Quoted in writing first." },
  { item: "Redesign", where: ["extra"], note: "A new layout or art direction, quoted as a project." },
  { item: "Your words, photographs and domain", where: ["yours"], note: "Always yours, whether you stay or go." },
];

/** How it works, from first message to launch. */
export const onboarding = [
  { step: "Tell us about you", time: "Two minutes", body: "A short form: your business, the design you want, the features you need, your timing and your budget." },
  { step: "A call", time: "Twenty minutes", body: "What you cook, who you cook for and what the site must do. Usually within two business days of your request." },
  { step: "A written proposal", time: "Within one business day", body: "A fixed setup price, the monthly plan and anything extra, in writing. Nothing starts until you agree." },
  { step: "Your material", time: "At your pace", body: "Words, photographs, menus and prices, sent against a simple checklist. Missing something? We help you fill the gaps." },
  { step: "A private preview", time: offer.launchTime, body: "Your site on a private link, with two rounds of changes before anything is public." },
  { step: "Launch", time: "Day one of your plan", body: "Live on your domain, requests arriving in your inbox. The monthly plan starts the day you launch." },
] as const;

/** Billing, cancellation, ownership and leaving. Mirrored on /terms. */
export const terms = [
  { q: "What do I pay, and when?", a: `${money(offer.setup)} one-time setup, invoiced when work starts. Then ${money(offer.monthly)} a month, starting the day your site launches and billed monthly in advance. Extras are quoted in writing and billed only once you approve them.` },
  { q: "How do I pay?", a: "By card or bank transfer through a secure invoice link. No payment is ever taken on this website, and nothing is charged until you have a written proposal and have agreed to it." },
  { q: "Is there a contract or minimum term?", a: `No minimum term. Cancel any time with ${offer.cancelNotice}' notice and the plan stops at the end of that period. Setup is non-refundable once your preview has been delivered.` },
  { q: "Who owns what?", a: "Your words, your photographs, your logo and your domain are yours, always. The design and code of the template are licensed to you for as long as your plan is active." },
  { q: "Can I leave and take my site with me?", a: `Yes. Your content and photographs are exported and handed over within ${say(offer.exportDays)} business days of cancelling. If you want the site itself to keep running elsewhere, the code can be bought out with a one-time license, quoted in writing.` },
  { q: "What about the domain?", a: "Register it in your own name, with any registrar. We connect it and keep it pointing at your site; we never hold it, so it is never part of any negotiation." },
] as const;

/** The questions a buyer asks before writing. */
export const faqs = [
  { q: "Is Chef Eric Jokl a real chef?", a: "No. “Chef Eric Jokl” is a demo persona used to show the template. The menus, prices and testimonials are examples. Your version carries your real name, story, photographs and prices." },
  { q: "Who builds it?", a: "Eric Jokl, the designer and developer who built this demo. You deal with the person who wrote the code, from the first call to the last edit." },
  { q: "How fast can it launch?", a: `Typically ${offer.launchTime} after your material arrives. The usual wait is for photographs; the build itself is quick because the foundation already exists.` },
  { q: "What do I need to provide?", a: "Your name, your story in your own words or notes, your services and prices, your menus and your photographs. No photographs yet? Editorial imagery can be created from a set of reference photos of you, as a quoted extra." },
  { q: "Can I see my version before it goes live?", a: "Yes. You review it on a private link and get two rounds of changes before launch." },
  { q: "What if I need something the template doesn't do?", a: "Ask. Bookings, deposits, a journal, a second language and new sections can all be added as quoted extras, priced before any work starts." },
] as const;

// ── The website inquiry's vocabulary (shared by the form and the API). ──

export const businessTypes = [
  { id: "private-chef", label: "Private chef" },
  { id: "caterer", label: "Caterer or event chef" },
  { id: "supper-club", label: "Supper club or chef's table" },
  { id: "restaurant", label: "Restaurant" },
  { id: "hospitality", label: "Hospitality brand or venue" },
  { id: "other", label: "Something else" },
] as const;

export const designChoices = [
  { id: "as-is", label: "This design, made mine", hint: "Your name, words, photographs and offer" },
  { id: "palette", label: "This design, in my colors", hint: "Plus a palette tuned to your brand" },
  { id: "different", label: "Something different", hint: "Let's talk about a custom build" },
] as const;

export const featureChoices = [
  { id: "menus", label: "Sample menus" },
  { id: "gallery", label: "Gallery" },
  { id: "locations", label: "Location pages" },
  { id: "planner", label: "Evening planner" },
  { id: "booking", label: "Booking calendar" },
  { id: "payments", label: "Deposits or payments" },
  { id: "journal", label: "Journal or blog" },
  { id: "language", label: "A second language" },
  { id: "newsletter", label: "Newsletter sign-up" },
] as const;

export const timelines = [
  { id: "asap", label: "As soon as possible" },
  { id: "month", label: "Within a month" },
  { id: "quarter", label: "In one to three months" },
  { id: "exploring", label: "Just exploring" },
] as const;

export const budgets = [
  { id: "plan", label: `The plan as listed`, hint: `${money(offer.setup)} setup, then ${money(offer.monthly)}/month` },
  { id: "extras", label: "The plan plus extras", hint: "Up to $2,500 on top" },
  { id: "custom", label: "A custom build", hint: "$2,500 and up" },
  { id: "unsure", label: "Not sure yet" },
] as const;

// Accent palettes for the customization preview. Each is tuned to read on
// the espresso ground at AA contrast or better.
export const palettes = [
  { id: "brass", label: "Brass", accent: "190 156 104" },
  { id: "rose", label: "Rosé", accent: "204 152 140" },
  { id: "sage", label: "Sage", accent: "160 176 138" },
  { id: "tide", label: "Tide", accent: "140 170 190" },
  { id: "silver", label: "Silver", accent: "190 186 178" },
] as const;

/** Worked examples of personalization, shown on /your-site. Illustrations,
 *  not client sites: the names are invented and labelled as such. */
export const examples = [
  { name: "Marisol Vega", role: "Private Chef", place: "Miami & the Keys", palette: "tide", line: "Coastal Latin cooking, at home and at anchor." },
  { name: "Thomas Hale", role: "Chef's Table", place: "The Cotswolds", palette: "sage", line: "Twelve seats, one long table, the garden on every plate." },
  { name: "Aiko Mori", role: "Private Chef", place: "Los Angeles", palette: "rose", line: "Kaiseki-minded dinners for small, quiet tables." },
] as const;
