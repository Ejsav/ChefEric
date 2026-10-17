import { gallery } from "@/content/gallery";
import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { mediaImage } from "@/lib/media";

// A contact sheet of the work: food, rooms, hands, fire. Masonry columns
// with mixed ratios so it reads as photography, not a thumbnail grid.
// Once any photograph is delivered, only delivered frames are shown: a
// gallery is the one place a tonal study must never sit beside a photograph.
// With none delivered, the full set of studies shows the template's shape.
export function GalleryGrid({ count, sizes = "(min-width: 1024px) 30vw, 50vw" }: { count?: number; sizes?: string }) {
  const delivered = gallery.filter((s) => mediaImage(s.slot));
  const pool = delivered.length ? delivered : gallery;
  const shots = count ? pool.slice(0, count) : pool;
  return (
    // Captions show from tablet up; on phone-sized tiles the photograph speaks alone.
    <ul className="columns-2 gap-4 md:columns-3 md:gap-6 [&>li]:mb-4 md:[&>li]:mb-6 [&_figcaption]:hidden sm:[&_figcaption]:flex">
      {shots.map((s, i) => (
        <li key={s.slot} className="break-inside-avoid" data-reveal style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
          <Plate tone={s.tone} slot={s.slot} alt={s.alt} label={s.label} ratio={s.ratio} reveal={false} sizes={sizes} />
        </li>
      ))}
    </ul>
  );
}

export function GalleryStrip({ index = "V" }: { index?: string }) {
  return (
    <section aria-labelledby="gallery-title" className="tone-dark section defer-render relative">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <div>
            <Eyebrow index={index}>The Gallery</Eyebrow>
            <h2 id="gallery-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>From the market</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}><span className="italic text-accent">to the last plate.</span></span>
            </h2>
          </div>
          <div data-reveal><Cta href="/gallery" variant="quiet">The full gallery</Cta></div>
        </div>
        <GalleryGrid count={6} />
      </div>
    </section>
  );
}
