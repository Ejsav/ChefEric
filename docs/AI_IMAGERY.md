# AI imagery — production kit

This site is a creative showcase. Every photograph and film on it is AI-generated from Eric Jokl's own likeness, and the footer says so. The goal is imagery that reads as a real editorial shoot: one person, one light, one wardrobe system, one series.

The single source of truth for slots, briefs and prompts is `content/media.ts`. This document is the method.

---

## 1. How an asset reaches the site

1. Generate, retouch and export the asset (sections 3–6).
2. Name the file after its slot: `public/media/<slot>.jpg` (or `.avif`, `.webp`, `.png`; films `.webm` and `.mp4`).
3. Run `npm run media` to see which slots are filled.
4. Commit and push. The next build picks it up; nothing else changes.

A slot with no file keeps rendering its lit, grained tonal study, so the site is complete at every stage. `next/image` serves AVIF/WebP in responsive sizes automatically. The hero film only plays on full-capability devices; slow connections, Save-Data and reduced-motion visitors get the still. The share card (`/opengraph-image`) uses `portrait.jpg` or `portrait.png` automatically.

---

## 2. Rules that do not bend

| Rule | Why |
|---|---|
| **One identity.** Same face, hairline, build, skin and grooming in every frame. | A single drifting jawline breaks the illusion for the whole site. |
| **Nothing implies Eric cooks.** No stove, no plating by Eric. He hosts, directs, lights, pours, welcomes. Food shots show the chef's or a guest's hands, never his. | The site makes no culinary claims. The kitchen belongs to a chef chosen for each table. |
| **Food at table height.** Never overhead flat-lay; ivory china, linen or dark wood, one warm light, shallow depth of field. | Food should look like a moment at the table, not a menu photo. |
| **Guests are never identifiable.** Backs, hands, out-of-focus shoulders only. | The brand promise is discretion, and generated strangers' faces read as fake. |
| **No invented proof.** No press logos, awards, recognisable venues or real people. | Never let the image become louder than the proof. |
| **Disclosure stays on.** `site.imageryNote` in `lib/site.ts` renders in the footer. | Honesty is the standard, and it protects the brand when the work is shared. |

---

## 3. The identity lock

Consistency comes from the reference set, not the prompt.

**Reference set (shoot once, reuse forever).** 20–30 phone or camera photos in soft daylight, no filters, no sunglasses, neutral expression plus a few slight smiles:
- face straight on, three-quarter left, three-quarter right, both profiles
- head and shoulders from slightly above and slightly below
- waist-up and full length, standing and seated
- hands, front and back, with the watch you will wear in the series
- the current haircut and beard state; reshoot the set if either changes

**Train or register the identity** in the tool you use: a character/Soul ID, a personal LoRA, or an image-reference model with face lock. Then:
- generate every image with the identity attached; never "describe" Eric in words alone
- prepend `identityLock` (from `content/media.ts`) to every prompt that contains him
- append `look`, and pass `negative` as the negative prompt where the tool supports it
- lock a seed per wardrobe setup once a frame is right, and vary only the scene

**Wardrobe system** (in `content/media.ts`): A suit, black shirt open at the collar · B black fine-gauge knit · C white shirt, sleeves rolled · D long black overcoat. One watch across all of them.

**Light.** One warm practical key (candle, pendant or window at blue hour) with deep falloff. Never flash, never overhead, never flat. The palette is espresso, walnut, ivory linen, aged brass.

---

## 4. Prompt anatomy

```
[identityLock] + [slot prompt] + [wardrobe X] + [look]
negative: [negative]
```

Example (`portrait`):

> Photorealistic editorial photograph of Eric Jokl, exactly matching the reference images: identical facial structure… **Waist-up portrait of Eric seated in a dark walnut-panelled private dining room, body angled three-quarters, face turned toward a single warm key light from camera left, eyes just off camera, calm and intense, a glass of red wine untouched on the table edge; background falls to black with two out-of-focus candle highlights.** Wearing black tailored two-button suit, black shirt open at the collar… Cinematic low-key lighting from a single warm practical source…

Generate 8–16 candidates per slot, pick one, then refine with inpainting rather than regenerating.

---

## 5. Quality gate (every image, before it ships)

- [ ] Side by side with the reference set, a friend would say "that's Eric" without hesitating
- [ ] Eyes: matching catchlights, same iris colour, no drift; teeth natural if visible
- [ ] Hands: five fingers, natural knuckles and nails; the watch is the same watch
- [ ] Ears, hairline and beard line match the reference
- [ ] Light direction is consistent with every practical source in the frame
- [ ] Glassware, cutlery, chairs and candles are physically correct; no melted geometry
- [ ] No text, signage, logos or gibberish anywhere (check menu cards and screens)
- [ ] No identifiable guest faces
- [ ] Skin has pores and texture; nothing waxy or airbrushed
- [ ] It sits with the rest of the series: same grade, same grain, same palette

If any box fails, inpaint or regenerate. Never ship a "good enough" face.

---

## 6. Export specs

| | Stills | Hero film |
|---|---|---|
| Size | 4:5 at 2400×3000; 16:9 at 3840×2160; 16:11 at 2400×1650 | 1920×1080, 10–15 s, seamless loop |
| Format | JPEG quality 85 (or AVIF), sRGB | WebM (VP9) **and** MP4 (H.264), no audio |
| Weight | Under 1.5 MB source; the site re-encodes | Under 2 MB each |
| Metadata | Strip EXIF and location | — |
| Poster | — | First frame as `hero-film-poster.jpg` |

Upscale before export if the tool's native output is smaller. Add a whisper of grain after upscaling so every frame shares the same texture.

---

## 7. Every slot

Priority 1 is launch-critical (the hero, the portrait, the experiences and the four signature dishes). Priority 2 completes the story. Priority 3 is the long tail.

| P | Slot (file name) | Where | Ratio | Likeness | Wardrobe | Brief |
|---|---|---|---|---|---|---|
| 1 | `hero-still.jpg` | Home hero (behind the name) | 16:9, 3840×2160, subject in the right third | eric | A | The opening frame. Eric at the head of a candlelit table, the room around him in darkness. Negative space on the left for the name. |
| 1 | `hero-figure.webp (transparent)` | Home hero (Eric standing right of the name) | 2:3 transparent cutout (PNG/WebP with alpha), 1024×1536 or larger, cut at the waist or below | eric | — | Eric as a cutout figure standing in the candlelit hero. Supplied by Eric: the first image on the site. Graded warm and faded into the floor by the hero itself. |
| 1 | `portrait.jpg` | Home — The Host section; right half of the share card | 4:5, 2400×3000 | eric | A | The most important image on the site. A portrait with presence: one key light from the left, looking just off camera, controlled intensity. |
| 1 | `exp-private-table.jpg` | Experiences I · The Private Table | 4:5 | eric | C | Before the guests: Eric lighting the last candle on a fully set table in a private home. |
| 1 | `exp-island-water.jpg` | Experiences II · The Island & The Water | 4:5 | eric | B | Late service on open water: Eric walking a lantern-lit dock toward a table at the water's edge at dusk. |
| 1 | `exp-founders-table.jpg` | Experiences III · The Founders' Table | 4:5 | eric | B | A long table mid-conversation. Eric at the head, listening; guests only as shoulders, hands and backs, out of focus. |
| 1 | `menu-after-midnight.jpg` | Home + /menus · beside the menu card “After midnight” | 4:5 (also shown 16:11 on phones; keep the dish centred) | none | — | The late pasta: one perfect bowl at one in the morning. |
| 1 | `menu-late-summer-outdoors.jpg` | Home + /menus · beside “Late summer, outdoors” | 4:5 (dish centred) | none | — | Heirloom tomatoes and burrata outdoors at golden hour. |
| 1 | `menu-a-night-aboard.jpg` | Home + /menus · beside “A night aboard” | 4:5 (dish centred) | none | — | Oysters on deck at sunset. |
| 1 | `menu-a-winter-table.jpg` | Home + /menus · beside “A winter table” | 4:5 (dish centred) | none | — | Osso buco by firelight. |
| 2 | `hero-film.webm + .mp4` | Home hero (replaces the still on capable devices) | 16:9, 1920×1080, 10–15s seamless loop, silent, under 2 MB WebM + MP4 | eric | A | A breathing photograph: candle flames move, Eric's head turns slightly toward the table, smoke from a snuffed match drifts. No cuts, no camera move beyond a slow 2% push. |
| 2 | `hero-film-poster.jpg` | First frame of the hero film | 16:9, same as hero-film | eric | A | Export the first frame of hero-film so the loop starts without a jump. |
| 2 | `exp-occasion.jpg` | Experiences IV · The Occasion | 4:5 | eric | A | Toasts, third course. Glasses raised over a long table; Eric standing, mid-toast; motion blur allowed on the glasses. |
| 2 | `food-market.jpg` | /menus · How your menu is made (1 of 3) | 4:5 | none | — | The market, that morning: the chef's hands choosing produce. Hands and forearms only. |
| 2 | `food-pass.jpg` | /menus · How your menu is made (2 of 3) | 4:5 | none | — | The pass: the chef's hands finishing a plate. Hands only, not Eric. |
| 2 | `food-table.jpg` | /menus · How your menu is made (3 of 3) | 4:5 | none | — | Served: the plate arriving at the table, a guest's hand on a glass. |
| 2 | `era-screen.jpg` | /eric · I. The screen | 4:5 | eric | B | Where it started: Eric at a desk at night, face lit by a monitor, the city dark beyond the window. |
| 2 | `era-crossover.jpg` | /eric · IV. The room | 4:5 | eric | C | From screens to rooms: Eric adjusting a brass pendant over an empty table in a private dining room. |
| 2 | `era-table.jpg` | /eric · V. The table | 4:5 | hands | — | Hands only: Eric placing a printed menu card at a place setting. |
| 2 | `era-now.jpg` | /eric · VI. Now | 4:5 | eric | A | Wherever the table is: Eric at a doorway, a set table glowing in the room behind him. |
| 2 | `room-residence.jpg` | Composer · A private home | 16:11 | none | — | A private dining room after dark, table set, no people. |
| 2 | `room-penthouse.jpg` | Composer · A Manhattan penthouse | 16:11 | eric | A | Eric at a floor-to-ceiling window above the avenue, table set behind him. |
| 2 | `room-yacht.jpg` | Composer · Aboard a yacht | 16:11 | eric | B | Aft deck, second course; Eric pouring wine, guests as blurred shoulders. |
| 3 | `era-pressure.jpg` | /eric · II. The pressure | 4:5 | eric | D | Motion, not posing: Eric crossing a wet city street at night, collar up. |
| 3 | `era-conversion.jpg` | /eric · III. The attention | 4:5 | eric | C | The study of attention: Eric in front of a wall of printed layouts and sketches, pen in hand. |
| 3 | `room-estate.jpg` | Composer · A Hamptons estate | 16:11 | none | — | A long table on an estate lawn at golden hour, hedges and ocean haze beyond. |
| 3 | `room-waterfront.jpg` | Composer · A waterfront home in Florida | 16:11 | none | — | Doors open to the bay at blue hour. |
| 3 | `room-island.jpg` | Composer · On a private island | 16:11 | none | — | Lanterns along a dock leading to a single table. |
| 3 | `room-hangar.jpg` | Composer · In a private hangar | 16:11 | none | — | A long table under a private jet's wing, dramatic and clean. |
| 3 | `room-abroad.jpg` | Composer · Somewhere abroad | 16:11 | none | — | A villa terrace elsewhere, stone and cypress. |
| 3 | `place-connecticut.jpg` | /private-dining/connecticut | 4:5 | eric | B | A country-house dining room, Eric checking the table. |
| 3 | `place-new-york-city.jpg` | /private-dining/new-york-city | 4:5 | eric | A | Above the avenue. |
| 3 | `place-the-hamptons.jpg` | /private-dining/the-hamptons | 4:5 | none | — | Long table, late August. |
| 3 | `place-florida.jpg` | /private-dining/florida | 4:5 | none | — | Doors open to the bay. |
| 3 | `place-yachts.jpg` | /private-dining/yachts | 4:5 | eric | B | Anchored, second course. |
| 3 | `place-private-islands.jpg` | /private-dining/private-islands | 4:5 | none | — | Lanterns along the dock. |

The full prompt for each slot is in `content/media.ts`.

---

## 8. Shoot order

1. **Day one:** the reference set, then `portrait`, `hero-still` and the four `exp-*` images. Once those six are live, the site looks finished.
2. **Day two:** `hero-film` (image-to-video from `hero-still`), the six `era-*` chapters, `room-penthouse` and `room-yacht`.
3. **Then:** the remaining rooms and destination pages, at the pace content allows.

Every finished slot is also content: the before (tonal study) and after (finished frame), the prompt, and what was fixed in retouch. That is a *Built From Nothing* episode.
