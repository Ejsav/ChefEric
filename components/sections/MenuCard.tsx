"use client";
import { useId, useState } from "react";
import type { Menu } from "@/content/menus";
import { Monogram } from "@/components/ui/Monogram";
import { Plate } from "@/components/ui/Plate";
import { Cta } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// The menu as an object: a printed card on heavy paper, the way it sits at
// each guest's place. Tabs switch between sample menus; the card re-sets
// itself line by line, and the signature dish photograph changes with it.
export function MenuCard({ menus, compact = false }: { menus: Menu[]; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const menu = menus[active]!;

  const select = (i: number) => {
    setActive(i);
    track("menu_view", { menu: menus[i]!.slug });
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + menus.length) % menus.length;
    select(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className={cn("grid gap-10", !compact && "lg:grid-cols-12 lg:gap-12")}>
      {/* min-w-0: lets the phone tab rail scroll inside its column instead of
          widening the grid (and the page) to fit every tab. */}
      <div className={cn("min-w-0", !compact && "lg:col-span-4")}>
        <div role="tablist" aria-label="Sample menus" className="-mx-[var(--gutter)] flex snap-x gap-x-6 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-y-1 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {menus.map((m, i) => (
            <button
              key={m.slug}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "group shrink-0 snap-start border-b py-3 text-left transition-colors duration-500 lg:border-b-0 lg:border-l lg:py-4 lg:pl-6",
                i === active ? "border-accent text-fg" : "border-transparent text-fg/55 hover:text-fg/85",
              )}
            >
              <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-fg-muted">{m.occasion}</span>
              <span className={cn("mt-1 block whitespace-nowrap font-display text-[1.35rem] leading-tight lg:whitespace-normal lg:text-[1.6rem]", i === active && "italic")}>{m.title}</span>
            </button>
          ))}
        </div>
        {!compact ? (
          <div className="mt-8 lg:mt-10 lg:max-w-[22rem]">
            <div key={menu.slug} className="animate-[fade-up_900ms_var(--ease-out-expo)_both]">
              <Plate
                tone={menu.dish.tone}
                slot={menu.dish.slot}
                alt={menu.dish.alt}
                label={menu.dish.label}
                ratio="aspect-[16/11] lg:aspect-[4/5]"
                reveal={false}
                sizes="(min-width: 1024px) 22rem, 100vw"
              />
            </div>
          </div>
        ) : null}
        <p className="mt-8 hidden max-w-xs text-sm text-fg-muted lg:block">
          Examples, not choices. Your menu is written after one conversation and cooked for nobody else.
        </p>
      </div>

      {/* The card */}
      <div className={cn("min-w-0", !compact && "lg:col-span-8")}>
        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${active}`}
          className="menu-paper relative mx-auto max-w-[34rem] px-7 py-12 text-center sm:px-14 sm:py-16"
        >
          <div key={menu.slug} className="menu-set">
            <Monogram className="mx-auto h-11 w-11 text-[rgb(var(--brass-deep))]" title="" />
            <p className="mt-6 text-[0.6rem] uppercase tracking-[0.34em] text-[rgb(98_84_70)]">{menu.season} · Sample</p>
            <h3 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-tight text-[rgb(var(--ink))]">{menu.title}</h3>
            <p className="mx-auto mt-4 max-w-sm font-display text-[1.02rem] italic leading-relaxed text-[rgb(74_62_50)]">{menu.intro}</p>
            <span aria-hidden className="mx-auto mt-8 block h-px w-12 bg-[rgb(var(--brass-deep)/0.6)]" />
            <ol className="mt-8 space-y-7">
              {menu.courses.map((c, i) => (
                <li key={c.label + c.dish} style={{ "--i": i } as React.CSSProperties} className="menu-line">
                  <p className="text-[0.58rem] uppercase tracking-[0.32em] text-[rgb(var(--brass-deep))]">{c.label}</p>
                  <p className="mt-1.5 font-display text-[1.18rem] leading-snug text-[rgb(var(--ink))]">{c.dish}</p>
                  {c.note ? <p className="mt-1 font-display text-[0.95rem] italic text-[rgb(98_84_70)]">{c.note}</p> : null}
                </li>
              ))}
            </ol>
            <span aria-hidden className="mx-auto mt-10 block h-px w-12 bg-[rgb(var(--brass-deep)/0.6)]" />
            <p className="mx-auto mt-6 max-w-xs text-[0.82rem] leading-relaxed text-[rgb(98_84_70)]">{menu.pairing}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <Cta href={`/inquire?setting=${menu.setting}&menu=${menu.slug}`} track="cta:menu-begin">Start from this menu</Cta>
          {compact ? null : <Cta href="/menus" variant="quiet" className="text-fg-muted">All sample menus</Cta>}
        </div>
      </div>
    </div>
  );
}
