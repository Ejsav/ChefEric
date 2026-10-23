"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { deliveredShots, packRows, type Shot } from "@/content/gallery";
import { getLenis } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// The gallery grid and its lightbox.
//  - Desktop: justified rows. Every frame in a row shares one height and keeps
//    its own shape, so no photograph is ever cropped to fit the grid.
//  - Phone: the same frames, in order, as a two-column contact sheet.
//  - Any frame opens the lightbox: a modal dialog with arrow keys, Home/End,
//    Escape, swipe, a counter, the caption, and focus returned to the frame
//    it came from.
type Ready = Shot & { src: string };

const TARGET = 2.4;
const pad = (n: number) => String(n).padStart(2, "0");

/** `eager`: how many leading frames load immediately (those above the fold). */
export function GalleryGrid({ count, note, eager = 0 }: { count?: number; note?: React.ReactNode; eager?: number }) {
  const all = deliveredShots();
  const shots = count ? all.slice(0, count) : all;
  const rows = packRows(shots, TARGET);
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const last = rows[rows.length - 1];
  const lastSum = last ? last.reduce((t, s) => t + s.ratio, 0) : TARGET;
  const shortLast = rows.length > 1 && lastSum < TARGET * 0.8;

  let i = -1;
  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-auto md:space-y-6">
        {rows.map((row, r) => {
          const short = shortLast && r === rows.length - 1;
          return (
            <div
              key={r}
              className={cn("contents md:flex md:gap-6", short && "md:items-end")}
              style={short ? ({ "--row": `${(lastSum / TARGET) * 100}%` } as React.CSSProperties) : undefined}
            >
              <div className={cn("contents md:flex md:gap-6", short ? "md:w-[var(--row)] md:shrink-0" : "md:w-full")}>
                {row.map((s) => {
                  i += 1;
                  const at = i;
                  return (
                    <figure
                      key={s.slot}
                      // Frames above the fold paint at once; the rest fade in as they arrive.
                      data-reveal={at < eager ? undefined : "fade"}
                      data-cursor-label="View"
                      className="group/plate relative mb-3 break-inside-avoid overflow-hidden bg-bg-elevated sm:mb-4 md:mb-0"
                      style={{ flex: `${s.ratio} 1 0%`, aspectRatio: `${s.ratio}`, "--reveal-delay": `${(at % 3) * 80}ms` } as React.CSSProperties}
                    >
                      <Image
                        src={s.src}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 50vw"
                        priority={at < eager}
                        className="object-cover transition-transform duration-[1600ms] ease-out-expo group-hover/plate:scale-[1.03]"
                      />
                      <div aria-hidden className="pointer-events-none absolute inset-2 border border-[rgba(237,229,214,0.12)] md:inset-3" />
                      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/5 bg-[linear-gradient(0deg,rgba(10,7,5,0.72),transparent)] sm:block" />
                      <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 hidden text-[0.64rem] uppercase tracking-[0.24em] text-[rgba(237,229,214,0.9)] sm:block md:bottom-6 md:left-6">
                        {s.label}
                      </figcaption>
                      <button
                        type="button"
                        onClick={(e) => { trigger.current = e.currentTarget; setOpen(at); track("gallery_open", { slot: s.slot }); }}
                        className="absolute inset-0 focus-visible:outline-offset-[-6px]"
                      >
                        <span className="sr-only">Enlarge photograph {at + 1} of {shots.length}: {s.label}</span>
                      </button>
                    </figure>
                  );
                })}
              </div>
              {short && note ? <div className="hidden self-end md:block md:flex-1">{note}</div> : null}
            </div>
          );
        })}
      </div>
      {note && !shortLast ? <div className="mt-10 md:max-w-md">{note}</div> : null}
      {note && shortLast ? <div className="mt-8 md:hidden">{note}</div> : null}
      <Lightbox shots={shots} index={open} onIndex={setOpen} onClosed={() => trigger.current?.focus()} />
    </>
  );
}

function Lightbox({ shots, index, onIndex, onClosed }: { shots: Ready[]; index: number | null; onIndex: (i: number | null) => void; onClosed: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  const total = shots.length;

  const go = useCallback((to: number, how: string) => {
    if (index === null) return;
    const next = (to + total) % total;
    onIndex(next);
    track("gallery_nav", { how, slot: shots[next]!.slot });
  }, [index, total, onIndex, shots]);

  // Open: show the dialog and hold the page still. The cleanup releases the
  // page however the lightbox ends (closed, a route change, unmounted), so
  // the site can never be left unable to scroll.
  const isOpen = index !== null;
  useEffect(() => {
    const d = ref.current;
    if (!isOpen || !d) return;
    if (!d.open) d.showModal();
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      if (d.open && d.isConnected) d.close();
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const onClose = () => {
    onIndex(null);
    onClosed();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (index === null) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1, "key"); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1, "key"); }
    else if (e.key === "Home") { e.preventDefault(); go(0, "key"); }
    else if (e.key === "End") { e.preventDefault(); go(total - 1, "key"); }
  };

  const current = index === null ? null : shots[index]!;
  // The frame and its neighbours are mounted, so stepping through is instant.
  const near = index === null ? [] : [index - 1, index, index + 1].map((n) => (n + total) % total);

  return (
    <dialog
      ref={ref}
      aria-label="Gallery"
      onClose={onClose}
      onKeyDown={onKey}
      className="lightbox m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-[rgb(10_7_5/0.97)] p-0 text-[rgb(var(--ivory))] backdrop:bg-black/70"
    >
      {current ? (
        <div className="tone-dark flex h-full flex-col bg-transparent">
          <div className="container-x flex h-16 shrink-0 items-center justify-between text-[0.66rem] uppercase tracking-[0.26em] text-fg-muted">
            <button type="button" onClick={() => ref.current?.close()} className="-ml-3 inline-flex h-11 items-center gap-3 px-3 hover:text-fg">
              <span aria-hidden className="relative block h-3 w-3">
                <span className="absolute left-0 top-1/2 h-px w-3 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-3 -rotate-45 bg-current" />
              </span>
              Close
            </button>
            <span aria-hidden><span className="text-fg">{pad(index! + 1)}</span> / {pad(total)}</span>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
            onPointerDown={(e) => { if (e.pointerType !== "mouse") swipe.current = e.clientX; }}
            onPointerUp={(e) => {
              if (swipe.current === null) return;
              const dx = e.clientX - swipe.current;
              swipe.current = null;
              if (Math.abs(dx) > 48) go(index! + (dx < 0 ? 1 : -1), "swipe");
            }}
          >
            {near.map((n) => {
              const s = shots[n]!;
              const on = n === index;
              return (
                <div key={s.slot} aria-hidden={!on} className={cn("pointer-events-none absolute inset-x-4 inset-y-2 transition-opacity duration-500 md:inset-x-24", on ? "opacity-100" : "opacity-0")}>
                  <Image src={s.src} alt={on ? s.alt : ""} fill loading="eager" sizes="(min-width: 768px) 80vw, 100vw" className="object-contain" />
                </div>
              );
            })}
            <button type="button" onClick={() => go(index! - 1, "button")} className="absolute left-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center text-fg-muted transition-colors hover:text-fg md:flex" aria-label="Previous photograph">
              <Chevron className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(index! + 1, "button")} className="absolute right-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center text-fg-muted transition-colors hover:text-fg md:flex" aria-label="Next photograph">
              <Chevron />
            </button>
          </div>

          <div className="container-x flex shrink-0 items-end justify-between gap-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
            <div aria-live="polite" aria-atomic="true" className="min-w-0">
              <p className="sr-only">Photograph {index! + 1} of {total}.</p>
              <p className="text-eyebrow">{current.label}</p>
              <p className="mt-2 max-w-2xl font-display text-[1.15rem] italic leading-snug text-fg/90 md:text-[1.3rem]">{current.caption}</p>
            </div>
            <div className="flex shrink-0 md:hidden">
              <button type="button" onClick={() => go(index! - 1, "button")} className="flex h-11 w-11 items-center justify-center text-fg-muted" aria-label="Previous photograph"><Chevron className="rotate-180" /></button>
              <button type="button" onClick={() => go(index! + 1, "button")} className="flex h-11 w-11 items-center justify-center text-fg-muted" aria-label="Next photograph"><Chevron /></button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 24" className={cn("h-6 w-3", className)} fill="none" stroke="currentColor" strokeWidth="1"><path d="M1 1l10 11L1 23" /></svg>
  );
}
