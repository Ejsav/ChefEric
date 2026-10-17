// Every photograph and film slot on the site, with the brief and the
// generation prompt for each. The slot id is the file name: export the
// finished asset as public/media/<id>.(avif|webp|jpg|png) — or .webm/.mp4
// for films — and it replaces the tonal study on its own.
//
// The demo's photography is AI-generated from Eric's own likeness, playing
// the demo persona "Chef Eric Jokl". The rules that make it read as
// photography live in docs/AI_IMAGERY.md. The short version:
//   · one identity: the same face, hair and build as hero-figure, every frame
//   · one light: a single warm practical key, deep falloff, never flash
//   · one wardrobe system (A–D below), so the series reads as one shoot
//   · guests are never identifiable: backs, hands, out-of-focus shoulders only
//   · food at table height, never overhead flat-lay

export type Likeness = "eric" | "hands" | "none";

export type MediaSlot = {
  id: string;
  kind: "image" | "film";
  where: string;
  ratio: string;
  likeness: Likeness;
  wardrobe?: "A" | "B" | "C" | "D";
  priority: 1 | 2 | 3; // 1 = launch-critical
  brief: string;
  prompt: string;
};

export const wardrobe = {
  A: "black double-breasted chef jacket with black buttons, sleeves turned back once, black trousers",
  B: "white double-breasted chef jacket with cloth buttons (as in hero-figure), black trousers",
  C: "dark charcoal tailored suit, black shirt open at the collar — for greeting guests",
  D: "white shirt with sleeves rolled, long dark linen apron — for classes",
} as const;

// Prepended to every prompt that contains Eric. Use with the reference set
// (hero-figure plus face, three-quarter left/right, profile, hands).
export const identityLock =
  "Photorealistic editorial photograph of Eric Jokl, exactly matching the reference images: identical facial structure, eye shape and colour, brows, nose, lips, jawline, wavy shoulder-length brown hair and hairline, skin tone with natural pores; same age; no beautification, no smoothing.";

export const look =
  "Cinematic low-key lighting from a single warm practical source (candle, pendant, fire or window at blue hour), deep shadow falloff, shallow depth of field, 50mm lens at f/1.8, subtle Kodak Vision3 500T grain, true-to-life colour; espresso, walnut, ivory linen and aged brass palette.";

export const negative =
  "no extra or fused fingers, no warped hands, no distorted cutlery, glassware or plates, no plastic or waxy skin, no glossy CGI food, no over-sharpening, no HDR, no text, no logos, no watermarks, no identifiable guest faces, no overhead flat-lay, no stock-photo smiles.";

export const mediaSlots: MediaSlot[] = [
  // ── Home: hero ─────────────────────────────────────────────────────────
  { id: "hero-figure", kind: "image", where: "Home hero — Eric standing right of the name (on phones, above it)", ratio: "2:3 transparent cutout, 1024×1536+", likeness: "eric", wardrobe: "B", priority: 1,
    brief: "Supplied by Eric and live. Three-quarter length, hands in pockets, looking into camera, transparent background.",
    prompt: "Supplied asset." },
  { id: "hero-film", kind: "film", where: "Home hero, behind the figure (optional)", ratio: "16:9, 1920×1080, 10–15s silent loop, under 2 MB WebM + MP4", likeness: "none", priority: 3,
    brief: "Pure atmosphere behind the figure: candle flames and steam in a dark kitchen, out of focus. No people.",
    prompt: "Locked-off shot of a dark private kitchen at night, out of focus: candle flames flicker, steam drifts up from a pan under a single brass pendant, warm glow; seamless loop." },
  { id: "hero-film-poster", kind: "image", where: "Home hero — the first frame of hero-film, shown until the film plays and on slow connections", ratio: "16:9, 1920×1080 (the film's opening frame)", likeness: "none", priority: 3,
    brief: "Export the first frame of the hero film as a still, so the hand-off from photograph to film is invisible.",
    prompt: "Frame export from hero-film." },
  { id: "hero-still", kind: "image", where: "Home hero — full-bleed room behind the name and the figure (when there is no film)", ratio: "16:9 landscape, 2400×1350+ (the name sits on the left third — keep it dark)", likeness: "none", priority: 2,
    brief: "A dark, candlelit dining room set for dinner, no people, the left third deep in shadow so the name reads over it.",
    prompt: "A long dinner table in a dark wood-panelled dining room, candles lit, crystal and brass catching the light, the left third of the frame falling into deep shadow, no people, shot down the length of the table." },

  // ── Home: the chef ─────────────────────────────────────────────────────
  { id: "portrait", kind: "image", where: "Home — The Chef section (beside the story); right half of the share card", ratio: "4:5, 2400×3000", likeness: "eric", wardrobe: "A", priority: 1,
    brief: "The most important image after the hero. Waist-up in a black chef jacket, arms folded, in a dark kitchen; one warm key light from the left.",
    prompt: "Waist-up portrait of Eric in a black double-breasted chef jacket, arms loosely folded, standing in a dark professional kitchen, a single warm key light from camera left, copper pans and a brass pendant glowing out of focus behind, eyes just off camera, calm, confident." },

  // ── The four experiences (home cards + /experiences) ───────────────────
  { id: "exp-private-table", kind: "image", where: "Home experience card I + /experiences · The Private Table", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 1,
    brief: "Eric plating the first course in a private home kitchen, the candlelit dining room glowing through the doorway behind.",
    prompt: "Eric in a white chef jacket leans over a marble island in a private home kitchen, placing the final element on a row of plated first courses, focused; through an open doorway behind, a candlelit dining table waits; warm pendant light." },
  { id: "exp-island-water", kind: "image", where: "Home experience card II + /experiences · The Island & The Water", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 1,
    brief: "Eric at a live-fire grill on a private island beach at dusk; lanterns line the dock, a table set at the water's edge.",
    prompt: "Eric in a black chef jacket turns a whole fish on a wood-fired grill on a private island beach at blue hour, sparks rising, glass lanterns along a wooden dock behind, a dinner table set at the water's edge, calm dark sea." },
  { id: "exp-kitchen-lessons", kind: "image", where: "Home experience card III + /experiences · The Kitchen Lessons", ratio: "4:5", likeness: "eric", wardrobe: "D", priority: 1,
    brief: "Eric guiding a guest's hands as they shape fresh pasta at a marble counter. Guest's face out of frame.",
    prompt: "Eric in a white shirt and dark linen apron stands beside a guest (face out of frame, only forearms and hands) at a floured marble counter, guiding them as they shape fresh pasta; nests of tagliatelle, eggs and a wooden board; soft window light from the left." },
  { id: "exp-occasion", kind: "image", where: "Home experience card IV + /experiences · The Occasion", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 1,
    brief: "A long celebration table mid-toast, glasses raised and blurred in the foreground; Eric at the pass in the background.",
    prompt: "A long candlelit celebration table, a dozen glasses raised in the foreground with slight motion blur, guests seen only as arms and backs; deep in the background, Eric in a black chef jacket at a kitchen pass, sending out the next course." },

  // ── Signature dishes (home menus + /menus) ─────────────────────────────
  { id: "menu-after-midnight", kind: "image", where: "Beside the menu card “After midnight”", ratio: "4:5 (phones crop to 16:11 — keep the dish centred)", likeness: "none", priority: 1,
    brief: "The late pasta: one perfect bowl at one in the morning.",
    prompt: "Spaghetti with butter, black pepper and aged pecorino twirled high in a shallow ivory bowl on dark marble, a fork resting on the rim, a coupe of champagne and a candle soft behind, a wisp of steam, warm light from the left, shot at table height." },
  { id: "menu-late-summer-outdoors", kind: "image", where: "Beside the menu card “Late summer, outdoors”", ratio: "4:5 (dish centred)", likeness: "none", priority: 1,
    brief: "Heirloom tomatoes and burrata outdoors at golden hour.",
    prompt: "Sliced heirloom tomatoes in red, yellow and green with a torn burrata, basil and olive oil on an ivory plate, on a linen-covered table outdoors at golden hour, lawn and hedges out of focus, low sun from the side." },
  { id: "menu-at-anchor", kind: "image", where: "Beside the menu card “At anchor”", ratio: "4:5 (dish centred)", likeness: "none", priority: 1,
    brief: "Oysters on deck at sunset.",
    prompt: "A dozen oysters on crushed ice in a pewter tray with lemon and mignonette on a yacht's teak table at sunset, two flutes of sparkling wine soft behind, calm sea and horizon out of focus." },
  { id: "menu-by-the-fire", kind: "image", where: "Beside the menu card “By the fire”", ratio: "4:5 (dish centred)", likeness: "none", priority: 1,
    brief: "Osso buco by firelight.",
    prompt: "Osso buco on saffron risotto with bright gremolata in a wide ivory bowl on a dark walnut table, a glass of Barolo beside it, fireplace glow behind, candlelight from the left." },

  // ── Gallery (home shows 1–6; /gallery shows all 12) ────────────────────
  { id: "gallery-01", kind: "image", where: "Gallery 1 (home + /gallery)", ratio: "4:5", likeness: "none", priority: 2, brief: "Crudo, close: raw fish, blood orange, fennel on a dark plate.", prompt: "Thin slices of raw fluke with blood orange segments, shaved fennel, pistachio and olive oil on a matte charcoal ceramic plate, side light, table height, shallow depth of field." },
  { id: "gallery-02", kind: "image", where: "Gallery 2 (home + /gallery)", ratio: "4:3 landscape", likeness: "none", priority: 2, brief: "Before the guests: a long table set by candlelight, empty room.", prompt: "A long dinner table for twelve set with ivory linen, brass candlesticks, crystal and printed menu cards in an elegant dark dining room, candles just lit, no people, shot down the length of the table." },
  { id: "gallery-03", kind: "image", where: "Gallery 3 (home + /gallery)", ratio: "3:4", likeness: "eric", wardrobe: "B", priority: 2, brief: "Eric at the pass, wiping the rim of a plate, heat lamps glowing.", prompt: "Eric in a white chef jacket at a kitchen pass, wiping the rim of a plated course with a folded cloth, head bowed in concentration, warm heat-lamp light, steam, shallow depth of field." },
  { id: "gallery-04", kind: "image", where: "Gallery 4 (home + /gallery)", ratio: "1:1 square", likeness: "none", priority: 2, brief: "Hand-cut tagliatelle nests dusted with semolina on a board.", prompt: "Nests of fresh hand-cut tagliatelle dusted with semolina on a worn wooden board, a knife and a few eggs beside, soft daylight from a window, table height." },
  { id: "gallery-05", kind: "image", where: "Gallery 5 (home + /gallery)", ratio: "4:5", likeness: "none", priority: 2, brief: "A plated course on a yacht's deck at sunset.", prompt: "A plated course of grilled swordfish with caponata on an ivory plate on a yacht's teak table at sunset, wine glass catching the light, sea and horizon out of focus." },
  { id: "gallery-06", kind: "image", where: "Gallery 6 (home + /gallery)", ratio: "4:3 landscape", likeness: "none", priority: 2, brief: "The market: crates of tomatoes, herbs and fish at dawn.", prompt: "An early-morning farmers' market stall with wooden crates of heirloom tomatoes, bunches of basil and a tray of whole fish on ice, soft cool dawn light, no faces." },
  { id: "gallery-07", kind: "image", where: "Gallery 7 (/gallery)", ratio: "3:4", likeness: "none", priority: 3, brief: "Dessert, last light: olive-oil cake, berries, dessert wine.", prompt: "A slice of lemon olive-oil cake with macerated berries and a small glass of dessert wine on a linen napkin, last golden light of the evening, table height." },
  { id: "gallery-08", kind: "image", where: "Gallery 8 (/gallery)", ratio: "1:1 square", likeness: "none", priority: 3, brief: "Fire: a whole fish over glowing coals.", prompt: "A whole branzino in a grill basket over glowing coals outdoors at night, flames licking, sparks, lemon halves charring beside." },
  { id: "gallery-09", kind: "image", where: "Gallery 9 (/gallery)", ratio: "4:5", likeness: "none", priority: 3, brief: "Letterpress menu cards fanned on linen.", prompt: "A fan of letterpress menu cards with a small brass EJ monogram on ivory linen beside a sprig of rosemary, soft candlelight, shallow depth of field; card text blurred and unreadable." },
  { id: "gallery-10", kind: "image", where: "Gallery 10 (/gallery)", ratio: "4:3 landscape", likeness: "none", priority: 3, brief: "Toasts: glasses raised, faces out of frame.", prompt: "Glasses of red and sparkling wine raised over a long candlelit table, hands and wrists only, faces out of frame, motion blur on the glasses." },
  { id: "gallery-11", kind: "image", where: "Gallery 11 (/gallery)", ratio: "3:4", likeness: "hands", priority: 3, brief: "The lesson: floured hands shaping orecchiette.", prompt: "Close-up of floured hands pressing orecchiette with a butter knife on a marble counter, rows of finished pasta beside, soft window light." },
  { id: "gallery-12", kind: "image", where: "Gallery 12 (/gallery)", ratio: "4:5", likeness: "none", priority: 3, brief: "Midnight: espresso and dark chocolate on a cleared table.", prompt: "A single espresso and a square of dark chocolate with sea salt on a cleared dinner table, one candle burning low, crumbs on the linen, late-night mood." },

  // ── Market to table (/menus) ───────────────────────────────────────────
  { id: "food-market", kind: "image", where: "/menus · How your menu is made (1 of 3)", ratio: "4:5", likeness: "hands", priority: 2, brief: "The market, that morning: the chef's hands choosing fish and tomatoes.", prompt: "Close-up of Eric's hands and forearms (white chef-jacket cuffs) choosing a whole day-boat fish on ice beside heirloom tomatoes at an early-morning market stall, soft cool daylight, shallow depth of field." },
  { id: "food-pass", kind: "image", where: "/menus · How your menu is made (2 of 3)", ratio: "4:5", likeness: "hands", priority: 2, brief: "The pass: the chef's hands placing the last herb on a plate.", prompt: "Close-up of Eric's hands in white chef-jacket sleeves placing a final herb leaf on a plated course with fine tweezers at a kitchen pass, warm light, steam, very shallow depth of field." },
  { id: "food-table", kind: "image", where: "/menus · How your menu is made (3 of 3)", ratio: "4:5", likeness: "none", priority: 2, brief: "Served: the plate set down on linen, a guest's hand lifting a glass.", prompt: "A plated course just set down on an ivory linen place setting beside a printed menu card, a guest's hand (no face) lifting a wine glass, candles and glassware soft behind, warm low light." },

  // ── Plan your evening (rooms) — also used on the location pages ───────
  { id: "room-residence", kind: "image", where: "Planner · A private home (the default room, seen on the home page before any click)", ratio: "16:11 landscape (location pages crop to 4:5 — keep the table centred)", likeness: "none", priority: 2, brief: "A private dining room after dark, table set, no people.", prompt: "A private home's dining room after dark, table set for eight with ivory linen, brass and candles, art on dark walls, a doorway glowing warm." },
  { id: "room-penthouse", kind: "image", where: "Planner · A Manhattan penthouse; /private-dining/new-york-city", ratio: "16:11 (table centred)", likeness: "eric", wardrobe: "C", priority: 2, brief: "Eric in a dark suit beside a set table, Manhattan lit behind the glass.", prompt: "Eric in a dark charcoal suit stands beside a candlelit table set for six in a Manhattan penthouse at blue hour, floor-to-ceiling windows and the lit skyline behind him." },
  { id: "room-estate", kind: "image", where: "Planner · A Hamptons estate; /private-dining/the-hamptons", ratio: "16:11 (table centred)", likeness: "none", priority: 3, brief: "A long table on an estate lawn at golden hour.", prompt: "A long dinner table set on an estate lawn at golden hour, linen moving in the breeze, hydrangeas and a shingled house beyond, lanterns waiting to be lit." },
  { id: "room-waterfront", kind: "image", where: "Planner · A waterfront home; /private-dining/palm-beach", ratio: "16:11 (table centred)", likeness: "none", priority: 3, brief: "A terrace table on the water at blue hour.", prompt: "A terrace table at a Florida waterfront home at blue hour, tall doors open to the bay, palms in silhouette, candle hurricanes on the table." },
  { id: "room-yacht", kind: "image", where: "Planner · Aboard a yacht; /private-dining/yachts", ratio: "16:11 (table centred)", likeness: "eric", wardrobe: "A", priority: 2, brief: "Eric pouring wine at a table on a yacht's aft deck at sunset.", prompt: "Eric in a black chef jacket pours red wine at a table set on the aft deck of a motor yacht at anchor at sunset, guests only as out-of-focus shoulders, calm sea and a distant coastline." },
  { id: "room-island", kind: "image", where: "Planner · On a private island; /private-dining/private-islands", ratio: "16:11 (table centred)", likeness: "none", priority: 3, brief: "Lanterns along a dock leading to a single table.", prompt: "A lantern-lit wooden dock leading to a single dinner table at the water's edge on a private island at dusk, palms and dark water." },
  { id: "room-hangar", kind: "image", where: "Planner · In a private hangar; /private-dining/private-aviation", ratio: "16:11", likeness: "none", priority: 3, brief: "A long table under a private jet's wing.", prompt: "A long candlelit dinner table inside a polished private aviation hangar beneath the wing of a business jet, pools of warm light on a dark floor." },
  { id: "room-abroad", kind: "image", where: "Planner · Somewhere abroad", ratio: "16:11", likeness: "none", priority: 3, brief: "A Mediterranean villa terrace at dusk.", prompt: "A stone villa terrace in the Mediterranean at dusk, a table set under a pergola, cypress trees and distant sea, candlelight." },

  // ── The Chapters (/chef) ───────────────────────────────────────────────
  { id: "chapter-patience", kind: "image", where: "/chef · I. Patience", ratio: "4:5", likeness: "none", priority: 3, brief: "A pot that has been on the stove since morning, a long table set in the room beyond.", prompt: "A heavy enamel pot of tomato sauce simmering on an old range in a warm, lived-in kitchen, a wooden spoon resting on the rim, steam rising, a long table set with bread and wine beyond, soft window light; no people." },
  { id: "chapter-fire", kind: "image", where: "/chef · II. Fire", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 3, brief: "The chef tossing a pan over a high flame, the kitchen busy behind him.", prompt: "Eric in a white chef jacket tossing a pan over a high flame, flames and steam rising, ticket rail and other cooks blurred behind, warm practical light." },
  { id: "chapter-room", kind: "image", where: "/chef · III. The room", ratio: "4:5", likeness: "none", priority: 3, brief: "A low-lit private dining room, one round table set for eight, an hour before anyone arrives.", prompt: "An empty, low-lit private dining room with dark wood panelling and a landscape painting, a single round table set for eight with ivory linen, crystal and three taper candles, leather chairs; quiet and expectant." },
  { id: "chapter-distance", kind: "image", where: "/chef · IV. Distance; /private-dining/yachts", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 2, brief: "The chef at the rail of a yacht at blue hour, a table set on deck behind him.", prompt: "Eric in a black chef jacket stands at the rail of a yacht at blue hour, hands in pockets, looking out to sea, a dinner table set with candles on the teak deck behind him, coastline lights across the water." },
  { id: "chapter-hands", kind: "image", where: "/chef · V. Hands", ratio: "4:5", likeness: "hands", priority: 3, brief: "Hands sealing ravioli on a floured wooden counter.", prompt: "Close-up of Eric's hands sealing fresh ravioli on a floured wooden counter, apron and rolled sleeves, a bowl of ricotta filling, raking side light, shallow depth of field." },
  { id: "chapter-tonight", kind: "image", where: "/chef · VI. Tonight", ratio: "4:5", likeness: "eric", wardrobe: "C", priority: 2, brief: "The chef at the door of a candlelit dining room, looking back toward camera.", prompt: "Eric in a dark tailored jacket stands in a tall doorway looking back over his shoulder toward camera, a fully set candlelit table glowing in the room behind him, the hallway in darkness." },
];
