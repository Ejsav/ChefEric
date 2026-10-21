# Chef Eric Jokl — private chef website template

A luxury private-chef website, shown live under a demo persona: **“Chef Eric Jokl”**. It is two things at once:

1. **A showcase.** The chef pages are the product a customer buys: editorial design, sample menus, an evening planner, a gallery, a request flow that reads like a reservation book.
2. **A business.** `/your-site` sells it: what a customer gets, what it costs, what is included and what is not, and a real request form that reaches Eric.

The benchmark is luxury hospitality (Aman, Casa Cipriani, private members' clubs), not other chef websites: restraint, negative space, editorial type, and discretion as the trust signal.

> **Repository boundary.** This repository is only the Chef Eric Jokl template. A separate client project lives in its own repository (`Ejsav/Chef`) with its own Vercel project, and nothing moves between the two. `npm run guard` fails CI on any trace of it; `CLAUDE.md` holds the rules for anyone, human or AI, working here. See [Deploy](#deploy).

## The demo, honestly

One switch, `site.demo` in `lib/site.ts`, controls everything that differs between the demo and a customer's site.

| While `demo: true` | |
|---|---|
| **Notice bar** | One quiet line on every page: *Live demo · Chef Eric Jokl is a fictional persona · Get this website*. |
| **Colophon** | Every demo page closes with *You are looking at a template*, the price and **Get this website** (`components/layout/Colophon.tsx`). |
| **Chef request** | `/inquire` says it is a demonstration. The server validates the answers, then discards them: nothing is stored, logged or emailed. The visitor sees the exact email a chef using the site would receive. |
| **Search** | Persona pages are `noindex, follow`; the sitemap lists only `/`, `/your-site`, `/your-site/start`, `/terms`, `/privacy`. Structured data describes a *website* made by Eric Jokl, never a chef business (`lib/seo.ts`, `components/seo/JsonLd.tsx`). |
| **Content** | No credentials, employers, awards, press or past clients. Testimonials carry *Sample* on every card and an explanation above them. Prices are labelled guides. The photography is AI-generated from Eric's likeness and says so. |

A customer version sets `demo: false`: the notice and colophon disappear, the chef request is delivered, every page is indexed, and structured data describes the chef's business.

## What is for sale (`/your-site`)

Every figure and term lives in **`content/offer.ts`** and is read by `/your-site`, the request form, `/terms`, the notice bar, the share card and structured data.

- **Price:** $500 setup, then $50 a month, no minimum term. *(CONFIRM before launch: see the checklist.)*
- **Included / setup / quoted:** a line-by-line table (hosting, domain, inquiry form, images, copy, edits, maintenance, analytics, support, new features, redesign) with ownership spelled out.
- **Terms in plain words:** billing, payment (no payment is taken on the site), cancellation, ownership, leaving with your content, domain ownership.
- **Make it yours:** a live studio where a visitor types a name, title and place and picks a palette; three labelled illustrations show the same site for invented chefs.
- **Who builds it:** Eric, with verifiable claims about the build instead of invented logos.

## The system

| Piece | What it does | Where |
|---|---|---|
| **Brand and copy** | Brand facts, home-page copy, the offer, menus, experiences, places, FAQs and media manifest are data, not markup. | `lib/site.ts`, `content/*.ts` |
| **Capability tiers** | An inline script decides before first paint how much motion a device gets: `full`, `lite` (Save-Data, slow network, low memory) or `still` (reduced motion). | `lib/boot.ts` |
| **Hero** | Eric's figure is one image (in the flow on phones, beside the name from tablet up), so it is preloaded once. Optional still/film behind it. | `components/sections/Hero.tsx`, `HeroMedia.tsx` |
| **Planner** | Room × reason × table. Rules in `content/possibilities.ts` move impossible evenings (a class in a galley, eighty at anchor, two in a hangar) to the nearest possible one and say why. The plan lives in the address (`?room=&reason=&table=`), can be copied, and carries into the request. All 2,074 transitions are checked. | `components/sections/Composer.tsx` |
| **Menus** | Printed cards with tabs (arrow keys, Home/End), allergens and dietary adaptations. | `components/sections/MenuCard.tsx`, `content/menus.ts` |
| **Gallery** | One evening in sequence. Justified rows keep every photograph at its true shape; a modal lightbox steps with arrows, swipe, Home/End, closes on Escape and returns focus. | `components/sections/Gallery.tsx`, `content/gallery.ts` |
| **Chef request** | One question at a time, branching on the answers; class-sized guest counts for classes; drafts kept 14 days; duplicate-proof sending. | `components/inquiry/Concierge.tsx`, `lib/inquiry.ts`, `app/api/inquire` |
| **Website request** | Name, email, business, current site, what you do, design, features, launch, budget, notes. Inline errors plus a focused summary, saved draft, honeypot, timing and link screening, rate limits, one id per submission. | `components/sales/SalesForm.tsx`, `lib/sales*.ts`, `app/api/website-inquiry` |
| **Lead delivery** | Each lead fans out to email (Resend, with an idempotency key) and/or a CRM webhook (signed). The visitor sees *received* only when a channel accepted it; on a Vercel production deploy with no channel configured the request fails loudly instead of disappearing. The writer gets an acknowledgment. | `lib/leads.ts` |
| **Analytics** | One `track()` to Vercel Analytics, Plausible or a `dataLayer`; no personal data. Tracked: CTA clicks (`data-track`), menu views, planner changes and shares, gallery opens and steps, studio use, form start, errors and submissions, page errors. | `lib/analytics.ts`, `components/system/Telemetry.tsx` |
| **Security** | CSP (same-origin plus the analytics collectors), HSTS, frame, referrer, opener and permissions policies; APIs `no-store` and `noindex`; server-side zod validation with control-character stripping. | `next.config.ts`, `lib/*-schema.ts` |
| **Sound** | The header's *Sound* button plays an Italian kitchen soundtrack (`public/audio/kitchen-music.mp3`, set in `site.ambience`, mastered quiet at about -22 LUFS). Off until clicked and not downloaded before; a plain audio element started inside the tap (so iPhones play it even on silent), one shared player that fades where the browser allows, keeps playing across pages and pauses while the tab is hidden. | `components/system/Ambience.tsx` |
| **Cursor** | A miniature champagne-gold dining fork is the pointer everywhere a mouse or pen is used: tines to the upper left as the hotspot, handle to the lower right. It is the browser's own cursor (PNG at 1x, 2x and 3x through `image-set`), so it never lags. Over anything clickable it polishes brighter with a glint; pressed, it foreshortens into the plate and leaves four tine marks and a ring (not with reduced motion). Over photographs it carries a *View* label. Typing fields keep the I-beam and resize grip, disabled controls show *not allowed*, busy buttons *progress*, drag-selecting text the text cursor. Touch, high-contrast and forced-colours settings keep the system cursor. Artwork is drawn as vector geometry in `scripts/cursor.mjs` (`npm run cursor:build`). | `app/globals.css`, `components/system/Cursor.tsx`, `public/cursor/` |
| **Invitations** | HMAC-signed links that greet a guest by name and expire. Never indexed. | `app/invite/[token]`, `lib/invite.ts`, `scripts/invite.mjs` |

## Pages

| Route | Purpose | Indexed while demo |
|---|---|---|
| `/` | Hero → premise → experiences → menus → the chef → gallery → how an evening works → sample testimonials → discretion → planner → close → colophon | Yes (as a website demo) |
| `/experiences` | Four experiences: included, what the venue needs, guide price vs. firm quote, guests, notice | No |
| `/menus` | Four sample menus with allergens and adaptations, how a menu is made | No |
| `/chef` | Six chapters of the craft and the rules of the house (no invented history) | No |
| `/gallery` | One evening in eight frames, with lightbox | No |
| `/private-dining`, `/private-dining/[place]` | Six places, each with its own logistics and questions | No |
| `/questions` | Cost, deposits, cancellation, guests, staffing, diets, travel, planning, privacy | No |
| `/inquire` | The chef request (a demonstration) | No |
| `/your-site` | The offer | Yes |
| `/your-site/start` | The website request form | Yes |
| `/terms`, `/privacy` | Plain-language terms and privacy notice matching what the site actually does | Yes |

## Imagery

Every image slot has an id (`content/media.ts`). Export an asset as `public/media/<slot>.jpg` (or `.avif`/`.webp`/`.png`; films `.webm` + `.mp4`) and the next build places it through `next/image` (AVIF/WebP, sized per screen). A slot can name a delivered **fallback** photograph with its own alt text, so an unshot frame never shows a placeholder.

```bash
npm run media         # which slots are filled
npm run media:guide   # regenerate docs/PHOTOGRAPHY_GUIDE.md after editing the manifest
```

| Document | For |
|---|---|
| `docs/PHOTOGRAPHY_GUIDE.md` | The shoot brief a client's photographer works from. Generated; CI fails if stale. |
| `docs/DEMO_IMAGES.md` | Which demo image sits in which slot, and what is still to create. |
| `docs/AI_IMAGERY.md` | How the demo imagery is generated from Eric's likeness. |
| `docs/CUSTOMIZING.md` | Turning the template into a customer's site, safely. |
| `docs/OPERATIONS.md` | Lead routing, monitoring, rate limits, backups, staging and recovery. |
| `docs/QA.md` | What is tested automatically, measured results, and the manual pass before launch. |

## Quality gates

```bash
npm run check        # guard, type-check, lint, build
npm run test:e2e     # Playwright: 162 checks
```

The end-to-end suite runs every route at **1440px, a phone, 320px and a 1024px tablet**: one `<h1>`, canonical and description, no horizontal overflow, no console errors, no production tooling or client traces in the HTML; **axe WCAG 2.2 AA** on every route (desktop and phone); every internal link resolves; security headers; noindex and sitemap rules; structured data never presenting the persona as a business; the planner's rules, shared links and keyboard; the lightbox's keyboard, Escape and focus return; menu tabs; the chef request (demo notice, yacht branch, class sizes, read-back, inbox preview, API validation); the website request (validation summary, delivery with reference, studio hand-off, server validation, duplicate protection, honeypot, rate limiting); invitations; the fork cursor (artwork sizes and hotspot calibration at 1x/2x/3x, rest/hover/press/system states, tine marks, reduced motion, the photo label's position, text selection, edge clicks, touch and high contrast). CI (`.github/workflows/ci.yml`) also audits production dependencies.

## Run

```bash
npm install
cp .env.example .env.local   # optional locally: leads print to the console without a channel
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Deploy

This repository deploys to **one** Vercel project, `eric-jokl`, and `chef.ericjokl.com` points at it.

| Vercel project | Git repository | Domains |
|---|---|---|
| `eric-jokl` | `Ejsav/ChefEric` | `chef.ericjokl.com`, `eric-jokl.vercel.app` |
| the client's project | `Ejsav/Chef` only | the client's own |

To get there from the October 2026 state (where the client's project was still connected to this repository and held `chef.ericjokl.com`):

1. **Free the domain.** Client project → *Settings → Domains* → remove `chef.ericjokl.com`.
2. **Attach it here.** `eric-jokl` → *Settings → Domains* → add `chef.ericjokl.com`.
3. **Disconnect this repository from the client project.** Client project → *Settings → Git* → disconnect `Ejsav/ChefEric` and connect `Ejsav/Chef`, then promote the client's last good deployment.
4. **Point production here at `main`.** `eric-jokl` → *Settings → Git → Production Branch:* `main`. Every other branch gets a preview deployment, which is the staging environment.
5. **Environment variables on `eric-jokl`** (see `.env.example`): `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL`, optionally `LEADS_WEBHOOK_URL` + `LEADS_WEBHOOK_SECRET`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_BOOKING_URL`, `INVITE_SECRET`.

Do step 3 before merging anything to `main`: until then, a merge here would redeploy the client's live site.

## Launch checklist

- [ ] **Confirm the offer** in `content/offer.ts`: setup fee, monthly price, edits per month, images at setup, support reply time, launch time, cancellation notice, export days, budget bands. They are proposed, not decided.
- [ ] **Confirm the terms and privacy notice** (`app/terms`, `app/privacy`) with counsel, including retention periods.
- [ ] **Lead delivery live:** `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL` on `eric-jokl` (sender domain verified in Resend). Without them, the website form on production answers *could not be delivered* by design. Send one real test request and confirm both the lead and the acknowledgment arrive.
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set, so failure messages and the footer offer a direct address.
- [ ] `NEXT_PUBLIC_BUILDER_URL` confirmed (defaults to `https://ericjokl.com`).
- [ ] Vercel Firewall rate-limit rule on `/api/*` (see `docs/OPERATIONS.md`).
- [ ] **Music licence:** confirm `public/audio/kitchen-music.mp3` may be used on a commercial site (or replace it with a licensed track of the same name).
- [ ] Remaining imagery: `room-penthouse`, `room-yacht` (both currently stand in with a delivered frame), and optional gallery and food frames.
- [ ] After deploy: Speed Insights shows field LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at p75 once traffic accrues.
