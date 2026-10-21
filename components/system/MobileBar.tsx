"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Phones get the next step where the thumb already is. It arrives once the
// opening has been seen, rests in the safe area above the home indicator, and
// steps away near the closing sections and on the forms themselves.
// On the demo pages it carries both actions: the chef's own (part of what is
// being demonstrated) and, set apart by a hairline, the offer.
export function MobileBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const suppressed = ["/inquire", "/invite", "/your-site/start", "/terms", "/privacy"].some((p) => pathname.startsWith(p));
  const offerPage = pathname.startsWith("/your-site");

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = scrollY + innerHeight > document.documentElement.scrollHeight - innerHeight * 1.6;
      setShow(scrollY > innerHeight * 0.7 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (suppressed) return null;
  const tab = show ? 0 : -1;
  return (
    <div
      id="mobile-bar"
      aria-hidden={!show}
      className={cn(
        "safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 transition-[transform,opacity] duration-700 ease-out-expo md:hidden",
        show ? "translate-y-0 opacity-100" : "translate-y-[140%] opacity-0",
      )}
    >
      <div className="pointer-events-auto flex h-14 w-full max-w-md items-stretch border border-[rgb(var(--brass)/0.55)] bg-[rgba(17,12,9,0.86)] text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[rgb(var(--ivory))] backdrop-blur-xl">
        {offerPage ? (
          <Link href="/your-site/start" tabIndex={tab} data-track="cta:mobile-bar-start" className="flex flex-1 items-center justify-between px-6 transition-transform active:scale-[0.98]">
            <span>Start your website</span>
            <Arrow />
          </Link>
        ) : (
          <>
            <Link href="/inquire" tabIndex={tab} data-track="cta:mobile-bar" className="flex min-w-0 flex-1 items-center justify-between gap-3 px-5 transition-transform active:scale-[0.98]">
              <span className="min-[375px]:hidden">Request</span>
              <span className="hidden min-[375px]:inline">Request an evening</span>
              {site.demo ? null : <Arrow />}
            </Link>
            {site.demo ? (
              <Link href="/your-site" tabIndex={tab} data-track="cta:mobile-bar-get-site" aria-label="Get this site" className="flex shrink-0 items-center border-l border-[rgb(var(--brass)/0.35)] px-4 text-[rgb(var(--brass))]">
                This site
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 24 10" className="h-2.5 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 5h22.5M18.5 1l4 4-4 4" /></svg>
  );
}
