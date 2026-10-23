import { menus } from "@/content/menus";
import { scales } from "@/content/possibilities";

// ─────────────────────────────────────────────────────────────────────────
// The inquiry's vocabulary. Shared by the conversational client (questions,
// options, summary) and the API route (validation, the email to the office).
// ─────────────────────────────────────────────────────────────────────────

type Opt<T extends string = string> = { id: T; label: string; hint?: string };

export const roles = [
  { id: "host", label: "For myself, or my family" },
  { id: "assistant", label: "On behalf of someone", hint: "Executive assistant, chief of staff, family office" },
  { id: "planner", label: "For a client", hint: "Planner, concierge or travel advisor" },
  { id: "venue", label: "For a property", hint: "Hotel, resort, club, estate or yacht management" },
  { id: "brand", label: "For a brand or production", hint: "Collaboration, media, appearance" },
] as const satisfies readonly Opt[];

export const forms = [
  { id: "dinner", label: "A private dinner" },
  { id: "destination", label: "A destination or a stay", hint: "Yachts, islands, travel, several days" },
  { id: "occasion", label: "A celebration or hosted event" },
  { id: "lesson", label: "A private cooking class" },
  { id: "gift", label: "An evening as a gift", hint: "A dinner or a class, given to someone you love" },
  { id: "collaboration", label: "A collaboration or appearance" },
  { id: "unsure", label: "I'm not sure yet" },
] as const satisfies readonly Opt[];

export const settingOptions = [
  { id: "residence", label: "A private home", phrase: "in a private home" },
  { id: "penthouse", label: "A city apartment or penthouse", phrase: "in a city apartment" },
  { id: "estate", label: "An estate", phrase: "on an estate" },
  { id: "waterfront", label: "A waterfront home", phrase: "in a waterfront home" },
  { id: "yacht", label: "Aboard a yacht", phrase: "aboard a yacht" },
  { id: "island", label: "A private island", phrase: "on a private island" },
  { id: "hangar", label: "A hangar or private terminal", phrase: "in a private hangar" },
  { id: "abroad", label: "Abroad", phrase: "" },
  { id: "venue", label: "A venue we have chosen", phrase: "at a chosen venue" },
  { id: "undecided", label: "Not decided yet", phrase: "" },
] as const;

export const kitchenOptions = [
  { id: "full", label: "A full kitchen" },
  { id: "limited", label: "A small or limited kitchen" },
  { id: "none", label: "No kitchen — one will need to be built" },
  { id: "unknown", label: "I'm not sure" },
] as const;

export const galleyOptions = [
  { id: "full", label: "A full galley" },
  { id: "limited", label: "A compact galley" },
  { id: "unknown", label: "I'm not sure" },
] as const;

export const stayOptions = [
  { id: "evening", label: "A single evening" },
  { id: "weekend", label: "A weekend" },
  { id: "week", label: "A week or longer" },
] as const;

export const whenOptions = [
  { id: "date", label: "A specific date" },
  { id: "season", label: "A month or season" },
  { id: "flexible", label: "We're flexible" },
] as const;

// How many. The bands meet without gaps and match the planner's table sizes
// (content/possibilities.ts) and every number the site states: dinners from
// two to eighty, larger by proposal; classes from one to twelve.
export const guestOptions = [
  { id: "1-8", label: "One to eight", lesson: true },
  { id: "2-8", label: "Two to eight", lesson: false },
  { id: "9-12", label: "Nine to twelve", lesson: true },
  { id: "9-24", label: "Nine to twenty-four", lesson: false },
  { id: "25-80", label: "Twenty-five to eighty", lesson: false },
  { id: "80+", label: "More than eighty", lesson: false },
] as const;

/** The bands that apply: a class counts cooks (twelve at most), everything else guests. */
export const guestOptionsFor = (form?: string) => guestOptions.filter((g) => g.lesson === (form === "lesson"));
export const guestsFit = (form?: string, guests?: string): guests is NonNullable<Answers["guests"]> =>
  guestOptionsFor(form).some((g) => g.id === guests);

export const occasionOptions = [
  { id: "friends", label: "Dinner among friends", phrase: "dinner among friends" },
  { id: "milestone", label: "A birthday or anniversary", phrase: "a milestone" },
  { id: "business", label: "Hosting for business", phrase: "an evening of hosting" },
  { id: "family", label: "A family gathering", phrase: "a family gathering" },
  { id: "celebration", label: "An engagement or celebration", phrase: "a celebration" },
  { id: "other", label: "Something else", phrase: "" },
] as const;

export const discretionOptions = [
  { id: "standard", label: "Standard discretion is fine" },
  { id: "nda", label: "A confidentiality agreement will be needed" },
] as const;

export const contactOptions = [
  { id: "email", label: "Email" },
  { id: "phone", label: "A call" },
  { id: "text", label: "A text message" },
] as const;

// Settings that have a kitchen worth asking about, and ones that imply travel.
export const KITCHEN_SETTINGS = ["residence", "penthouse", "estate", "waterfront", "venue"] as const;
export const STAY_SETTINGS = ["island", "abroad", "yacht"] as const;
export const needsKitchen = (a: Partial<Answers>) => !!a.setting && ([...KITCHEN_SETTINGS, "yacht"] as string[]).includes(a.setting);
export const needsStay = (a: Partial<Answers>) => a.form === "destination" || (!!a.setting && (STAY_SETTINGS as readonly string[]).includes(a.setting));
export const isCollab = (a: Partial<Answers>) => a.form === "collaboration";
export const isIntermediary = (a: Partial<Answers>) => a.role === "assistant" || a.role === "planner" || a.role === "venue" || a.role === "brand";

// ─────────────────────────────────────────────────────────────────────────
// Answer types, derived from the option lists above. The server-side zod
// schema (lib/inquiry-schema.ts) is checked against this type at compile time.
// ─────────────────────────────────────────────────────────────────────────

type Id<T extends readonly { id: string }[]> = T[number]["id"];

export type Answers = {
  role: Id<typeof roles>;
  form: Id<typeof forms>;
  setting?: Id<typeof settingOptions>;
  location?: string;
  kitchen?: Id<typeof kitchenOptions>;
  stay?: Id<typeof stayOptions>;
  when: Id<typeof whenOptions>;
  date?: string;
  season?: string;
  guests?: Id<typeof guestOptions>;
  occasion?: Id<typeof occasionOptions>;
  atmosphere?: string;
  project?: string;
  organisation?: string;
  dietary?: string;
  discretion?: Id<typeof discretionOptions>;
  name: string;
  email: string;
  phone?: string;
  contactPref?: Id<typeof contactOptions>;
};
export type AnswerKey = keyof Answers;

// ─────────────────────────────────────────────────────────────────────────
// The request, in a sentence — shown to the visitor before sending and used
// as the subject line of the email the office receives.
// ─────────────────────────────────────────────────────────────────────────

const label = <T extends readonly { id: string; label: string }[]>(o: T, id?: string) => o.find((x) => x.id === id)?.label;

// Dates. The browser's date field writes yyyy-mm-dd in the visitor's own
// calendar, so "today" is the visitor's local day on the page; the server,
// which cannot know the visitor's time zone, accepts any day that is today
// somewhere on Earth.
const pad = (n: number) => String(n).padStart(2, "0");
/** A day on this device's calendar, as the date field writes it. */
export const localDay = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** The earliest calendar day anywhere right now (UTC-12). */
export const earliestDayAnywhere = (now = Date.now()) => new Date(now - 12 * 36e5).toISOString().slice(0, 10);
const AHEAD_YEARS = 3;
export const latestDay = (today: string) => `${Number(today.slice(0, 4)) + AHEAD_YEARS}${today.slice(4)}`;

/** Why a chosen date cannot be used, or null. `today` is yyyy-mm-dd. */
export function dateProblem(iso: string | undefined, today: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso?.trim() ?? "");
  if (!m) return iso?.trim() ? "Please choose a real date." : "Please choose the date.";
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const at = new Date(Date.UTC(y, mo - 1, d));
  if (at.getUTCFullYear() !== y || at.getUTCMonth() !== mo - 1 || at.getUTCDate() !== d) return "Please choose a real date.";
  if (iso! < today) return "Please choose a date from today onwards.";
  if (iso! > latestDay(today)) return `Please choose a date within the next ${AHEAD_YEARS} years.`;
  return null;
}

export function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function summarize(a: Partial<Answers>): string {
  const when =
    a.when === "date" && a.date ? `on ${formatDate(a.date)}` :
    a.when === "season" && a.season ? `in ${a.season.trim()}` :
    a.when === "flexible" ? "dates flexible" : "";

  if (a.form === "collaboration") {
    return `A collaboration${a.organisation ? ` with ${a.organisation.trim()}` : ""}${when ? `, ${when}` : ""}.`;
  }

  const lead = {
    dinner: "A private dinner",
    destination: "A destination stay",
    occasion: "A hosted celebration",
    lesson: "A private cooking class",
    gift: "An evening given as a gift",
    unsure: "An evening",
    collaboration: "A collaboration",
  }[a.form ?? "unsure"];

  const setting = settingOptions.find((s) => s.id === a.setting);
  const place = [setting?.phrase, a.location?.trim() ? `in ${a.location.trim()}` : ""].filter(Boolean).join(" ");
  const guests = a.guests ? `for ${label(guestOptions, a.guests)!.toLowerCase()} ${a.form === "lesson" ? "people" : "guests"}` : "";
  const occasion = occasionOptions.find((o) => o.id === a.occasion)?.phrase;
  const tail = [when, guests].filter(Boolean);

  // "A destination stay aboard a yacht in Newport, RI, in late June, for ten
  //  to twenty-four guests — a celebration."
  return `${lead}${place ? ` ${place}` : ""}${tail.length ? `, ${tail.join(", ")}` : ""}${occasion ? ` — ${occasion}` : ""}.`;
}

/** Human-readable rows for the review screen and the office email. */
export function details(a: Partial<Answers>): { key: AnswerKey; label: string; value: string }[] {
  const rows: { key: AnswerKey; label: string; value: string | undefined }[] = [
    { key: "role", label: "For", value: label(roles, a.role) },
    { key: "form", label: "Imagining", value: label(forms, a.form) },
    { key: "project", label: "Project", value: a.project },
    { key: "setting", label: "Setting", value: label(settingOptions, a.setting) },
    { key: "location", label: "Location", value: a.location },
    { key: "kitchen", label: a.setting === "yacht" ? "Galley" : "Kitchen", value: label(a.setting === "yacht" ? galleyOptions : kitchenOptions, a.kitchen) },
    { key: "stay", label: "Length", value: label(stayOptions, a.stay) },
    { key: "when", label: "When", value: a.when === "date" ? formatDate(a.date) : a.when === "season" ? a.season : label(whenOptions, a.when) },
    { key: "guests", label: "Guests", value: label(guestOptions, a.guests) },
    { key: "occasion", label: "Occasion", value: label(occasionOptions, a.occasion) },
    { key: "atmosphere", label: "Atmosphere", value: a.atmosphere },
    { key: "dietary", label: "Dietary notes", value: a.dietary },
    { key: "discretion", label: "Discretion", value: label(discretionOptions, a.discretion) },
    { key: "organisation", label: "Organisation", value: a.organisation },
    { key: "name", label: "Name", value: a.name },
    { key: "email", label: "Email", value: a.email },
    { key: "phone", label: "Telephone", value: a.phone },
    { key: "contactPref", label: "Prefers", value: label(contactOptions, a.contactPref) },
  ];
  return rows.filter((r): r is { key: AnswerKey; label: string; value: string } => !!r.value && r.value.trim() !== "");
}

/**
 * The email the chef's office receives for a request. Used by the API to
 * deliver it and, on the demo, to show the visitor exactly what a chef using
 * this site would get.
 */
export function officeEmail(a: Partial<Answers>, ref: string, origin: string[] = []) {
  const summary = summarize(a);
  return {
    subject: `${ref} · ${a.name ?? ""} · ${summary}`.slice(0, 200),
    text: [
      summary,
      "",
      ...details(a).map((r) => `${r.label}: ${r.value}`),
      "",
      "— Origin —",
      ...(origin.length ? origin : ["No attribution captured"]),
      "",
      `Reference: ${ref}`,
    ].join("\n"),
  };
}

// Map arrivals from the composer and experience pages onto answers.
export function prefillFromParams(q: URLSearchParams): Partial<Answers> {
  const out: Partial<Answers> = {};
  const exp = q.get("experience");
  const formByExperience: Record<string, Answers["form"]> = {
    "the-private-table": "dinner",
    "the-island-and-the-water": "destination",
    "the-kitchen-lessons": "lesson",
    "the-occasion": "occasion",
  };
  if (exp && formByExperience[exp]) out.form = formByExperience[exp];
  const menu = q.get("menu");
  const sample = menu && menus.find((m) => m.slug === menu);
  if (sample) out.atmosphere = `Something in the spirit of the sample menu “${sample.title}”.`;
  const form = q.get("form");
  if (form && forms.some((f) => f.id === form)) out.form = form as Answers["form"];
  const setting = q.get("setting");
  if (setting && settingOptions.some((s) => s.id === setting)) out.setting = setting as Answers["setting"];
  const occasion = q.get("occasion");
  if (occasion === "lesson") out.form = "lesson";
  else if (occasion && occasionOptions.some((o) => o.id === occasion)) out.occasion = occasion as Answers["occasion"];
  if (out.setting && !out.form) out.form = out.setting === "yacht" || out.setting === "island" || out.setting === "abroad" ? "destination" : "dinner";
  // From the planner: exactly the band the planner showed. A size the
  // request cannot hold (a class for eighty, from a hand-made link) is left
  // for the visitor to choose rather than quietly changed.
  const scale = scales.find((s) => s.id === q.get("scale"));
  const band = scale && (out.form === "lesson" ? scale.lessonGuests : scale.guests);
  if (band && guestsFit(out.form, band)) out.guests = band;
  return out;
}

/** Answers kept from an earlier visit, minus anything the questions no longer offer. */
export function stillValid(a: Partial<Answers>): Partial<Answers> {
  const out = { ...a };
  if (out.guests && !guestsFit(out.form, out.guests)) delete out.guests;
  return out;
}
