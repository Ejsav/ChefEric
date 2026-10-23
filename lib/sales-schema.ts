import "server-only";
import { z } from "zod";
import { budgets, businessTypes, designChoices, featureChoices, palettes, timelines } from "@/content/offer";
import { EMAIL, PHONE, normalizeUrl, type WebsiteRequest } from "@/lib/sales";

// The server's gate for website requests. The form checks the same rules
// (checkRequest in lib/sales.ts) so nobody meets a surprise at the end.
const ids = <T extends readonly { id: string }[]>(o: T) => o.map((x) => x.id) as unknown as [T[number]["id"], ...T[number]["id"][]];

// Control characters never belong in a name or a note.
const strip = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
const line = (min: number, max: number, message: string) => z.string(message).transform(strip).pipe(z.string().trim().min(min, message).max(max, message));
const optional = (max: number) => z.string().transform(strip).pipe(z.string().trim().max(max)).optional().or(z.literal(""));

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

export const websiteRequestSchema = z.object({
  name: line(2, 120, "Please add your name."),
  email: z.string("Please use a valid email address.").trim().max(200).regex(EMAIL, "Please use a valid email address."),
  phone: optional(40).refine((v) => !v || PHONE.test(v), "Digits, spaces and + ( ) - only."),
  business: line(2, 160, "Please add the name of your business."),
  website: optional(300).refine((v) => !v || normalizeUrl(v) !== null, "That doesn't look like a web address."),
  title: optional(60),
  place: optional(80),
  type: z.enum(ids(businessTypes), "Choose the closest."),
  design: z.enum(ids(designChoices), "Choose a design."),
  palette: z.enum(ids(palettes)).optional(),
  features: z.array(z.enum(ids(featureChoices))).max(featureChoices.length).default([]).transform((f) => [...new Set(f)]),
  timeline: z.enum(ids(timelines), "Choose a timeline."),
  budget: z.enum(ids(budgets), "Choose a budget."),
  notes: optional(2000),
  // Plumbing, not answers.
  submissionId: z.string().trim().min(8).max(64),
  startedAt: z.number().optional(),
  attribution: z.object({ first: touch, session: touch }).optional(),
  company: z.string().max(500).optional(), // honeypot: anything here means a bot
});

export type ParsedWebsiteRequest = z.infer<typeof websiteRequestSchema>;

// Compile-time guard: what the server accepts is what the emails describe.
const _check = (r: ParsedWebsiteRequest): WebsiteRequest => r;
void _check;
