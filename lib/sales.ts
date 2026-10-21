import { budgets, businessTypes, designChoices, featureChoices, money, offer, palettes, timelines } from "@/content/offer";
import { builder } from "@/lib/site";

// The website inquiry's shared logic: the answer type, client-side checks
// (the server re-checks everything with lib/sales-schema.ts), and the two
// emails: the lead for Eric and the acknowledgment for the person who wrote.

type Id<T extends readonly { id: string }[]> = T[number]["id"];

export type WebsiteRequest = {
  name: string;
  email: string;
  phone?: string;
  business: string;
  website?: string;
  type: Id<typeof businessTypes>;
  design: Id<typeof designChoices>;
  palette?: Id<typeof palettes>;
  features: Id<typeof featureChoices>[];
  timeline: Id<typeof timelines>;
  budget: Id<typeof budgets>;
  notes?: string;
};
export type WebsiteField = keyof WebsiteRequest;

const labelOf = <T extends readonly { id: string; label: string }[]>(list: T, id?: string) => list.find((x) => x.id === id)?.label ?? "";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE = /^[+()\d\s.-]{6,40}$/;

/** "example.com" → "https://example.com"; null when it cannot be a web address. */
export function normalizeUrl(input?: string): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** The same rules the server applies, phrased for the person filling it in. */
export function checkRequest(r: Partial<WebsiteRequest>): Partial<Record<WebsiteField, string>> {
  const e: Partial<Record<WebsiteField, string>> = {};
  if (!r.name || r.name.trim().length < 2) e.name = "Please add your name.";
  if (!r.email || !EMAIL.test(r.email.trim())) e.email = "Please use a valid email address, so the reply reaches you.";
  if (r.phone?.trim() && !PHONE.test(r.phone.trim())) e.phone = "Digits, spaces and + ( ) - only.";
  if (!r.business || r.business.trim().length < 2) e.business = "The name of your business, or your own name if they are the same.";
  if (r.website?.trim() && !normalizeUrl(r.website)) e.website = "That doesn't look like a web address. Leave it empty if you don't have one.";
  if (!r.type) e.type = "Choose the closest.";
  if (!r.design) e.design = "Choose one.";
  if (!r.timeline) e.timeline = "Choose one.";
  if (!r.budget) e.budget = "Choose one, even if it is “not sure yet”.";
  if (r.notes && r.notes.length > 2000) e.notes = "Please keep this under 2,000 characters.";
  return e;
}

export function describeRequest(r: WebsiteRequest) {
  return [
    ["Business", `${r.business} (${labelOf(businessTypes, r.type)})`],
    ["Current website", normalizeUrl(r.website) ?? "None yet"],
    ["Design", `${labelOf(designChoices, r.design)}${r.design === "palette" && r.palette ? ` — ${labelOf(palettes, r.palette)}` : ""}`],
    ["Features", r.features.length ? r.features.map((f) => labelOf(featureChoices, f)).join(", ") : "The standard set"],
    ["Launch", labelOf(timelines, r.timeline)],
    ["Budget", labelOf(budgets, r.budget)],
  ] as const;
}

export function websiteLeadEmail(r: WebsiteRequest, ref: string, origin: string[], flags: string[] = []) {
  const flag = flags.length ? `[${flags.join(", ")}] ` : "";
  return {
    subject: `${flag}${ref} · Website · ${r.business} · ${labelOf(budgets, r.budget)} · ${labelOf(timelines, r.timeline)}`.slice(0, 200),
    text: [
      `New website request — ${ref}`,
      ...(flags.length ? [`Flagged: ${flags.join(", ")}`] : []),
      "",
      `${r.name}`,
      `${r.email}${r.phone ? ` · ${r.phone}` : ""}`,
      "",
      ...describeRequest(r).map(([k, v]) => `${k}: ${v}`),
      "",
      "Notes:",
      r.notes?.trim() || "—",
      "",
      "— Origin —",
      ...(origin.length ? origin : ["No attribution captured"]),
      "",
      `Reference: ${ref}`,
      "Reply to this email to answer them directly.",
    ].join("\n"),
  };
}

export function websiteAckEmail(r: WebsiteRequest, ref: string) {
  const first = r.name.trim().split(/\s+/)[0];
  return {
    subject: `Your website request — ${ref}`,
    text: [
      `Hello ${first},`,
      "",
      `Thank you for your request for a website for ${r.business}. It has arrived, and I will reply personally within one business day to set up a short call.`,
      "",
      "What you sent:",
      ...describeRequest(r).map(([k, v]) => `· ${k}: ${v}`),
      "",
      `For reference, the plan is ${money(offer.setup)} to set up and ${money(offer.monthly)} a month, with no minimum term. Nothing is charged until you have a written proposal and have agreed to it.`,
      "",
      `Your reference is ${ref}. To add anything, simply reply to this email.`,
      "",
      builder.name,
      builder.url,
    ].join("\n"),
  };
}
