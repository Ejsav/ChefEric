import type { Metadata } from "next";
import { Concierge } from "@/components/inquiry/Concierge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inquire — Request a Private Evening",
  description:
    "Request a private dinner, a yacht or private-island evening, a celebration or a cooking class with Chef Eric Jokl. Every request is read and answered personally.",
  alternates: { canonical: "/inquire" },
  openGraph: { title: "Request an evening — Chef Eric Jokl", url: "/inquire" },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function InquirePage() {
  return (
    <section aria-labelledby="inquire-title" className="tone-dark grain relative isolate min-h-[100svh] overflow-hidden">
      <Breadcrumbs items={[{ name: "Inquire", path: "/inquire" }]} />
      <div aria-hidden className="hero-lights candle absolute left-[-30%] top-[-20%] -z-10 h-[90%] w-[90%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.16),transparent_70%)]" />
      <div className="container-x grid gap-16 pb-28 pt-[calc(var(--header-h)+clamp(3rem,8vw,7rem))] lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="hero-fade text-eyebrow flex items-center gap-4" style={d(150)}>
              <span aria-hidden className="hero-draw inline-block h-px w-10 bg-accent" style={d(100)} />
              A private request
            </p>
            <h1 id="inquire-title" className="mt-8 whitespace-nowrap font-display text-[clamp(2.4rem,4vw,3.75rem)] leading-[1.02] tracking-[-0.02em]">
              <span className="hero-rise line-mask"><span style={d(220)}>Where it</span></span>
              <span className="hero-rise line-mask"><span style={d(340)} className="italic text-accent">begins.</span></span>
            </h1>
            <p className="hero-fade mt-8 max-w-sm text-fg-muted" style={d(650)}>
              About two minutes of questions, each one following from your last answer. Sending
              this books nothing; it starts a conversation.
            </p>
            {site.email ? (
              <div className="hero-fade mt-10 hidden space-y-2 border-t border-line pt-8 text-sm lg:block" style={d(800)}>
                <p className="text-eyebrow">Or write directly</p>
                <a href={`mailto:${site.email}`} className="link-underline inline-block pb-0.5 text-fg">{site.email}</a>
              </div>
            ) : null}
          </div>
        </aside>
        <div className="hero-fade relative lg:col-span-7 lg:col-start-6" style={d(450)}>
          <Concierge />
          <noscript>
            <p className="text-lead">
              This request form needs JavaScript to run. Please enable it, or return in another browser.
              {site.email ? <> You can also write to <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</> : null}
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
