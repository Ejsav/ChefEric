"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The fork's companions. The fork itself is the native cursor (CSS in
// app/globals.css, artwork from scripts/cursor.mjs), so it never lags and
// never depends on this script. What a static cursor cannot do lives here:
//  - a press on anything you can act on leaves four tine marks and a ring
//    at the exact point of contact (skipped with reduced motion);
//  - over photographs it carries a small label ("View") beside the handle;
//  - [data-magnetic] actions lean towards it (full tier, motion allowed);
//  - while you drag-select text it shows the text cursor;
//  - the hover and press artwork is fetched early, so no state ever flashes
//    the system arrow on first use.
// Mouse and pen only; touch is left entirely to the browser.

// Keep in step with the cursor rules in app/globals.css.
const INTERACTIVE =
  'a[href], button, [role="button"], [role="link"], [role="tab"], [role="radio"], [role="checkbox"], [role="switch"], [role="menuitem"], [role="option"], summary, label, select, input:is([type="checkbox"], [type="radio"], [type="range"], [type="submit"], [type="button"], [type="reset"], [type="color"], [type="file"], [type="image"]), [data-cursor-label]';
const TEXT_ENTRY =
  'input:not([type="checkbox"], [type="radio"], [type="range"], [type="submit"], [type="button"], [type="reset"], [type="color"], [type="file"], [type="image"], [type="hidden"]), textarea, [contenteditable]:not([contenteditable="false"])';

// Where the four tines touch, in fork space (CSS px from the hotspot, before
// the fork's -38° lean): the tine centres from scripts/cursor.mjs.
const TINES = [-2.715, -0.905, 0.905, 2.715];

export function Cursor() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const reset = useRef<() => void>(() => {});
  const pathname = usePathname();

  // A new page: whatever the label was riding on has gone.
  useEffect(() => reset.current(), [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(any-pointer: fine)").matches) return;
    const root = document.documentElement;
    const label = labelRef.current!;
    const text = label.firstElementChild as HTMLElement;
    const calm = () => root.dataset.tier === "still" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const magnetic = root.dataset.tier === "full";

    // Fetch the other two states at this display's density, once the page has settled.
    const density = Math.min(3, Math.max(1, Math.round(window.devicePixelRatio || 1)));
    const warm = () => {
      for (const name of ["fork-hover", "fork-press"]) {
        const img = new Image();
        img.src = `/cursor/${name}${density === 1 ? "" : `@${density}x`}.png`;
      }
    };
    const idle = window.setTimeout(warm, 900);

    let x = -999;
    let y = -999;
    let labelled: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;
    let selecting = false;
    let pressingText = false;

    const place = () => { label.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
    const setLabel = (el: HTMLElement | null) => {
      if (el === labelled) return;
      labelled = el;
      if (el) {
        text.textContent = el.dataset.cursorLabel ?? "";
        place();
      }
      label.dataset.on = el ? "true" : "false";
    };
    const setMagnet = (el: HTMLElement | null) => {
      if (el === magnet) return;
      if (magnet) magnet.style.translate = "";
      magnet = el && magnetic && !calm() ? el : null;
    };
    const pull = () => {
      if (!magnet) return;
      const b = magnet.getBoundingClientRect();
      const k = Number(magnet.dataset.magnetic) || 0.25;
      magnet.style.translate = `${(x - (b.left + b.width / 2)) * k}px ${(y - (b.top + b.height / 2)) * k}px`;
    };
    const mouse = (e: PointerEvent) => e.pointerType === "mouse" || e.pointerType === "pen";

    const onMove = (e: PointerEvent) => {
      if (!mouse(e)) return;
      x = e.clientX;
      y = e.clientY;
      if (labelled) place();
      pull();
    };
    const onOver = (e: PointerEvent) => {
      if (!mouse(e)) return;
      const t = e.target as Element;
      setLabel(t.closest<HTMLElement>("[data-cursor-label]"));
      setMagnet(t.closest<HTMLElement>("[data-magnetic]"));
    };
    const clear = () => { setLabel(null); setMagnet(null); };

    const onDown = (e: PointerEvent) => {
      if (!mouse(e) || e.button !== 0) return;
      const t = e.target as Element;
      const typing = !!t.closest(TEXT_ENTRY);
      const action = t.closest(INTERACTIVE);
      pressingText = !action && !typing;
      if (!action || typing || calm() || action.matches(':disabled, [aria-disabled="true"], [aria-busy="true"]')) return;
      contact(e.clientX, e.clientY, t.closest("dialog[open]") ?? document.body);
    };
    const onSelection = () => {
      if (!pressingText) return;
      const s = document.getSelection();
      const on = !!s && !s.isCollapsed;
      if (on === selecting) return;
      selecting = on;
      root.toggleAttribute("data-fork-selecting", on);
    };
    const onUp = () => {
      pressingText = false;
      if (!selecting) return;
      selecting = false;
      root.removeAttribute("data-fork-selecting");
    };

    // Scrolling moves the page under a still pointer: look again at what is there.
    let frame = 0;
    const onScroll = () => {
      if (frame || x < 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = document.elementFromPoint(x, y);
        setLabel(el?.closest<HTMLElement>("[data-cursor-label]") ?? null);
        setMagnet(el?.closest<HTMLElement>("[data-magnetic]") ?? null);
      });
    };

    reset.current = clear;
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("selectionchange", onSelection);
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", clear);
    root.addEventListener("pointerleave", clear);
    return () => {
      reset.current = () => {};
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      clear();
      onUp();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("selectionchange", onSelection);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", clear);
      root.removeEventListener("pointerleave", clear);
    };
  }, []);

  return (
    <span ref={labelRef} aria-hidden className="fork-label" data-on="false">
      <span />
    </span>
  );
}

/** Four tine marks and a ring where the fork met the plate. Self-removing. */
function contact(x: number, y: number, host: Element) {
  const mark = document.createElement("span");
  mark.className = "fork-contact";
  mark.setAttribute("aria-hidden", "true");
  mark.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  const set = document.createElement("span");
  set.className = "fork-contact__set";
  for (const t of TINES) {
    const dot = document.createElement("i");
    dot.style.left = `${t}px`;
    dot.style.top = `${t === TINES[0] || t === TINES[3] ? 0.9 : 0.4}px`;
    set.appendChild(dot);
  }
  set.appendChild(document.createElement("b"));
  mark.appendChild(set);
  host.appendChild(mark);
  window.setTimeout(() => mark.remove(), 700);
}
