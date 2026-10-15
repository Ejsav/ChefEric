import Image from "next/image";
import { mediaImage, mediaVideo } from "@/lib/media";
import { HeroFilm } from "@/components/system/HeroFilm";

// The hero's photograph, film and figure, when they exist.
//  - hero-still / hero-film: a full-bleed scene behind the name. The film
//    only plays on full-tier devices (see HeroFilm).
//  - hero-figure: a transparent cutout of Eric standing in the room, right of
//    the name, graded into the candlelight and fading into the floor.
// On phones the figure is rendered in the hero's flow instead (see Hero).
// Scrims keep the name legible over any frame. Renders nothing while every
// slot is empty, leaving the original type-and-light hero.
export function HeroMedia() {
  const film = mediaVideo("hero-film");
  const still = mediaImage("hero-still") ?? (film ? mediaImage("hero-film-poster") : undefined);
  const figure = mediaImage("hero-figure");
  if (!still && !film && !figure) return null;

  return (
    <>
      {still || film ? (
        <div aria-hidden className="hero-media absolute inset-0 -z-20">
          {still ? (
            <Image src={still} alt="" fill priority sizes="100vw" className="object-cover object-[68%_35%]" />
          ) : null}
          {film ? <HeroFilm webm={film.webm} mp4={film.mp4} poster={mediaImage("hero-film-poster") ?? still} /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,12,9,0.9)_0%,rgba(17,12,9,0.55)_45%,rgba(17,12,9,0.15)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(17,12,9,0.96)_0%,rgba(17,12,9,0.4)_40%,transparent_70%)]" />
        </div>
      ) : null}

      {figure ? (
        <div aria-hidden className="hero-figure pointer-events-none absolute bottom-0 right-[2%] top-[calc(var(--header-h)-0.5rem)] -z-[5] hidden w-[42%] md:block lg:right-[5%] lg:w-[36%]">
          <Image
            src={figure}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 36vw, 42vw"
            className="object-contain object-bottom [filter:brightness(0.8)_contrast(1.06)_saturate(0.9)_sepia(0.12)] [mask-image:linear-gradient(to_top,transparent_0%,black_26%)]"
          />
        </div>
      ) : null}
    </>
  );
}
