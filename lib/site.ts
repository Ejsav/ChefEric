// Single source of truth for brand facts used in UI, metadata and JSON-LD.
// This site is a template shown under a demo persona, "Chef Eric Jokl". Every
// customer version replaces these facts with their own and sets demo: false.

// The canonical origin. Explicit env wins; on Vercel we fall back to the
// project's live production address so canonical URLs, the sitemap and
// structured data never point at a domain that isn't serving the site yet.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000");

export const site = {
  /**
   * The demonstration switch. While true:
   *  - the chef pages are a showcase: the notice bar, the colophon and the
   *    inquiry say so, and the chef inquiry is never delivered as a booking;
   *  - search engines index only the real pages (home, the offer, terms,
   *    privacy), never the persona's service pages;
   *  - structured data describes the template, not a chef's business.
   * A customer version sets this to false.
   */
  demo: true,
  name: "Eric Jokl",
  shortName: "Eric Jokl",
  house: "Private Chef",
  url: origin.replace(/\/$/, ""),
  // CONFIRM: set NEXT_PUBLIC_CONTACT_EMAIL once the inbox exists. Until then
  // no address is shown anywhere; every "write to us" becomes a request link.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  region: "New York",
  serviceArea: ["New York", "The Hamptons", "Palm Beach", "Yachts", "Private islands", "Private aviation, by arrangement"],
  responseNote: "Every inquiry is read by Chef Jokl's office and answered personally.",
  description:
    "Chef Eric Jokl — private chef based in New York. Private dinners for one table, yacht and private-island dining, cooking classes and celebrations, by arrangement.",
  // Shown in the footer. This is a demo, and its photography is AI-generated
  // from Eric's likeness; saying so plainly is part of the standard.
  imageryNote: "Demo site · imagery created with AI",
  // The optional music behind the Sound button (components/system/Ambience).
  // Off until a visitor asks; streamed only then.
  // CONFIRM: the licence for this recording covers use on a commercial site.
  ambience: "/audio/kitchen-music.mp3",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "", // CONFIRM: handle without @; hidden while empty
  },
} as const;

/** The real person behind the template: the builder who sells it. */
export const builder = {
  name: "Eric Jokl",
  role: "Designer & full-stack developer",
  // CONFIRM: the builder's own site. Used for attribution and structured data.
  url: process.env.NEXT_PUBLIC_BUILDER_URL || "https://ericjokl.com",
  // Optional: a scheduling link (Cal.com, Calendly) for a twenty-minute call.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || null,
} as const;

export const nav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Menus" },
  { href: "/chef", label: "The Chef" },
  { href: "/gallery", label: "Gallery" },
  { href: "/inquire", label: "Inquire" },
] as const;

// Secondary navigation (footer): everything a visitor or a search engine
// should reach in two clicks.
export const footerNav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Sample menus" },
  { href: "/chef", label: "The Chef" },
  { href: "/gallery", label: "Gallery" },
  { href: "/private-dining", label: "Where he cooks" },
  { href: "/questions", label: "Questions" },
  { href: "/inquire", label: "Request an evening" },
] as const;
