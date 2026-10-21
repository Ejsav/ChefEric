"use client";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

// Weighted scroll. (GSAP is not imported here so it only loads on pages
// that use ScrollTrigger; those subscribe to Lenis themselves.)
// lerp 0.085 reads like a heavy door on good hinges —
// slower than default, never sluggish. Disabled for reduced motion and touch
// (native momentum on phones is already better than anything we can fake),
// and loaded only where it runs, so phones never download it.
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: { offset: -40 } });
      setLenis(lenis);
      const tick = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
