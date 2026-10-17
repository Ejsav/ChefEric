"use client";
import { useEffect, useRef, useState } from "react";
import { archive } from "@/content/archive";
import { Plate } from "@/components/ui/Plate";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

// The Making. On large screens the chapters travel horizontally while the page
// is pinned — reading a life left to right, like a contact sheet — with a
// rail of eras you can jump between. On phones and for reduced motion it
// becomes a vertical sequence with the same content and rhythm.
export function Archive() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Decide the layout first, then build the pinned scroll against the
  // layout that is actually on screen.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches && document.documentElement.dataset.tier !== "lite");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = section.current, tr = track.current;
    if (!pinned || !el || !tr) return;
    const distance = () => tr.scrollWidth - window.innerWidth;
    const lenis = getLenis();
    const sync = () => ScrollTrigger.update();
    lenis?.on("scroll", sync);
    const ctx = gsap.context(() => {
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 0.9,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.round(self.progress * (archive.length - 1))),
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
    }, el);
    ScrollTrigger.refresh();
    return () => { ctx.revert(); lenis?.off("scroll", sync); trigger.current = null; };
  }, [pinned]);

  const jump = (i: number) => {
    const st = trigger.current;
    if (!st) {
      document.getElementById(`era-${archive[i]!.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const y = st.start + (st.end - st.start) * (i / (archive.length - 1));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={section} aria-labelledby="archive-title" className="tone-dark relative overflow-hidden">
      <div className={cn("flex flex-col", pinned && "h-[100svh]")}>
        <div className="container-x flex items-end justify-between gap-8 pt-[clamp(6rem,10vw,9rem)] lg:pt-[calc(var(--header-h)+2.5rem)]">
          <div>
            <p className="text-eyebrow flex items-center gap-4"><span aria-hidden className="h-px w-10 bg-accent/60" />The Making</p>
            <h2 id="archive-title" className="text-h2 mt-6 max-w-[18ch]">Six chapters <span className="italic text-accent">of the craft.</span></h2>
          </div>
          {/* Era rail */}
          <nav aria-label="Chapters" className="hidden lg:block">
            <ol className="flex gap-6">
              {archive.map((e, i) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={pinned && i === active ? "step" : undefined}
                    className={cn("group flex flex-col items-start gap-2 text-left transition-colors duration-500", pinned && i === active ? "text-fg" : "text-fg/40 hover:text-fg/80")}
                  >
                    <span className="font-display text-sm italic">{e.numeral}</span>
                    <span className="text-[0.6rem] uppercase tracking-[0.24em]">{e.era}</span>
                    <span aria-hidden className={cn("h-px w-full origin-left bg-accent transition-transform duration-700 ease-out-expo", pinned && i === active ? "scale-x-100" : "scale-x-0")} />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className={cn(pinned ? "flex flex-1 items-center" : "")}>
          <div ref={track} className={cn(pinned ? "flex w-max gap-[6vw] pl-[var(--gutter)] pr-[12vw] will-change-transform" : "container-x")}>
            {archive.map((e, i) => (
              <article
                key={e.id}
                id={`era-${e.id}`}
                aria-labelledby={`era-${e.id}-title`}
                className={cn(
                  "grid scroll-mt-[var(--header-h)] gap-8",
                  pinned ? "w-[min(68vw,62rem)] grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] items-center gap-12" : "border-t border-line py-16 md:grid-cols-2 md:gap-12",
                )}
              >
                <div className="relative">
                  <span aria-hidden className="pointer-events-none absolute -bottom-[0.32em] -right-[0.12em] z-10 select-none font-display text-[clamp(4.5rem,8vw,8rem)] italic leading-none text-accent/90">
                    {e.numeral}
                  </span>
                  <Plate {...e.plate} ratio={pinned ? "aspect-[4/5] max-h-[58svh]" : "aspect-[4/5]"} sizes="(min-width: 1024px) 30vw, 100vw" />
                </div>
                <div data-reveal style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as React.CSSProperties}>
                  <p className="text-eyebrow">{e.era}{e.years ? ` · ${e.years}` : ""}</p>
                  <h3 id={`era-${e.id}-title`} className="text-h1 mt-5">{e.title}</h3>
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.26em] text-accent">{e.place}</p>
                  <p className="mt-8 max-w-[32rem] text-fg/80">{e.body}</p>
                  <div className="mt-10 max-w-[32rem] border-t border-line pt-6">
                    <p className="text-[0.62rem] uppercase tracking-[0.26em] text-fg-muted">The principle</p>
                    <p className="mt-3 font-display text-[1.5rem] italic leading-snug text-fg">&ldquo;{e.lesson}&rdquo;</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {pinned ? (
          <div className="container-x pb-8">
            <div className="h-px bg-line">
              <div className="h-px origin-left bg-accent transition-transform duration-500 ease-out-expo" style={{ transform: `scaleX(${(active + 1) / archive.length})` }} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
