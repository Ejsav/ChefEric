"use client";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

// Weighted scroll. (GSAP is not imported here so it only loads on pages
// that use ScrollTrigger; those subscribe to Lenis themselves.)
// lerp 0.085 reads like a heavy door on good hinges —
// slower than default, never sluggish. Full tier only (lib/boot.ts): reduced
// motion, slow or low-powered devices and touch keep native scrolling
// (native momentum on phones is already better than anything we can fake),
// and it is loaded only where it runs, so phones never download it.
// It only runs frames while the page is actually gliding: idle, it sleeps,
// and a wheel turn or a programmatic scroll wakes it.
const IDLE_FRAMES = 30;

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse || document.documentElement.dataset.tier !== "full") return;

    let raf = 0;
    let idle = 0;
    let lenis: import("lenis").default | null = null;
    let cancelled = false;
    const tick = (time: number) => {
      lenis!.raf(time);
      idle = lenis!.isScrolling ? 0 : idle + 1;
      raf = idle > IDLE_FRAMES ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      idle = 0;
      if (raf || !lenis) return;
      lenis.time = 0; // the first frame after a sleep must not count the sleep as motion
      raf = requestAnimationFrame(tick);
    };
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: { offset: -40 } });
      // Scrolls started from code (anchors, the request's steps) wake it too.
      const scrollTo = lenis.scrollTo.bind(lenis);
      lenis.scrollTo = ((...args: Parameters<typeof scrollTo>) => { wake(); return scrollTo(...args); }) as typeof scrollTo;
      setLenis(lenis);
      wake();
    });
    window.addEventListener("wheel", wake, { passive: true, capture: true });
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", wake, { capture: true });
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
