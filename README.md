# Eric Jokl — Private Evenings

A luxury hospitality concept under Eric Jokl's name: private evenings designed, directed and hosted by a builder of digital systems and experiences. The room, the light, the sound, the pace and the story are his; the kitchen belongs to a chef chosen for each table.

It is also a creative showcase. Every photograph and film slot is prepared for AI-generated imagery made from Eric's own likeness (`docs/AI_IMAGERY.md`), and the footer says so.

The benchmark is luxury hospitality (Aman, Casa Cipriani, private members' clubs), not event-company websites. That means restraint, negative space, editorial typography, and discretion as the trust signal. No logo walls, no star ratings, no stock photography, no invented proof.

> **Separate from the original.** This site lives on the branch `claude/eric-jokl-rebrand-a4wmzc` and deploys as its own Vercel project. The original site on `main` and its live deployment are untouched by this branch.

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

## The concept, honestly

- Eric **designs, directs and hosts**. He never claims to cook. Every page that touches food says the kitchen is led by a chef chosen for the table.
- His story (`/eric`, *The Making*) is told through what he actually does: code, brands, conversion and experience design. No dates, employers, clients or numbers are claimed.
- Quotes, testimonials, credentials and press (`content/voice.ts`) start empty and appear only once real.
- Sample menus are labelled as samples.
- Guests are never shown or named. Eric builds in public; client evenings are never part of it without written consent.
- The imagery is disclosed in the footer (`site.imageryNote`).

Everything marked `CONFIRM` in the code, and every promise listed in `docs/ERIC_VOICE.md`, must be true before taking a booking.

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

**Compose an evening** (`components/sections/Composer.tsx`, `content/possibilities.ts`). The visitor sets the room (a private home, a Manhattan penthouse, a Hamptons estate, a Florida waterfront, a yacht, a private island, a hangar, abroad), the reason (including *a founders' table*) and the scale, then reads the evening written in front of them. The composition carries straight into the inquiry.

### 3. The man

- **The Host** on the home page (`components/sections/HostIntro.tsx`): the portrait, a ledger of what he does, and the line that the kitchen belongs to a chef.
- **The Making** (`components/sections/Archive.tsx`, `content/archive.ts`): six chapters — the screen, the pressure, the attention, the room, the table, now — each with *what it taught him*. Pinned horizontal travel on desktop; vertical on phones.
- **The Standards** (`components/sections/Standards.tsx`): how he works, in five sentences.

### 4. The four forms

`content/experiences.ts`: **The Private Table** · **The Island & The Water** · **The Founders' Table** (a dinner designed around a conversation, closest to Eric's own world) · **The Occasion**.

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
| `/` | Hero, premise, Compose an evening, The Table (sample menus), The Host, the Evening, Discretion, close |
| `/experiences` | Composer plus the four forms |
| `/menus` | Four sample menus as printed cards |
| `/eric` | The Making (six chapters) and The Standards |
| `/private-dining` and `/private-dining/[place]` | Connecticut, New York City, the Hamptons, Florida, yachts and private islands, each with unique copy, FAQ data and a pre-filled inquiry |
| `/questions` | Booking, the chef, the evening, travel, salons, discretion |
| `/inquire` | The conversational request, including the gift path |
| `/invite/[token]` | Signed private invitations (never indexed) |
| `/privacy` | Plain-language privacy notice |

## Imagery

Every image slot is a `Plate` with a `slot` id. To place an asset, export it as `public/media/<slot>.jpg` (or `.avif`/`.webp`/`.png`; films `.webm` + `.mp4`). `next.config.ts` lists that folder at build time, so a filled slot renders the asset through `next/image` and an empty one keeps its lit, grained tonal study. No code changes.

```bash
npm run media   # which of the 28 slots are filled
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

See `docs/ERIC_VOICE.md`. The essentials:

- [ ] Chef partners in place for every form the site offers
- [ ] Every `CONFIRM` in `lib/site.ts`, `content/*.ts` and `app/privacy/page.tsx`
- [ ] Priority-1 imagery: `hero-still`, `portrait`, and the four `exp-*` frames
- [ ] Domain, inbox, Resend and `INVITE_SECRET` set in the new Vercel project
- [ ] Re-run Lighthouse on the deployed URL once the imagery is in
