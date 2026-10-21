import Image from "next/image";
import { mediaImage, mediaVideo } from "@/lib/media";
import { HeroFilm } from "@/components/system/HeroFilm";

// The hero's photograph and film, when they exist: a full-bleed scene behind
// the name. The film only plays on full-tier devices (see HeroFilm). Scrims
// keep the name legible over any frame. Renders nothing while both slots are
// empty, leaving the type-and-light hero. (Eric's figure is placed by Hero.)
export function HeroMedia() {
  const film = mediaVideo("hero-film");
  const still = mediaImage("hero-still") ?? (film ? mediaImage("hero-film-poster") : undefined);
  if (!still && !film) return null;

  return (
    <div aria-hidden className="hero-media absolute inset-0 -z-20">
      {still ? <Image src={still} alt="" fill priority sizes="100vw" className="object-cover object-[68%_35%]" /> : null}
      {film ? <HeroFilm webm={film.webm} mp4={film.mp4} poster={mediaImage("hero-film-poster") ?? still} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,12,9,0.9)_0%,rgba(17,12,9,0.55)_45%,rgba(17,12,9,0.15)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(17,12,9,0.96)_0%,rgba(17,12,9,0.4)_40%,transparent_70%)]" />
    </div>
  );
}
