import "server-only";
import { z } from "zod";
import {
  contactOptions, discretionOptions, forms, guestOptions, kitchenOptions, occasionOptions, roles,
  settingOptions, stayOptions, whenOptions, type Answers,
} from "@/lib/inquiry";

const ids = <T extends readonly { id: string }[]>(o: T) => o.map((x) => x.id) as unknown as [T[number]["id"], ...T[number]["id"][]];

// ─────────────────────────────────────────────────────────────────────────
// Schema — the server's gate. The client validates step by step with the
// same rules (see stepErrors) so the visitor never meets a surprise at the end.
// ─────────────────────────────────────────────────────────────────────────

const text = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const touch = z
  .object({
    ts: z.number().optional(),
    landing: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
    content: z.string().max(120).optional(),
    term: z.string().max(120).optional(),
  })
  .nullable()
  .optional();

export const inquirySchema = z
  .object({
    role: z.enum(ids(roles), "Please tell us who the evening is for."),
    form: z.enum(ids(forms), "Please choose what you're imagining."),
    setting: z.enum(ids(settingOptions)).optional(),
    location: text(200),
    kitchen: z.enum(ids(kitchenOptions)).optional(),
    stay: z.enum(ids(stayOptions)).optional(),
    when: z.enum(ids(whenOptions), "Please tell us roughly when."),
    date: text(40),
    season: text(80),
    guests: z.enum(ids(guestOptions)).optional(),
    occasion: z.enum(ids(occasionOptions)).optional(),
    atmosphere: text(2000),
    project: text(4000),
    organisation: text(200),
    dietary: text(1000),
    discretion: z.enum(ids(discretionOptions)).optional(),
    name: z.string("Please share your name.").trim().min(2, "Please share your name.").max(120),
    email: z.string("Please use a valid email address.").trim().email("Please use a valid email address.").max(200),
    phone: text(40),
    contactPref: z.enum(ids(contactOptions)).optional(),
    invite: text(2000),
    submissionId: z.string().trim().max(64).optional(),
    attribution: z.object({ first: touch, session: touch }).optional(),
    company: z.string().max(500).optional(), // honeypot: anything here means a bot
  })
  .superRefine((a, ctx) => {
    const req = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (a.form === "collaboration") {
      if (!a.project || a.project.length < 10) req("project", "A few lines about the project, please.");
    } else {
      if (!a.setting) req("setting", "Please choose where the table will be.");
      if (a.setting && a.setting !== "undecided" && (!a.location || a.location.length < 2)) req("location", "Where, roughly? A town, city or region is enough.");
    }
    if (a.when === "date" && !a.date) req("date", "Please choose the date.");
    if (a.when === "season" && !a.season) req("season", "A month or season, please.");
    if ((a.contactPref === "phone" || a.contactPref === "text") && !a.phone) req("phone", "A number, so we can reach you as you prefer.");
    if (a.form === "lesson" && a.guests && a.guests !== "2-8" && a.guests !== "9-12") req("guests", "Classes are kept to twelve or fewer.");
    if (a.form !== "lesson" && a.guests === "9-12") req("guests", "Please choose how many guests.");
  });

export type Inquiry = z.infer<typeof inquirySchema>;

// Compile-time guard: the schema's output must stay assignable to Answers.
const _check = (i: Inquiry): Answers => i;
void _check;

