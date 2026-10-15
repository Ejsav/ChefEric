"use client";
import { useEffect, useRef, useState } from "react";

// The silent hero loop. Mounted only on full-tier devices (lib/boot.ts):
// slow connections, Save-Data and reduced motion keep the still. It pauses
// while the hero is off screen or the tab is hidden, and fades in only once
// it can actually play, so the still never flashes to black.
export function HeroFilm({ webm, mp4, poster }: { webm?: string; mp4?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.tier === "full") setEnabled(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;
    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => { onScreen = !!e?.isIntersecting; sync(); });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-[68%_35%] transition-opacity duration-[1600ms] ease-out-expo"
      style={{ opacity: ready ? 1 : 0 }}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      onPlaying={() => setReady(true)}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}
