// Single source of truth for brand facts used in UI, metadata and JSON-LD.
// This site is a template shown under a demo persona, "Chef Eric Jokl". Every
// customer version replaces these facts with their own.

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
  house: "Private Chef",
  url: origin.replace(/\/$/, ""),
  // CONFIRM: set NEXT_PUBLIC_CONTACT_EMAIL once the inbox exists. Until then
  // no address is shown anywhere; every "write to us" becomes a request link.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  region: "New York",
  serviceArea: ["New York", "Connecticut", "The Hamptons", "Florida", "Yachts and private islands, by arrangement"],
  responseNote: "Every inquiry is read by Chef Jokl's office and answered personally.",
  description:
    "Chef Eric Jokl — private chef based in New York. Private dinners written for one table, yacht and private-island dining, cooking classes and celebrations, by arrangement.",
  // The template offer (see /your-site and the notice bar).
  offer: { monthly: 50 },
  // Shown in the footer. This is a demo, and its photography is AI-generated
  // from Eric's likeness; saying so plainly is part of the standard.
  imageryNote: "Demo site · imagery created with AI",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "", // CONFIRM: handle without @; hidden while empty
  },
} as const;

export const nav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Menus" },
  { href: "/chef", label: "The Chef" },
  { href: "/gallery", label: "Gallery" },
  { href: "/inquire", label: "Inquire" },
] as const;

// Secondary navigation (footer): everything a client or a search engine
// should reach in two clicks.
export const footerNav = [
  { href: "/experiences", label: "Experiences" },
  { href: "/menus", label: "Sample menus" },
  { href: "/chef", label: "The Chef" },
  { href: "/gallery", label: "Gallery" },
  { href: "/private-dining", label: "Where he cooks" },
  { href: "/questions", label: "Questions" },
  { href: "/inquire", label: "Request an evening" },
  { href: "/your-site", label: "Get this site" },
] as const;
