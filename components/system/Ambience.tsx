"use client";
import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Optional music: an Italian kitchen soundtrack (site.ambience), looping.
//  - Always off until the visitor asks; nothing downloads before that.
//  - One player for the whole site: the desktop and phone buttons share it,
//    and it keeps playing across page changes (the header never unmounts).
//  - A plain <audio> element, started directly inside the tap. (Routing it
//    through Web Audio made iPhones obey the silent switch, and any await
//    before play() lets Safari decide the tap no longer counts.)
//  - Fades in and out where the browser allows volume control. iOS fixes
//    media volume at the device level, so the file itself is mastered quiet
//    (about -22 LUFS) and sits in the background at full volume there.
//  - Goes quiet while the tab is hidden and picks up again on return.
type State = "off" | "loading" | "on" | "error";

const LEVEL = 0.85;
let state: State = "off";
const listeners = new Set<() => void>();
const emit = (next: State) => { state = next; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

let audio: HTMLAudioElement | null = null;
let fadeFrame = 0;
let errorTimer = 0;

function element(): HTMLAudioElement {
  if (audio) return audio;
  const a = document.createElement("audio");
  a.id = "site-ambience";
  a.src = site.ambience;
  a.loop = true;
  a.preload = "auto";
  a.hidden = true;
  a.setAttribute("aria-hidden", "true");
  document.body.appendChild(a);
  audio = a;
  document.addEventListener("visibilitychange", () => {
    if (state !== "on" || !audio) return;
    if (document.hidden) fadeTo(0, 400, () => audio?.pause());
    else audio.play().then(() => fadeTo(LEVEL, 1200)).catch(() => emit("off"));
  });
  return a;
}

/** Ramp the element's volume (a no-op on iOS, where volume is fixed). */
function fadeTo(level: number, ms: number, done?: () => void) {
  const a = audio;
  if (!a) return;
  cancelAnimationFrame(fadeFrame);
  const from = a.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    try { a.volume = from + (level - from) * t; } catch {}
    if (t < 1) fadeFrame = requestAnimationFrame(step);
    else done?.();
  };
  fadeFrame = requestAnimationFrame(step);
}

function turnOn() {
  const a = element();
  cancelAnimationFrame(fadeFrame);
  window.clearTimeout(errorTimer);
  try { a.volume = 0; } catch {}
  emit("loading");
  // play() is called synchronously, inside the tap, with nothing awaited first.
  const playing = a.play();
  playing
    .then(() => {
      if (state !== "loading") return; // turned off again while it loaded
      emit("on");
      fadeTo(LEVEL, 2400);
    })
    .catch((err: unknown) => {
      console.warn("[sound] could not start the music:", err);
      track("sound_error", { name: err instanceof Error ? err.name : "unknown" });
      emit("error");
      errorTimer = window.setTimeout(() => { if (state === "error") emit("off"); }, 3200);
    });
}

function turnOff() {
  emit("off");
  fadeTo(0, 900, () => { if (state === "off") audio?.pause(); });
}

export function Ambience({ className }: { className?: string }) {
  const current = useSyncExternalStore(subscribe, () => state, () => "off" as State);
  const on = current === "on" || current === "loading";

  function toggle() {
    track("sound_toggle", { on: !on });
    if (on) turnOff();
    else turnOn();
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-busy={current === "loading"}
        aria-label={on ? "Turn sound off" : "Turn sound on"}
        title={current === "error" ? "The music could not start" : "Italian kitchen music"}
        className={cn("group flex h-11 items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.28em] opacity-70 transition-opacity duration-500 hover:opacity-100", className)}
      >
        <span aria-hidden className="flex h-3 items-end gap-[3px]">
          {[0.55, 1, 0.7, 0.85].map((h, i) => (
            <span
              key={i}
              className={cn("w-px origin-bottom bg-current", current === "on" ? "sound-bar" : "", current === "loading" ? "animate-pulse" : "")}
              style={{ height: `${(on ? h : h * 0.45) * 100}%`, animationDelay: `${i * 140}ms`, transition: "height 600ms var(--ease-out-expo)" }}
            />
          ))}
        </span>
        <span className="hidden lg:inline">{current === "error" ? "No sound" : on ? "Sound on" : "Sound"}</span>
      </button>
      {/* Announced politely if playback is refused; outside the button, whose content is its name. */}
      <span aria-live="polite" className="sr-only">{current === "error" ? "The music could not start." : ""}</span>
    </>
  );
}
