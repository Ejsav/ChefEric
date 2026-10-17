"use client";
import { useEffect, useState } from "react";

// Production notes: a presenter's switch for walking a client through the
// template. When on, every photograph slot shows the file it expects and
// whether it has been delivered (see SlotNote in components/ui/Plate.tsx).
// Toggle here, with the N key, or open any page with ?notes=1.
const KEY = "ej:notes";

function apply(on: boolean) {
  document.documentElement.dataset.notes = on ? "on" : "off";
  try { sessionStorage.setItem(KEY, on ? "1" : "0"); } catch {}
}

export function NotesToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("notes");
    let initial = false;
    try { initial = sessionStorage.getItem(KEY) === "1"; } catch {}
    const start = q === null ? initial : q !== "0";
    setOn(start);
    apply(start);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      const next = document.documentElement.dataset.notes !== "on";
      setOn(next);
      apply(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => { setOn(!on); apply(!on); }}
      className="link-underline pb-0.5 uppercase tracking-[0.22em] hover:text-fg"
    >
      Production notes · {on ? "On" : "Off"}
    </button>
  );
}
