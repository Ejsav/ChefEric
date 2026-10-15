// Every photograph and film slot on the site, with the brief and the
// generation prompt for each. The slot id is the file name: export the
// finished asset as public/media/<id>.(avif|webp|jpg|png) — or .webm/.mp4
// for films — and it replaces the tonal study on its own.
//
// The site is a creative showcase: its photography is AI-generated from
// Eric's own likeness. The rules that make that read as photography, not
// as AI, live in docs/AI_IMAGERY.md. The short version:
//   · one identity: the same face, hairline, build and grooming in every frame
//   · one light: a single warm practical key, deep falloff, never flash
//   · one wardrobe system (A–D below), so the series reads as one shoot
//   · guests are never identifiable: backs, hands, out-of-focus shoulders only
//   · nothing that implies Eric cooks: he hosts, directs, lights, pours, welcomes

export type Likeness = "eric" | "hands" | "none";

export type MediaSlot = {
  id: string;
  kind: "image" | "film";
  where: string;
  ratio: string;
  likeness: Likeness;
  wardrobe?: "A" | "B" | "C" | "D";
  brief: string;
  prompt: string;
  priority?: 1 | 2 | 3; // 1 = launch-critical
};

export const wardrobe = {
  A: "black tailored two-button suit, black shirt open at the collar, no tie, black leather shoes; a slim steel watch",
  B: "fine-gauge black merino knit, charcoal tailored trousers; a slim steel watch",
  C: "crisp white shirt with sleeves rolled twice, black tailored trousers, black belt",
  D: "long black wool overcoat over wardrobe A, collar up",
} as const;

// Prepended to every prompt that contains Eric. Use with the reference set
// (face, three-quarter left, three-quarter right, profile, full body).
export const identityLock =
  "Photorealistic editorial photograph of Eric Jokl, exactly matching the reference images: identical facial structure, eye shape and colour, brows, nose, lips, jawline, hairline and hair texture, skin tone with natural pores and fine texture; same age; no beautification, no smoothing, no symmetry correction.";

export const look =
  "Cinematic low-key lighting from a single warm practical source (candle, pendant or window at blue hour), deep shadow falloff, shallow depth of field, 50mm lens at f/1.4 on a full-frame cinema camera, subtle Kodak Vision3 500T grain, true-to-life colour, espresso, walnut, ivory linen and aged brass palette.";

export const negative =
  "no extra or fused fingers, no warped hands, no distorted cutlery or glassware, no plastic or waxy skin, no over-sharpening, no HDR, no lens flare stars, no text, no logos, no watermarks, no identifiable guest faces, no chef whites, no cooking at a stove, no flat-lay food photography, no stock-photo smiles.";

export const mediaSlots: MediaSlot[] = [
  // ── Home ───────────────────────────────────────────────────────────────
  {
    id: "hero-still", kind: "image", where: "Home hero (behind the name)", ratio: "16:9, 3840×2160, subject in the right third", likeness: "eric", wardrobe: "A", priority: 1,
    brief: "The opening frame. Eric at the head of a candlelit table, the room around him in darkness. Negative space on the left for the name.",
    prompt: "Eric stands at the far end of a long candlelit dinner table set for twelve in a dark private dining room, one hand resting on the back of a chair, looking just past camera; ivory linen, brass candlesticks, crystal in soft focus; the left two thirds of the frame fall into near-black shadow.",
  },
  {
    id: "hero-film", kind: "film", where: "Home hero (replaces the still on capable devices)", ratio: "16:9, 1920×1080, 10–15s seamless loop, silent, under 2 MB WebM + MP4", likeness: "eric", wardrobe: "A", priority: 2,
    brief: "A breathing photograph: candle flames move, Eric's head turns slightly toward the table, smoke from a snuffed match drifts. No cuts, no camera move beyond a slow 2% push.",
    prompt: "Image-to-video from hero-still: almost still; candle flames flicker naturally, Eric slowly turns his head a few degrees toward the table and back, a thin ribbon of smoke rises from a just-lit candle; camera pushes in 2% over 12 seconds; loopable.",
  },
  {
    id: "hero-film-poster", kind: "image", where: "First frame of the hero film", ratio: "16:9, same as hero-film", likeness: "eric", wardrobe: "A", priority: 2,
    brief: "Export the first frame of hero-film so the loop starts without a jump.",
    prompt: "First frame of hero-film, exported at full resolution.",
  },
  {
    id: "portrait", kind: "image", where: "Home — The Host section; right half of the share card", ratio: "4:5, 2400×3000", likeness: "eric", wardrobe: "A", priority: 1,
    brief: "The most important image on the site. A portrait with presence: one key light from the left, looking just off camera, controlled intensity.",
    prompt: "Waist-up portrait of Eric seated in a dark walnut-panelled private dining room, body angled three-quarters, face turned toward a single warm key light from camera left, eyes just off camera, calm and intense, a glass of red wine untouched on the table edge; background falls to black with two out-of-focus candle highlights.",
  },

  // ── Experiences ────────────────────────────────────────────────────────
  {
    id: "exp-private-table", kind: "image", where: "Experiences I · The Private Table", ratio: "4:5", likeness: "eric", wardrobe: "C", priority: 1,
    brief: "Before the guests: Eric lighting the last candle on a fully set table in a private home.",
    prompt: "Eric leans over a set dinner table in a private residence lighting the last taper candle with a long match, face lit from below by the flame; ivory linen, brass, crystal, printed menu cards at each place; the dining room beyond is dark and elegant.",
  },
  {
    id: "exp-island-water", kind: "image", where: "Experiences II · The Island & The Water", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 1,
    brief: "Late service on open water: Eric walking a lantern-lit dock toward a table at the water's edge at dusk.",
    prompt: "Eric walks along a wooden dock lined with glass lanterns toward a small dinner table set at the water's edge on a private island at blue hour, seen from behind at three-quarters so his profile reads; calm dark water, a yacht's lights far off.",
  },
  {
    id: "exp-founders-table", kind: "image", where: "Experiences III · The Founders' Table", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 1,
    brief: "A long table mid-conversation. Eric at the head, listening; guests only as shoulders, hands and backs, out of focus.",
    prompt: "Eric sits at the head of a long candlelit table mid-conversation, leaning forward, listening with intent; foreground guests are out-of-focus shoulders and hands around wine glasses with no faces visible; notebooks and printed cards on the linen, warm pendant light above.",
  },
  {
    id: "exp-occasion", kind: "image", where: "Experiences IV · The Occasion", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 2,
    brief: "Toasts, third course. Glasses raised over a long table; Eric standing, mid-toast; motion blur allowed on the glasses.",
    prompt: "Eric stands mid-toast at a long celebration table, glass raised, warm low light; a dozen raised glasses in the foreground with slight motion blur, guests seen only as blurred arms and backs; confetti of candle bokeh behind.",
  },

  // ── The Making (/eric) ─────────────────────────────────────────────────
  {
    id: "era-screen", kind: "image", where: "/eric · I. The screen", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 2,
    brief: "Where it started: Eric at a desk at night, face lit by a monitor, the city dark beyond the window.",
    prompt: "Eric works at a minimal desk at night, face lit cool by a monitor showing out-of-focus code, a warm desk lamp edge-lighting his shoulder, rain-streaked window with city lights beyond; focused, unposed.",
  },
  {
    id: "era-pressure", kind: "image", where: "/eric · II. The pressure", ratio: "4:5", likeness: "eric", wardrobe: "D", priority: 3,
    brief: "Motion, not posing: Eric crossing a wet city street at night, collar up.",
    prompt: "Eric crosses a wet city street at night in a long black overcoat, collar up, mid-stride, headlights and shop light reflecting off the asphalt, slight motion blur on the background.",
  },
  {
    id: "era-conversion", kind: "image", where: "/eric · III. The attention", ratio: "4:5", likeness: "eric", wardrobe: "C", priority: 3,
    brief: "The study of attention: Eric in front of a wall of printed layouts and sketches, pen in hand.",
    prompt: "Eric stands before a studio wall pinned with printed page layouts, wireframes and seating sketches, marking one with a black pen, side-lit by a tall window at dusk; the work is out of focus, he is sharp.",
  },
  {
    id: "era-crossover", kind: "image", where: "/eric · IV. The room", ratio: "4:5", likeness: "eric", wardrobe: "C", priority: 2,
    brief: "From screens to rooms: Eric adjusting a brass pendant over an empty table in a private dining room.",
    prompt: "Eric reaches up to adjust the height of a brass pendant lamp over an empty dining table set for eight in a dark private room, the pool of light falling on ivory linen; the rest of the room in shadow.",
  },
  {
    id: "era-table", kind: "image", where: "/eric · V. The table", ratio: "4:5", likeness: "hands", priority: 2,
    brief: "Hands only: Eric placing a printed menu card at a place setting.",
    prompt: "Close-up of Eric's hands (same skin tone, same watch) placing a letterpress menu card on an ivory linen place setting beside a crystal glass, candlelight raking from the left, very shallow depth of field.",
  },
  {
    id: "era-now", kind: "image", where: "/eric · VI. Now", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 2,
    brief: "Wherever the table is: Eric at a doorway, a set table glowing in the room behind him.",
    prompt: "Eric stands in a tall doorway looking back over his shoulder toward camera, a fully set candlelit table glowing in the room behind him, the corridor in darkness.",
  },

  // ── Compose an evening (rooms) ─────────────────────────────────────────
  { id: "room-residence", kind: "image", where: "Composer · A private home", ratio: "16:11", likeness: "none", priority: 2, brief: "A private dining room after dark, table set, no people.", prompt: "A private home's dining room after dark, table set for eight with ivory linen, brass and candles, art on dark walls, a doorway glowing warm." },
  { id: "room-penthouse", kind: "image", where: "Composer · A Manhattan penthouse", ratio: "16:11", likeness: "eric", wardrobe: "A", priority: 2, brief: "Eric at a floor-to-ceiling window above the avenue, table set behind him.", prompt: "Eric stands at a floor-to-ceiling penthouse window looking out over Manhattan at blue hour, a candlelit table set for six behind him, his reflection faint in the glass." },
  { id: "room-estate", kind: "image", where: "Composer · A Hamptons estate", ratio: "16:11", likeness: "none", priority: 3, brief: "A long table on an estate lawn at golden hour, hedges and ocean haze beyond.", prompt: "A long dinner table set on an estate lawn at golden hour, linen moving slightly in the breeze, tall hedges and a hint of ocean haze beyond, lanterns waiting to be lit." },
  { id: "room-waterfront", kind: "image", where: "Composer · A waterfront home in Florida", ratio: "16:11", likeness: "none", priority: 3, brief: "Doors open to the bay at blue hour.", prompt: "A terrace table at a Florida waterfront home at blue hour, tall doors open to the bay, palms in silhouette, candle hurricanes on the table." },
  { id: "room-yacht", kind: "image", where: "Composer · Aboard a yacht", ratio: "16:11", likeness: "eric", wardrobe: "B", priority: 2, brief: "Aft deck, second course; Eric pouring wine, guests as blurred shoulders.", prompt: "Eric pours red wine at a table set on the aft deck of a motor yacht at anchor at sunset, guests seen only as out-of-focus shoulders, calm sea and a distant coastline." },
  { id: "room-island", kind: "image", where: "Composer · On a private island", ratio: "16:11", likeness: "none", priority: 3, brief: "Lanterns along a dock leading to a single table.", prompt: "A lantern-lit wooden dock leading to a single dinner table at the water's edge on a private island at dusk, palms and dark water." },
  { id: "room-hangar", kind: "image", where: "Composer · In a private hangar", ratio: "16:11", likeness: "none", priority: 3, brief: "A long table under a private jet's wing, dramatic and clean.", prompt: "A long candlelit dinner table set inside a polished private aviation hangar beneath the wing of a business jet, pools of warm light on a dark epoxy floor." },
  { id: "room-abroad", kind: "image", where: "Composer · Somewhere abroad", ratio: "16:11", likeness: "none", priority: 3, brief: "A villa terrace elsewhere, stone and cypress.", prompt: "A stone villa terrace in the Mediterranean at dusk, a table set under a pergola, cypress trees and distant sea, candlelight." },

  // ── Destinations (/private-dining/…) ──────────────────────────────────
  { id: "place-connecticut", kind: "image", where: "/private-dining/connecticut", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 3, brief: "A country-house dining room, Eric checking the table.", prompt: "Eric checks a place setting in a New England country-house dining room at dusk, white-painted panelling, candlelight, trees beyond the window." },
  { id: "place-new-york-city", kind: "image", where: "/private-dining/new-york-city", ratio: "4:5", likeness: "eric", wardrobe: "A", priority: 3, brief: "Above the avenue.", prompt: "Eric in a dark Manhattan apartment beside a set table, the lit skyline filling tall windows behind him." },
  { id: "place-the-hamptons", kind: "image", where: "/private-dining/the-hamptons", ratio: "4:5", likeness: "none", priority: 3, brief: "Long table, late August.", prompt: "A long table on a Hamptons lawn in late August, golden hour, hydrangeas and a shingled house beyond." },
  { id: "place-florida", kind: "image", where: "/private-dining/florida", ratio: "4:5", likeness: "none", priority: 3, brief: "Doors open to the bay.", prompt: "A Palm Beach terrace table on the water at blue hour, candle hurricanes, palms in silhouette." },
  { id: "place-yachts", kind: "image", where: "/private-dining/yachts", ratio: "4:5", likeness: "eric", wardrobe: "B", priority: 3, brief: "Anchored, second course.", prompt: "Eric stands at the rail of a yacht's aft deck beside a set table at sunset, looking out to sea." },
  { id: "place-private-islands", kind: "image", where: "/private-dining/private-islands", ratio: "4:5", likeness: "none", priority: 3, brief: "Lanterns along the dock.", prompt: "Lanterns along a private island dock leading to a table at dusk, seen from water level." },
];
