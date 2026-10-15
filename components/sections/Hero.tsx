import { Cta } from "@/components/ui/Cta";
import { HeroLight } from "@/components/system/HeroLight";
import Image from "next/image";
import { HeroMedia } from "@/components/system/HeroMedia";
import { mediaImage } from "@/lib/media";
import { cn } from "@/lib/utils";

// The hero is a private room with the lights low. One warm source —
// a candle just out of frame — breathes beneath the name. When the hero
// still or film exists (public/media/hero-still.*, hero-film.*) it sits
// behind the same atmosphere; until then the room is type and light alone.
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  // With Eric's figure standing on the right, the actions move under the
  // lead so they never sit on top of him.
  const figureSrc = mediaImage("hero-figure");
  const figure = !!figureSrc;
  return (
    <section id="hero" aria-labelledby="hero-title" className="tone-dark grain relative isolate flex min-h-[max(100svh,640px)] flex-col overflow-hidden">
      {/* Photograph or film, when present */}
      <HeroMedia />
      {/* Atmosphere */}
      <HeroLight targetId="hero" />
      <div aria-hidden className="hero-lights absolute inset-0 -z-10">
        <div className="hero-light absolute inset-0"><div className="candle absolute inset-x-[-10%] bottom-[-35%] h-[95%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.34),rgba(150,84,38,0.14)_42%,transparent_72%)]" /></div>
        <div className="drift absolute left-[8%] top-[10%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(237,229,214,0.05),transparent)]" />
        <div className="absolute right-[-15%] top-[-20%] h-[70%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(108,30,34,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_40%,rgba(8,6,4,0.85)_100%)]" />
      </div>

      <div className={cn("container-x relative flex flex-1 flex-col justify-end pb-10 md:pb-14 md:pt-[calc(var(--header-h)+3rem)]", figureSrc ? "pt-[calc(var(--header-h)+0.5rem)]" : "pt-[calc(var(--header-h)+3rem)]")}>
        {/* Phones: Eric stands above the name, fading into the room. */}
        {figureSrc ? (
          <div aria-hidden className="hero-fade relative -mb-6 h-[min(46svh,26rem)] md:hidden" style={d(150)}>
            <Image
              src={figureSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-contain object-bottom [filter:brightness(0.8)_contrast(1.06)_saturate(0.9)_sepia(0.12)] [mask-image:linear-gradient(to_top,transparent_0%,black_30%)]"
            />
          </div>
        ) : null}
        <p className="hero-fade text-eyebrow flex items-center gap-4" style={d(300)}>
          <span aria-hidden className="hero-draw inline-block h-px w-10 bg-accent" style={d(200)} />
          <span>Private Chef<span className="hidden sm:inline"> · New York &amp; Beyond</span></span>
        </p>

        <h1 id="hero-title" className="text-display hero-name hero-depth mt-8 md:mt-10">
          <span className="hero-rise line-mask"><span style={d(350)}>
            <span className="mr-[0.18em] align-[0.62em] font-display text-[0.2em] italic tracking-normal text-accent">Chef</span>
            Eric
          </span></span>
          <span className="hero-rise line-mask"><span style={d(480)} className="pl-[0.7em] italic md:pl-[1.4em]">Jokl</span></span>
          <span className="sr-only">, private chef in New York</span>
        </h1>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <p className="hero-fade text-lead max-w-[30rem] md:col-span-6 md:col-start-1" style={d(650)}>
            Private dinners written once, for one table. Modern coastal and Italian
            cooking — served in your home, aboard your yacht, on your island.
          </p>
          <div className={cn("hero-fade flex flex-wrap items-center gap-x-10 gap-y-6", figure ? "md:col-span-12" : "md:col-span-6 md:justify-end")} style={d(800)}>
            <Cta href="/inquire" track="cta:hero-request">Request an evening</Cta>
            <Cta href="/menus" variant="quiet" track="cta:hero-menus">See sample menus</Cta>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <div aria-hidden className="hero-draw h-px bg-line" style={d(700)} />
          <div className="hero-fade mt-5 flex items-center justify-between text-[0.66rem] uppercase tracking-[0.28em] text-fg-muted" style={d(1000)}>
            <span>Dinners · Yachts · Islands · Classes</span>
            <span className="hidden md:inline">New York · The Hamptons · The Islands</span>
            <span className="flex items-center gap-3">
              Scroll
              <span aria-hidden className="relative block h-6 w-px overflow-hidden bg-line">
                <span className="scroll-cue absolute inset-0 bg-accent" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
