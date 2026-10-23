import Link from "next/link";
import { offer, money } from "@/content/offer";
import { site } from "@/lib/site";

// This site is a template shown under a demo persona. The notice sits above
// the navigation on every page, says so plainly in one quiet line, and leads
// to the offer. It is the only standing commercial element on the demo, and
// it exists only while site.demo is true: a customer's site has no notice.
export function TemplateNotice() {
  if (!site.demo) return null;
  return (
    <div className="border-b border-[rgba(190,156,104,0.2)] bg-[rgba(12,8,6,0.94)]">
      <div className="container-x flex h-[var(--notice-h)] items-center justify-between gap-x-4 text-[0.62rem] uppercase tracking-[0.2em] text-[rgba(237,229,214,0.8)] sm:justify-center sm:text-[0.64rem]">
        <p className="min-w-0 truncate">
          <span className="text-[rgb(var(--brass))]">Live demo</span>
          <span className="hidden md:inline"> · Chef Eric Jokl is a fictional persona. This website can be yours.</span>
        </p>
        <Link
          href="/your-site"
          data-track="cta:template-notice"
          className="link-underline inline-flex min-h-6 shrink-0 items-center text-[rgb(var(--ivory))]"
        >
          Get this website<span className="hidden sm:inline">&nbsp;· {money(offer.monthly)}/mo</span>&nbsp;→
        </Link>
      </div>
    </div>
  );
}
