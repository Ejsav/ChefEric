// Single source of truth for brand facts used in UI, metadata and JSON-LD.
// Anything marked CONFIRM must be confirmed by Eric before launch.

// The canonical origin. Explicit env wins; on Vercel we fall back to the
// project's live production address so canonical URLs, the sitemap and
// structured data never point at a domain that isn't serving the site yet.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000");

export const site = {
  name: "Eric Jokl",
  shortName: "Eric Jokl",
  house: "Private Evenings",
  url: origin.replace(/\/$/, ""),
  // CONFIRM: set NEXT_PUBLIC_CONTACT_EMAIL once the inbox exists. Until then
  // no address is shown anywhere; every "write to us" becomes a request link.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  region: "By arrangement",
  serviceArea: ["New York", "Connecticut", "The Hamptons", "Florida", "Yachts and private islands, by arrangement"],
  responseNote: "Every inquiry is read by Eric Jokl's office and answered personally.",
  description:
    "Eric Jokl — private evenings designed, directed and hosted by a builder of experiences. The room, the light, the sound and the story are his; the kitchen belongs to a chef chosen for each table. In residences, aboard yachts and on private islands, by arrangement.",
  // Shown in the footer. The photography on this site is AI-generated with
  // Eric's own likeness; saying so plainly is part of the standard.
  imageryNote: "Imagery created with AI, from Eric Jokl's likeness",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "", // CONFIRM: handle without @; hidden while empty
  },
} as const;

export const nav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Menus" },
  { href: "/eric", label: "Eric" },
  { href: "/inquire", label: "Inquire" },
] as const;

// Secondary navigation (footer): everything a client or a search engine
// should reach in two clicks.
export const footerNav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Sample menus" },
  { href: "/eric", label: "Eric Jokl" },
  { href: "/private-dining", label: "Where evenings travel" },
  { href: "/questions", label: "Questions" },
  { href: "/inquire", label: "Request an evening" },
] as const;
