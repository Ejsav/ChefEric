"use client";
import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Optional music: an Italian kitchen soundtrack (site.ambience), looping.
//  - Always off until the visitor asks; nothing downloads before that.
//  - One player for the whole site: the desktop and phone buttons share it,
//    and it keeps playing across page changes (the header never unmounts).
//  - Fades in and out rather than switching, through Web Audio so the fade
//    works on iOS too (which ignores an audio element's volume).
//  - Goes quiet while the tab is hidden and picks up again on return.
type State = "off" | "loading" | "on";

const LEVEL = 0.45; // background, not foreground
let state: State = "off";
const listeners = new Set<() => void>();
const emit = (next: State) => { state = next; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

type Player = { audio: HTMLAudioElement; ctx?: AudioContext; gain?: GainNode };
let player: Player | null = null;
let pauseTimer = 0;

function ensure(): Player {
  if (player) return player;
  const audio = new Audio(site.ambience);
  audio.loop = true;
  audio.preload = "auto";
  player = { audio };
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    player = { audio, ctx, gain };
  } catch {
    audio.volume = 0; // no Web Audio: plain element volume, no fade
  }
  document.addEventListener("visibilitychange", () => {
    if (state !== "on" || !player) return;
    if (document.hidden) {
      fadeTo(0, 0.4);
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(() => player?.audio.pause(), 450);
    } else {
      window.clearTimeout(pauseTimer);
      void player.ctx?.resume();
      player.audio.play().then(() => fadeTo(LEVEL, 1.2)).catch(() => emit("off"));
    }
  });
  return player;
}

function fadeTo(level: number, seconds: number) {
  const p = player;
  if (!p) return;
  if (p.ctx && p.gain) {
    const g = p.gain.gain;
    const now = p.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(level, now + seconds);
  } else {
    p.audio.volume = level;
  }
}

async function turnOn() {
  const p = ensure();
  window.clearTimeout(pauseTimer);
  emit("loading");
  try {
    await p.ctx?.resume();
    await p.audio.play();
    fadeTo(LEVEL, 2.4);
    emit("on");
  } catch {
    emit("off"); // blocked or failed to load: the button simply stays off
  }
}

function turnOff() {
  emit("off");
  fadeTo(0, 0.9);
  window.clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(() => player?.audio.pause(), 950);
}

export function Ambience({ className }: { className?: string }) {
  const current = useSyncExternalStore(subscribe, () => state, () => "off" as State);
  const on = current !== "off";

  function toggle() {
    track("sound_toggle", { on: !on });
    if (on) turnOff();
    else void turnOn();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-busy={current === "loading"}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title="Italian kitchen music"
      className={cn("group flex h-11 items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.28em] opacity-70 transition-opacity duration-500 hover:opacity-100", className)}
    >
      <span aria-hidden className="flex h-3 items-end gap-[3px]">
        {[0.55, 1, 0.7, 0.85].map((h, i) => (
          <span
            key={i}
            className={cn("w-px origin-bottom bg-current", current === "on" ? "sound-bar" : "")}
            style={{ height: `${(on ? h : h * 0.45) * 100}%`, animationDelay: `${i * 140}ms`, transition: "height 600ms var(--ease-out-expo)" }}
          />
        ))}
      </span>
      <span className="hidden lg:inline">{on ? "Sound on" : "Sound"}</span>
    </button>
  );
}
