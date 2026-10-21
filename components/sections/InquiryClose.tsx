import Link from "next/link";
import { Cta } from "@/components/ui/Cta";
import { site } from "@/lib/site";
import { home } from "@/content/home";

// The close. One decision, stated plainly, with a warm light behind it.
export function InquiryClose({ title = home.close.lines, href = "/inquire", lead = home.close.lead }: { title?: readonly [string, string]; href?: string; lead?: string }) {
  return (
    <section aria-labelledby="close-title" className="tone-dark grain defer-render relative isolate overflow-hidden">
      <div aria-hidden className="candle absolute inset-x-[-20%] bottom-[-60%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.26),transparent_70%)]" />
      <div className="container-x py-[clamp(6rem,14vw,12rem)] text-center">
        <p className="text-eyebrow" data-reveal>{home.close.eyebrow}</p>
        <h2 id="close-title" className="mx-auto mt-10 max-w-[14ch] font-display text-[clamp(2.9rem,8.5vw,8rem)] leading-[0.95] tracking-[-0.015em] [text-wrap:balance]" data-reveal-group>
          <span className="line-mask"><span>{title[0]}</span></span>
          <span className="line-mask" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><span className="italic text-accent">{title[1]}</span></span>
        </h2>
        <p className="text-lead mx-auto mt-10 max-w-md" data-reveal>
          {lead}
        </p>
        <div className="mt-12 flex flex-col items-center gap-8" data-reveal>
          <Cta href={href} track="cta:close">Start a request</Cta>
          {site.email ? (
            <a href={`mailto:${site.email}`} className="link-underline inline-block py-1 text-sm text-fg-muted hover:text-fg">
              or write to {site.email}
            </a>
          ) : (
            <Link href="/questions" className="link-underline inline-block py-1 text-sm text-fg-muted hover:text-fg">Read the questions first</Link>
          )}
        </div>
      </div>
    </section>
  );
}
