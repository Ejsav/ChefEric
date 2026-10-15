# Chef Eric Jokl — private chef website template

A luxury private-chef website, shown under a demo persona: **“Chef Eric Jokl”**. It is built to be sold and customized: every customer version carries its own name, story, photography, menus and prices. A notice bar on every page says it is a template and links to the offer at `/your-site`.

The benchmark is luxury hospitality (Aman, Casa Cipriani, private members' clubs), not other chef websites. That means restraint, negative space, editorial typography, and discretion as the trust signal.

> **Separate from the original.** This site lives on the branch `claude/eric-jokl-rebrand-a4wmzc` and deploys as its own Vercel project (`eric-jokl`). The original site on `main` and its live deployment are untouched.

## Art direction

| | |
|---|---|
| **Mood** | A private room at night. One warm light source. Linen, walnut, aged brass. Oxblood appears twice on the whole site. |
| **Display type** | **Bodoni Moda**, the face of Italian luxury printing for two centuries. Italic is used for emphasis, the way a maître d' would underline. |
| **Body type** | **Instrument Sans**, a quiet, tailored modern counterweight. |
| **Palette** | Espresso `#110c09`, walnut `#1b140f`, ivory `#ede5d6`, linen `#f2ece1`, brass `#be9c68` (deep brass `#7a5e34` on linen), oxblood `#6c1e22`. |
| **Mark** | E and J in Bodoni inside a double ring, like a wax seal (`components/ui/Monogram.tsx`). |
| **Rhythm** | Sections alternate dark / linen like the pages of a menu card. Tones are CSS-variable scopes (`.tone-dark`, `.tone-walnut`, `.tone-linen`), so every component works on all of them. |
| **Motion** | Slow, weighted, cinematic easing (`expo.out`, 1.4–1.8s). Lines rise from masks, hairlines draw, the candle glow breathes. Everything respects `prefers-reduced-motion`. |

## The demo, honestly

- The notice bar on every page and the footer say this is a template and that “Chef Eric Jokl” is a demo persona; `/your-site` repeats it in its first line.
- The chef's story (`/chef`) is deliberately free of dates, employers, awards and press.
- Testimonials are labelled **Sample** on the page (`content/voice.ts`, `sample: true`). A customer version replaces them with real, approved words or empties the array to hide the section.
- Prices (`content/experiences.ts` → `from`, and the pricing FAQ) are demo guides.
- The photography is AI-generated from Eric's likeness and the footer says so.

## The system

The site is built as layers, so new ideas plug into the system instead of being bolted onto pages.

### 1. The world (runtime)

| Piece | What it does | Where |
|---|---|---|
| **Capability tiers** | An inline script decides before first paint how much of the experience this device receives: `full`, `lite` (Save-Data, 2G/3G, low memory or CPU) or `still` (reduced motion). Nothing visibly downgrades later. | `lib/boot.ts` |
| **Prelude** | A ~1.6s opening: a brass seal draws, the name rises, a curtain lifts into the hero. Once per session, desktop only, CSS only. | `components/system/Prelude.tsx` |
| **Hero media** | When `hero-still` / `hero-film` exist, they sit behind the name under two legibility scrims. The film plays only on full-tier devices, pauses off screen, and fades in once it is actually playing. | `components/system/HeroMedia.tsx`, `HeroFilm.tsx` |
| **Page transitions** | View Transitions API. The header persists while the old page sinks and the new one rises like a curtain. | `components/system/Transitions.tsx` |
| **Cursor** | A brass point plus a weighted ring that swells over actions, carries a word over things worth opening, and draws `data-magnetic` elements toward it. Fine pointers only. | `components/system/Cursor.tsx` |
| **Responsive light** | The hero's candle leans toward the pointer while the name drifts the other way. On touch, the light settles with scroll. | `components/system/HeroLight.tsx` |
| **Room sound** | Optional fire-in-another-room ambience generated live with Web Audio. Off until asked. | `components/system/Ambience.tsx` |
| **Mobile action bar** | "Request an evening" where the thumb is, inside the safe area. | `components/system/MobileBar.tsx` |

### 2. Possibilities, not packages

**Compose an evening** (`components/sections/Composer.tsx`, `content/possibilities.ts`). The visitor sets the room (a private home, a Manhattan penthouse, a Hamptons estate, a Florida waterfront, a yacht, a private island, a hangar, abroad), the reason (including *a class*) and the scale, then reads the evening written in front of them. The composition carries straight into the inquiry.

### 3. The chef

- **The Chef** on the home page (`components/sections/ChefIntro.tsx`): the portrait beside the story and a ledger (cuisine, service, base, table size, the rule).
- **The Story** (`components/sections/Archive.tsx`, `content/archive.ts`): six chapters — the family table, the line, the private rooms, the water, the lessons, now — each with *what it taught him*. Pinned horizontal travel on desktop; vertical on phones.
- **The Standards** (`components/sections/Standards.tsx`): how he works, in five sentences.

### 4. The four forms

`content/experiences.ts`: **The Private Table** · **The Island & The Water** · **The Kitchen Lessons** (private cooking classes) · **The Occasion**.

### 5. The inquiry

`components/inquiry/Concierge.tsx` is a conversation, not a form. One question at a time, branching on the answers: planners are asked about *their client*, yachts about the galley, islands about the length of stay, and collaborations skip the dinner questions (6 steps instead of 11). Letter keys choose, Enter continues, drafts are kept for 14 days, and the request is read back as a sentence before sending.

On the server (`app/api/inquire/route.ts`, `lib/inquiry-schema.ts`) every request is validated with the same rules, given a reference (`EJ-XXXXXX`), tagged with where the visitor came from, and emailed via Resend — or logged when email is not configured.

### 6. Infrastructure

- **Attribution** (`lib/attribution.ts`): first touch (30 days) and this visit's touch travel with each inquiry.
- **Analytics** (`lib/analytics.ts`): one `track()` fanning out to Vercel Analytics, Plausible or a GTM `dataLayer`. No personal data.
- **Private invitations** (`app/invite/[token]`, `lib/invite.ts`): HMAC-signed links that greet a guest by name, expire on their own, and are never indexed.

  ```bash
  INVITE_SECRET=... node scripts/invite.mjs "Mr. and Mrs. Whitman" --note "For the anniversary in June." --days 30 --setting yacht
  ```
- **SEO**: Person and ProfessionalService JSON-LD (no culinary credentials), BreadcrumbList, FAQPage on destination and Questions pages, canonical URLs, sitemap, robots rules excluding `/api` and `/invite`, and a generated share card that uses the portrait once it exists.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero → premise → the four experiences (cards with price guides) → the menus with signature dishes → the chef → gallery → how an evening is made → testimonials → discretion → plan your evening → close |
| `/experiences` | The four experiences in full (guide, scale, notice, included), then the planner |
| `/menus` | Four sample menus as printed cards with a dish photograph each, then market → pass → served |
| `/chef` | The story (six chapters), the standards, discretion |
| `/gallery` | Twelve photographs in an editorial masonry |
| `/your-site` | The template offer: type-your-name preview, what is customized, hosting price, how it works, questions |
| `/private-dining` and `/private-dining/[place]` | Connecticut, New York City, the Hamptons, Florida, yachts and private islands, each with unique copy, FAQ data and a pre-filled inquiry |
| `/questions` | Booking, the chef, the evening, travel, salons, discretion |
| `/inquire` | The conversational request, including the gift path |
| `/invite/[token]` | Signed private invitations (never indexed) |
| `/privacy` | Plain-language privacy notice |

## Imagery

Every image slot is a `Plate` with a `slot` id. To place an asset, export it as `public/media/<slot>.jpg` (or `.avif`/`.webp`/`.png`; films `.webm` + `.mp4`). `next.config.ts` lists that folder at build time, so a filled slot renders the asset through `next/image` and an empty one keeps its lit, grained tonal study. No code changes.

```bash
npm run media   # which of the 40 slots are filled
```

Slots, briefs and prompts: `content/media.ts`. Method, identity lock, quality gate and export specs: `docs/AI_IMAGERY.md`.

## Quality gates

```bash
npm run type-check   # TypeScript
npm run lint         # ESLint (next/core-web-vitals)
npm run build
npm run test:e2e     # Playwright: 39 checks across desktop and phone
```

The end-to-end suite checks that every route renders with one `<h1>`, a canonical URL, no horizontal overflow, no console errors and **no trace of the site this one was built from**; that the composer hands off to the inquiry; the planner-and-yacht branch through to an `EJ-` reference; the collaboration and gift paths; API validation; and valid, expired and tampered invitations. CI (`.github/workflows/ci.yml`) runs all of it on every push.

## Run

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL; Resend keys optional
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Deploy

Its own Vercel project, separate from the original site's:

1. In Vercel, **Add New → Project**, import `Ejsav/ChefEric`, and name it (for example `eric-jokl`).
2. **Settings → Git → Production Branch:** `claude/eric-jokl-rebrand-a4wmzc`.
3. Environment variables: `NEXT_PUBLIC_SITE_URL`, `INVITE_SECRET`, `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`, optional `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

The original project keeps `main` as its production branch, so its live site never changes because of this branch. (Pushes here may also produce a *preview* deployment in the original project if it builds every branch; previews never replace production. To stop them, set **Ignored Build Step** there to skip this branch.)

## Launch checklist

The essentials:

- [ ] Monthly price confirmed in `lib/site.ts` → `offer.monthly`
- [ ] Inquiry email delivery (Resend) set, so `/your-site` requests reach you
- [ ] Priority-1 imagery: `portrait`, the four `exp-*` and the four `menu-*` frames
- [ ] Domain, inbox, Resend and `INVITE_SECRET` set in the new Vercel project
- [ ] Re-run Lighthouse on the deployed URL once the imagery is in
