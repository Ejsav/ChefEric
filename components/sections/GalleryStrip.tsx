import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { GalleryGrid } from "@/components/sections/Gallery";
import { home } from "@/content/home";

// The work, up close: the first six frames of the evening on the home page,
// each opening in the lightbox; the full sequence lives on /gallery.
export function GalleryStrip({ index = "V" }: { index?: string }) {
  return (
    <section aria-labelledby="gallery-title" className="tone-dark section defer-render relative">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-16">
          <div>
            <Eyebrow index={index}>The Gallery</Eyebrow>
            <h2 id="gallery-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>{home.gallery.lines[0]}</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}><span className="italic text-accent">{home.gallery.lines[1]}</span></span>
            </h2>
          </div>
          <div data-reveal><Cta href="/gallery" variant="quiet">The full evening</Cta></div>
        </div>
        <GalleryGrid count={6} />
      </div>
    </section>
  );
}
