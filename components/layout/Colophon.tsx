"use client";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { offer, money } from "@/content/offer";
import { Cta } from "@/components/ui/Cta";

// The colophon: the printed note at the back of a book that says who set it
// and how. It closes every demo page with the truth about what the visitor
// has been looking at, and the one commercial action the demo exists for.
// Hidden on the offer itself and on the legal and invitation pages.
const HIDDEN = ["/your-site", "/terms", "/privacy", "/invite"];

export function Colophon() {
  const pathname = usePathname();
  if (!site.demo || HIDDEN.some((p) => pathname.startsWith(p))) return null;
  return (
    <aside aria-labelledby="colophon-title" className="tone-linen relative border-t border-line">
      <div className="container-x grid gap-10 py-[clamp(4rem,8vw,6.5rem)] md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="text-eyebrow flex items-center gap-4"><span aria-hidden className="h-px w-10 bg-accent/60" />Colophon</p>
          <h2 id="colophon-title" className="text-h2 mt-6 max-w-[20ch]">
            You are looking at <span className="italic text-accent">a template.</span>
          </h2>
          <p className="mt-6 max-w-[36rem] text-fg-muted">
            Chef Eric Jokl is a demo persona; the menus, prices and testimonials are examples, and nothing
            here books a real evening. The design, the planner, the request flow and the speed are real,
            and all of it can carry your name.
          </p>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="font-display text-[1.35rem] leading-snug">
            {money(offer.setup)} setup, then {money(offer.monthly)} a month.
            <span className="block text-fg-muted">No minimum term.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Cta href="/your-site" track="cta:colophon">Get this website</Cta>
            <Cta href="/your-site#plan" variant="quiet" className="text-fg-muted" track="cta:colophon-plan">What&rsquo;s included</Cta>
          </div>
        </div>
      </div>
    </aside>
  );
}
