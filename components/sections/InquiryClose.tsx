import { Cta } from "@/components/ui/Cta";
import { site } from "@/lib/site";

// The close. One decision, stated plainly, with a warm light behind it.
export function InquiryClose({ title = ["Name the date.", "The rest is ours."], href = "/inquire" }: { title?: [string, string]; href?: string }) {
  return (
    <section aria-labelledby="close-title" className="tone-dark grain defer-render relative isolate overflow-hidden">
      <div aria-hidden className="candle absolute inset-x-[-20%] bottom-[-60%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.26),transparent_70%)]" />
      <div className="container-x py-[clamp(7rem,16vw,14rem)] text-center">
        <p className="text-eyebrow" data-reveal>Private requests</p>
        <h2 id="close-title" className="text-display mx-auto mt-10 max-w-[14ch]" data-reveal-group>
          <span className="line-mask"><span>{title[0]}</span></span>
          <span className="line-mask" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><span className="italic text-accent">{title[1]}</span></span>
        </h2>
        <p className="text-lead mx-auto mt-10 max-w-md" data-reveal>
          When, where and roughly how many. Everything after that is a conversation.
        </p>
        <div className="mt-12 flex flex-col items-center gap-8" data-reveal>
          <Cta href={href} track="cta:close">Start a request</Cta>
          {site.email ? (
            <a href={`mailto:${site.email}`} className="link-underline pb-0.5 text-sm text-fg-muted hover:text-fg">
              or write to {site.email}
            </a>
          ) : (
            <a href="/questions" className="link-underline pb-0.5 text-sm text-fg-muted hover:text-fg">Read the questions first</a>
          )}
        </div>
      </div>
    </section>
  );
}
