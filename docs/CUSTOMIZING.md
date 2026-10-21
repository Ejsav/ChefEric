# Turning the template into a customer's site

Selling another site must never mean rebuilding this one, and one customer's material must never reach another's repository.

## 1. A repository and a project of their own

1. Create a new **private** repository for the customer from this one (GitHub → *Use this template*, or a fresh clone pushed to a new remote). Never work on a customer inside this repository.
2. Create a new Vercel project connected **only** to that repository. Never reuse `eric-jokl` or attach a customer's domain to it.
3. In the new repository, add the customer's own previous names, domains or reference prefixes to the forbidden list in `scripts/guard.mjs` if they are leaving another provider, so nothing from elsewhere slips in.

## 2. Configuration, not code

| What | Where |
|---|---|
| Demo switch → `false` | `lib/site.ts` (`demo`) |
| Name, region, service area, description, contact | `lib/site.ts` |
| Navigation | `lib/site.ts` (`nav`, `footerNav`) |
| Home page words | `content/home.ts` |
| Experiences, prices, venue needs | `content/experiences.ts` |
| Menus, allergens, adaptations | `content/menus.ts` |
| Chapters and standards (or verified history) | `content/archive.ts` |
| Places | `content/places.ts` |
| Questions and policies | `content/faq.ts` |
| Planner rooms, reasons and rules | `content/possibilities.ts` |
| Gallery sequence and captions | `content/gallery.ts` |
| Testimonials (real, approved in writing) | `content/voice.ts` — remove `sample: true` |
| Photographs | `public/media/<slot>.*`, slots in `content/media.ts` |
| Palette | the tokens at the top of `app/globals.css` (`--brass` and friends); the five palettes in `content/offer.ts` are tested starting points |
| Monogram | `components/ui/Monogram.tsx` |
| Share card | `app/opengraph-image.tsx` |
| Privacy and terms | `app/privacy`, `app/terms` — reviewed for the customer's business |

Delete `app/your-site`, `components/sales`, `content/offer.ts`, `lib/sales*.ts` and `app/api/website-inquiry` from a customer's repository: the offer belongs to this demo only.

## 3. Before launch

- `npm run check` and `npm run test:e2e` green. Update the route lists in `tests/e2e/pages.spec.ts` if pages were added or removed, and the copy-specific assertions in the inquiry tests.
- Lead delivery configured and tested with a real request (see `docs/OPERATIONS.md`).
- `npm run media` shows every priority-1 slot filled.
- Lighthouse on the preview deployment; Speed Insights enabled.
- Domain attached to the customer's project; `NEXT_PUBLIC_SITE_URL` set.

## Components worth knowing

| Component | Notes |
|---|---|
| `Plate` | A photograph slot: `slot`, optional `fallback` (a delivered photo with its own alt), `focus` for crops, caption with a legibility scrim. |
| `PageIntro` | Interior page opener; `children` render under the lead (jump lists). |
| `InquiryClose` | The closing invitation; `title` and `lead` per page. |
| `GalleryGrid` | Justified rows plus lightbox; `count`, `eager` (frames above the fold), `note`. |
| `Composer` | The planner; all rules live in `content/possibilities.ts` (`resolve`, `describe`). |
| `MenuCard` | Tabs plus the printed card. |
| `Concierge` | The conversational request; vocabulary in `lib/inquiry.ts`, server rules in `lib/inquiry-schema.ts`. |
