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
  // On the offer and its legal pages, the standing action is the offer's own.
  const offerSide = ["/your-site", "/terms", "/privacy"].some((p) => pathname.startsWith(p));
  // Pages that open on paper (linen) need the smoked bar from the start, or
  // ivory navigation would sit on an ivory page.
  const paper = ["/terms", "/privacy"].includes(pathname);
  const solid = scrolled || paper;
  const action = offerSide ? { href: "/your-site/start", label: "Start your website", track: "cta:header-start" } : { href: "/inquire", label: "Request an evening", track: "cta:header" };
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);

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

  // Menu open: a native modal dialog. The browser makes the rest of the page
  // inert, keeps focus inside and closes it on Escape; this freezes page
  // scroll, starts on the first link and hands focus back to the toggle.
  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;
    const lenis = getLenis();
    const toggle = toggleRef.current;
    if (!menu.open) menu.showModal();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    menu.querySelector<HTMLElement>("nav a")?.focus();
    return () => {
      if (menu.open) menu.close();
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
          solid && !open
            ? cn("border-b border-[rgba(237,229,214,0.08)]", paper ? "bg-[rgb(17,12,9)]" : "bg-[rgba(17,12,9,0.72)] backdrop-blur-xl")
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
              href={action.href}
              data-magnetic="0.18"
              data-track={action.track}
              className="whitespace-nowrap border border-[rgba(190,156,104,0.6)] px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.28em] transition-colors duration-700 ease-out-expo hover:border-[rgb(var(--brass))] hover:bg-[rgb(var(--brass))] hover:text-[rgb(var(--ink))]"
            >
              {action.label}
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

      {/* Mobile menu: a full-bleed curtain, not a drawer. Its own bar repeats
          the header's, so the close button sits where the toggle was. On short
          screens (landscape phones, zoomed pages) it tightens and scrolls, so
          every link stays in reach. */}
      <dialog
        id="mobile-menu"
        ref={menuRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        className="tone-dark grain fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 p-0 open:flex lg:hidden"
      >
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="pt-[var(--notice-h)] short:pt-0">
            <div className="container-x flex h-[var(--nav-h)] items-center justify-between text-[rgb(var(--ivory))] short:h-16">
              <Monogram className="h-10 w-10 text-[rgb(var(--brass))]" title="" />
              <div className="flex items-center gap-2">
                <Ambience />
                <button
                  type="button"
                  className="relative -mr-2 flex h-11 w-11 items-center justify-center"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden className="absolute h-px w-6 rotate-45 bg-current" />
                  <span aria-hidden className="absolute h-px w-6 -rotate-45 bg-current" />
                </button>
              </div>
            </div>
          </div>
          <nav aria-label="Mobile" className="container-x mt-12 flex flex-col gap-2 short:mt-2 short:gap-0">
            {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={(item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) ? "page" : undefined}
                className="menu-in self-start font-display text-[2.75rem] leading-[1.2] text-fg aria-[current=page]:text-accent short:py-1 short:text-[1.75rem]"
                style={{ "--d": `${120 + i * 70}ms` } as React.CSSProperties}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="container-x mt-auto pb-10 pt-12 text-eyebrow short:pb-6 short:pt-6">Private Chef · New York · By arrangement</div>
        </div>
      </dialog>
    </>
  );
}
