import Link from "next/link";
import { experiences } from "@/content/experiences";
import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Arrow, Cta } from "@/components/ui/Cta";
import { home } from "@/content/home";

// What the chef offers, at a glance: four photographs, four lines, four
// price guides. Each card opens its full description on /experiences.
export function ExperiencesPreview({ index = "II" }: { index?: string }) {
  return (
    <section aria-labelledby="offer-title" className="tone-dark section relative">
      <div className="container-x">
        <div className="grid gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index={index}>The Experiences</Eyebrow>
            <h2 id="offer-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>{home.experiences.lines[0]}</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}>
                <span className="italic text-accent">{home.experiences.lines[1]}</span>
              </span>
            </h2>
          </div>
          <p className="text-lead self-end text-fg-muted md:col-span-4 md:col-start-9" data-reveal>
            {home.experiences.lead}
          </p>
        </div>

        {/* Phones: a swipeable rail. Tablet and up: a grid whose cards align on the price line. */}
        <ul className="-mx-[var(--gutter)] mt-14 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-20 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {experiences.map((e, i) => (
            <li key={e.slug} className="w-[80vw] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <Link href={`/experiences#${e.slug}`} className="group flex h-full flex-col" data-track={`cta:home-experience-${e.slug}`}>
                <Plate {...e.plate} reveal={false} cursorLabel="View" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw" className="transition-transform duration-[1200ms] ease-out-expo group-hover:-translate-y-1.5" />
                <p className="mt-6 flex items-center gap-3">
                  <span className="font-display text-base italic text-accent">{e.numeral}</span>
                  <span aria-hidden className="h-px w-8 bg-accent/60" />
                </p>
                <h3 className="mt-4 font-display text-[1.65rem] leading-tight">{e.name}</h3>
                <p className="mt-3 flex-1 text-fg-muted">{e.teaser}</p>
                <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[0.7rem] uppercase tracking-[0.22em]">
                  <span className="text-fg/85">{e.from}</span>
                  <Arrow className="text-fg-muted transition-all duration-700 ease-out-expo group-hover:translate-x-1 group-hover:text-accent" />
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6" data-reveal>
          <Cta href="/inquire" track="cta:home-experiences-request">Request an evening</Cta>
          <Cta href="/experiences" variant="quiet" className="text-fg-muted">All experiences</Cta>
        </div>
      </div>
    </section>
  );
}
