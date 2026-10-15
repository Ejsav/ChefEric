# AI imagery — production kit

This site is a template demo. Its photography is AI-generated from Eric Jokl's own likeness, playing the demo persona "Chef Eric Jokl"; the notice bar and the footer say so. The goal is imagery that reads as a real editorial shoot: one person, one light, one wardrobe system, one series.

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
| **In the demo, Eric is the chef.** Chef jackets, the pass, the grill and plating are all in scope. | The notice bar on every page discloses the demo persona. |
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

**Wardrobe system** (in `content/media.ts`): A black chef jacket · B white chef jacket (as in `hero-figure`) · C dark suit for greeting guests · D white shirt and linen apron for classes.

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

Priority 1 is launch-critical (the hero, the portrait, the four experiences and the four signature dishes). Location pages reuse the room photographs, so one shoot covers both. Priority 2 completes the story. Priority 3 is the long tail.

| P | Slot (file name) | Where | Ratio | Likeness | Wardrobe | Brief |
|---|---|---|---|---|---|---|
| 1 | `hero-figure.webp (transparent)` | Home hero — Eric standing right of the name (on phones, above it) | 2:3 transparent cutout, 1024×1536+ | eric | B | Supplied by Eric and live. Three-quarter length, hands in pockets, looking into camera, transparent background. |
| 1 | `portrait.jpg` | Home — The Chef section (beside the story); right half of the share card | 4:5, 2400×3000 | eric | A | The most important image after the hero. Waist-up in a black chef jacket, arms folded, in a dark kitchen; one warm key light from the left. |
| 1 | `exp-private-table.jpg` | Home experience card I + /experiences · The Private Table | 4:5 | eric | B | Eric plating the first course in a private home kitchen, the candlelit dining room glowing through the doorway behind. |
| 1 | `exp-island-water.jpg` | Home experience card II + /experiences · The Island & The Water | 4:5 | eric | A | Eric at a live-fire grill on a private island beach at dusk; lanterns line the dock, a table set at the water's edge. |
| 1 | `exp-kitchen-lessons.jpg` | Home experience card III + /experiences · The Kitchen Lessons | 4:5 | eric | D | Eric guiding a guest's hands as they shape fresh pasta at a marble counter. Guest's face out of frame. |
| 1 | `exp-occasion.jpg` | Home experience card IV + /experiences · The Occasion | 4:5 | eric | A | A long celebration table mid-toast, glasses raised and blurred in the foreground; Eric at the pass in the background. |
| 1 | `menu-after-midnight.jpg` | Beside the menu card “After midnight” | 4:5 (phones crop to 16:11 — keep the dish centred) | none | — | The late pasta: one perfect bowl at one in the morning. |
| 1 | `menu-late-summer-outdoors.jpg` | Beside the menu card “Late summer, outdoors” | 4:5 (dish centred) | none | — | Heirloom tomatoes and burrata outdoors at golden hour. |
| 1 | `menu-a-night-aboard.jpg` | Beside the menu card “A night aboard” | 4:5 (dish centred) | none | — | Oysters on deck at sunset. |
| 1 | `menu-a-winter-table.jpg` | Beside the menu card “A winter table” | 4:5 (dish centred) | none | — | Osso buco by firelight. |
| 2 | `gallery-01.jpg` | Gallery 1 (home + /gallery) | 4:5 | none | — | Crudo, close: raw fish, blood orange, fennel on a dark plate. |
| 2 | `gallery-02.jpg` | Gallery 2 (home + /gallery) | 4:3 landscape | none | — | Before the guests: a long table set by candlelight, empty room. |
| 2 | `gallery-03.jpg` | Gallery 3 (home + /gallery) | 3:4 | eric | B | Eric at the pass, wiping the rim of a plate, heat lamps glowing. |
| 2 | `gallery-04.jpg` | Gallery 4 (home + /gallery) | 1:1 square | none | — | Hand-cut tagliatelle nests dusted with semolina on a board. |
| 2 | `gallery-05.jpg` | Gallery 5 (home + /gallery) | 4:5 | none | — | A plated course on a yacht's deck at sunset. |
| 2 | `gallery-06.jpg` | Gallery 6 (home + /gallery) | 4:3 landscape | none | — | The market: crates of tomatoes, herbs and fish at dawn. |
| 2 | `food-market.jpg` | /menus · How your menu is made (1 of 3) | 4:5 | hands | — | The market, that morning: the chef's hands choosing fish and tomatoes. |
| 2 | `food-pass.jpg` | /menus · How your menu is made (2 of 3) | 4:5 | hands | — | The pass: the chef's hands placing the last herb on a plate. |
| 2 | `food-table.jpg` | /menus · How your menu is made (3 of 3) | 4:5 | none | — | Served: the plate set down on linen, a guest's hand lifting a glass. |
| 2 | `room-residence.jpg` | Planner · A private home; /private-dining/connecticut | 16:11 landscape (location pages crop to 4:5 — keep the table centred) | none | — | A private dining room after dark, table set, no people. |
| 2 | `room-penthouse.jpg` | Planner · A Manhattan penthouse; /private-dining/new-york-city | 16:11 (table centred) | eric | C | Eric in a dark suit beside a set table, Manhattan lit behind the glass. |
| 2 | `room-yacht.jpg` | Planner · Aboard a yacht; /private-dining/yachts | 16:11 (table centred) | eric | A | Eric pouring wine at a table on a yacht's aft deck at sunset. |
| 3 | `hero-film.webm + .mp4` | Home hero, behind the figure (optional) | 16:9, 1920×1080, 10–15s silent loop, under 2 MB WebM + MP4 | none | — | Pure atmosphere behind the figure: candle flames and steam in a dark kitchen, out of focus. No people. |
| 3 | `gallery-07.jpg` | Gallery 7 (/gallery) | 3:4 | none | — | Dessert, last light: olive-oil cake, berries, dessert wine. |
| 3 | `gallery-08.jpg` | Gallery 8 (/gallery) | 1:1 square | none | — | Fire: a whole fish over glowing coals. |
| 3 | `gallery-09.jpg` | Gallery 9 (/gallery) | 4:5 | none | — | Letterpress menu cards fanned on linen. |
| 3 | `gallery-10.jpg` | Gallery 10 (/gallery) | 4:3 landscape | none | — | Toasts: glasses raised, faces out of frame. |
| 3 | `gallery-11.jpg` | Gallery 11 (/gallery) | 3:4 | hands | — | The lesson: floured hands shaping orecchiette. |
| 3 | `gallery-12.jpg` | Gallery 12 (/gallery) | 4:5 | none | — | Midnight: espresso and dark chocolate on a cleared table. |
| 3 | `room-estate.jpg` | Planner · A Hamptons estate; /private-dining/the-hamptons | 16:11 (table centred) | none | — | A long table on an estate lawn at golden hour. |
| 3 | `room-waterfront.jpg` | Planner · A waterfront home in Florida; /private-dining/florida | 16:11 (table centred) | none | — | A terrace table on the water at blue hour. |
| 3 | `room-island.jpg` | Planner · On a private island; /private-dining/private-islands | 16:11 (table centred) | none | — | Lanterns along a dock leading to a single table. |
| 3 | `room-hangar.jpg` | Planner · In a private hangar | 16:11 | none | — | A long table under a private jet's wing. |
| 3 | `room-abroad.jpg` | Planner · Somewhere abroad | 16:11 | none | — | A Mediterranean villa terrace at dusk. |
| 3 | `era-family-table.jpg` | /chef · I. The family table | 4:5 | none | — | A warm family kitchen on a Sunday morning, a pot simmering. |
| 3 | `era-the-line.jpg` | /chef · II. The line | 4:5 | eric | B | Eric on a restaurant line mid-service, flame under a pan. |
| 3 | `era-private-rooms.jpg` | /chef · III. The private rooms | 4:5 | none | — | A low-lit private dining room, one table set for eight. |
| 3 | `era-the-water.jpg` | /chef · IV. The water | 4:5 | eric | A | Eric on a yacht's deck at dusk, a table set behind him. |
| 3 | `era-the-lessons.jpg` | /chef · V. The lessons | 4:5 | hands | — | The chef's hands shaping pasta on a floured counter. |
| 3 | `era-now.jpg` | /chef · VI. Now | 4:5 | eric | C | Eric in a doorway, a glowing set table behind him. |

The full prompt for each slot is in `content/media.ts`.

---

## 8. Shoot order

1. **First:** `portrait`, the four `exp-*` and the four `menu-*`. With `hero-figure` already live, these nine make the site look finished.
2. **Then:** `gallery-01` to `gallery-06`, the three `food-*`, `room-penthouse`, `room-yacht`, `room-residence`.
3. **Last:** the remaining gallery, rooms and `/chef` chapters, and the optional hero film.
