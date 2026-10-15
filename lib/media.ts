// Media slots. Every photograph and film on the site has a slot id (see
// content/media.ts for the full list and the brief for each). To place an
// asset, export it as `public/media/<slot>.<ext>` — nothing else changes.
// next.config.ts lists that folder at build time, so a slot with no file
// keeps rendering its tonal study and a slot with a file renders the asset.

const available = new Set((process.env.NEXT_PUBLIC_MEDIA ?? "").split(",").filter(Boolean));

const IMAGE_EXT = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/** Public path of the image for a slot, or undefined while it is empty. */
export function mediaImage(slot?: string): string | undefined {
  if (!slot) return undefined;
  for (const ext of IMAGE_EXT) {
    if (available.has(`${slot}.${ext}`)) return `/media/${slot}.${ext}`;
  }
  return undefined;
}

/** WebM and/or MP4 sources for a film slot, or null while it is empty. */
export function mediaVideo(slot: string): { webm?: string; mp4?: string } | null {
  const webm = available.has(`${slot}.webm`) ? `/media/${slot}.webm` : undefined;
  const mp4 = available.has(`${slot}.mp4`) ? `/media/${slot}.mp4` : undefined;
  return webm || mp4 ? { webm, mp4 } : null;
}
