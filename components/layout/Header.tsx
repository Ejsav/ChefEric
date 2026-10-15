"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { Monogram } from "@/components/ui/Monogram";
import { Ambience } from "@/components/system/Ambience";
import { TemplateNotice } from "@/components/layout/TemplateNotice";

// The header behaves like good front-of-house staff: present when you need
// it, gone when you are reading. Transparent over the hero, a smoked-glass
// bar once you move, hidden while scrolling down, back on the first scroll up.
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 240 && y > last.current);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Menu open: freeze page scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    const toggle = toggleRef.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>("a, button");
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !focusables?.length) return;
      const first = focusables[0]!;
      const lastEl = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        id="site-header"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-out-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open
            ? "border-b border-[rgba(237,229,214,0.08)] bg-[rgba(17,12,9,0.72)] backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <TemplateNotice />
        <div className="container-x flex h-[var(--nav-h)] items-center justify-between text-[rgb(var(--ivory))]">
          <Link href="/" className="group flex items-center gap-3">
            <Monogram className="h-10 w-10 text-[rgb(var(--brass))] transition-transform duration-1000 ease-out-expo group-hover:rotate-[-8deg]" title="" />
            <span className="sr-only whitespace-nowrap font-display text-[1.15rem] tracking-[0.02em] sm:not-sr-only lg:sr-only xl:not-sr-only">
              Eric Jokl
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-10">
            {nav.filter((i) => i.href !== "/inquire").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className={cn(
                  "link-underline whitespace-nowrap pb-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] transition-opacity duration-500",
                  pathname.startsWith(item.href) ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Ambience className="-mr-2" />
            <Link
              href="/inquire"
              data-magnetic="0.18"
              data-track="cta:header"
              className="whitespace-nowrap border border-[rgba(190,156,104,0.6)] px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.28em] transition-colors duration-700 ease-out-expo hover:border-[rgb(var(--brass))] hover:bg-[rgb(var(--brass))] hover:text-[rgb(var(--ink))]"
            >
              Request an evening
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
          <Ambience />
          <button
            ref={toggleRef}
            type="button"
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={cn("absolute h-px w-6 bg-current transition-transform duration-700 ease-out-expo", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-px w-6 bg-current transition-transform duration-700 ease-out-expo", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — a full-bleed curtain, not a drawer. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className={cn(
          "tone-dark grain fixed inset-0 z-40 flex-col justify-between overflow-hidden pt-[var(--header-h)] lg:hidden",
          open ? "flex" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="container-x mt-12 flex flex-col gap-2">
          {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[2.75rem] leading-[1.2] text-fg"
              style={{ animation: `menu-in 1s ${120 + i * 70}ms var(--ease-out-expo) both` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="container-x pb-10 text-eyebrow">Private Chef · New York · By arrangement</div>
        <style>{`@keyframes menu-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
      </div>
    </>
  );
}
