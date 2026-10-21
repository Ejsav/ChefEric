# Demonstration images: where each one goes

The demonstration edition uses imagery created from Eric Jokl's likeness. This is the placement for the set supplied in October 2026; all of it is now live in `public/media/`. To replace or add an image, save it under the file name shown, in `public/media/`, and the next build puts it in place.

The quickest way, with no tools installed:

1. On GitHub, open this repository on the working branch and go to `public/media/`.
2. **Add file → Upload files**, drag the images in, and rename each one to its slot name *before* uploading (for example `portrait.jpg`). The extension can be `.jpg`, `.png`, `.webp` or `.avif`.
3. Commit. Vercel rebuilds and the photographs appear.

Then run `npm run media` locally to confirm every slot is filled, and check the preview deployment on a desktop and a phone.

## The placement

| Save as | The image | Appears |
|---|---|---|
| `portrait.jpg` | Black chef jacket, arms folded, copper pans behind | Home · The Chef; share card |
| `exp-private-table.jpg` | Plating scallops at a marble island, candlelit dining room through the doorway | Experiences · The Private Table |
| `exp-island-water.jpg` | Grilling a whole fish over fire on the beach at night, lanterns on the dock | Experiences · The Island & The Water |
| `exp-kitchen-lessons.jpg` | Making tagliatelle by the window, a guest's hands beside yours | Experiences · The Kitchen Lessons |
| `exp-occasion.jpg` | Black jacket at the pass, guests raising glasses in the foreground | Experiences · The Occasion |
| `menu-after-midnight.jpg` | Cacio e pepe with a candle and a coupe | Menus · After midnight |
| `menu-late-summer-outdoors.jpg` | Heirloom tomatoes and burrata in the garden | Menus · Late summer, outdoors |
| `menu-at-anchor.jpg` | Oysters on ice on a yacht deck at sunset | Menus · At anchor |
| `menu-by-the-fire.jpg` | Osso buco and saffron risotto, fireplace behind | Menus · By the fire |
| `gallery-01.jpg` | Crudo with blood orange, fennel and pistachio | Gallery |
| `gallery-03.jpg` | White jacket at the pass, cloth on the plate rim, copper lamp on the right (scallops) | Gallery |
| `gallery-07.jpg` | Olive-oil cake with berries, golden light | Gallery |
| `gallery-08.jpg` | Whole fish in a grill basket over coals | Gallery |
| `gallery-09.jpg` | Menu cards with the gold EJ monogram, candle and rosemary | Gallery |
| `gallery-10.jpg` | Glasses raised over the candlelit table (hands only) | Gallery |
| `gallery-11.jpg` | Hands shaping orecchiette with a knife | Gallery |
| `gallery-12.jpg` | Espresso and salted chocolate by candlelight | Gallery |
| `food-pass.jpg` | White jacket at the pass under copper lamps, steam rising on the right | Menus · How a menu is made |
| `room-residence.jpg` | Long table with crystal and taper candles in a panelled dining room | Plan your evening · A private home |
| `room-estate.jpg` | Long linen table on the lawn of a shingled house at sunset | Plan your evening · Hamptons; /private-dining/the-hamptons |
| `room-waterfront.jpg` | Terrace table framed by open doors, palms and the bay at blue hour | Plan your evening · Waterfront; /private-dining/palm-beach |
| `room-island.jpg` | Table for two at the end of a lantern-lit dock | Plan your evening · Island; /private-dining/private-islands |
| `room-hangar.jpg` | Candlelit table beneath the wing of a jet | Plan your evening · Hangar; /private-dining/private-aviation |
| `room-abroad.jpg` | Terrace under a vine pergola above the sea at sunset | Plan your evening · Abroad |
| `chapter-patience.jpg` | Pot of sauce on an old stove, the family table beyond | The Chef · I. Patience |
| `chapter-fire.jpg` | Tossing a pan over a high flame | The Chef · II. Fire |
| `chapter-room.jpg` | Round table for eight in a dark panelled room | The Chef · III. The room |
| `chapter-distance.jpg` | Black jacket at the rail of a yacht at blue hour | The Chef · IV. Distance; /private-dining/yachts |
| `chapter-hands.jpg` | Hands sealing ravioli on a floured board | The Chef · V. Hands |
| `chapter-tonight.jpg` | In the doorway in a dark jacket, looking back, candlelit room behind | The Chef · VI. Tonight |

`hero-figure.webp` is already in place.

## Still to create

These slots have no image in the set yet. Until they do, each shows a lit tonal study in the right mood. Briefs and prompts are in `content/media.ts`; the full brief is in `docs/PHOTOGRAPHY_GUIDE.md`.

| Slot | Needed |
|---|---|
| `room-penthouse` | You in a dark suit beside a set table, Manhattan lit behind the glass (16:11 landscape) |
| `room-yacht` | A table on a yacht's aft deck at sunset, **landscape** 16:11 |
| `gallery-02` | A long table set and empty, shot down its length (4:3) |
| `gallery-04` | Nests of hand-cut tagliatelle on a board (square) |
| `gallery-05` | A plated course on a yacht's teak table at sunset (4:5) |
| `gallery-06` | Early-morning market: crates of tomatoes, herbs, fish on ice (4:3) |
| `food-market` | The chef's hands choosing fish at the market (4:5) |
| `food-table` | A plate just set down on linen, a guest's hand lifting a glass (4:5) |
| `hero-film` | 10–15s silent loop of candle flames and steam in a dark kitchen (optional) |

## Spare

Seven more frames from the pass series (white jacket, cloth on the rim, heat lamps) were not placed, because the set already shows that moment twice. Keep them for social posts, or swap one in for `gallery-03` or `food-pass`.
