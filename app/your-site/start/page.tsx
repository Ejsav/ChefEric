import type { Metadata } from "next";
import Link from "next/link";
import { SalesForm } from "@/components/sales/SalesForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { offer, money } from "@/content/offer";
import { builder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start Your Website — Request a Proposal",
  description: `Tell us about your business and the site you want. A reply within one business day, a twenty-minute call, then a written proposal. ${money(offer.setup)} setup, ${money(offer.monthly)} a month, no minimum term.`,
  alternates: { canonical: "/your-site/start" },
  openGraph: { title: "Start your website", url: "/your-site/start" },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function StartPage() {
  return (
    <section aria-labelledby="start-title" className="tone-dark grain relative isolate min-h-[100svh] overflow-hidden">
      <Breadcrumbs items={[{ name: "Get this website", path: "/your-site" }, { name: "Start", path: "/your-site/start" }]} />
      <div aria-hidden className="hero-lights candle absolute left-[-30%] top-[-20%] -z-10 h-[90%] w-[90%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.16),transparent_70%)]" />
      <div className="container-x grid gap-16 pb-28 pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))] lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="hero-fade text-eyebrow flex items-center gap-4" style={d(150)}>
              <span aria-hidden className="hero-draw inline-block h-px w-10 bg-accent" style={d(100)} />
              Get this website
            </p>
            <h1 id="start-title" className="mt-8 font-display text-[clamp(2.6rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              <span className="hero-rise line-mask"><span style={d(220)}>Start</span></span>
              <span className="hero-rise line-mask"><span style={d(340)} className="italic text-accent">your website.</span></span>
            </h1>
            <p className="hero-fade mt-8 max-w-sm text-fg-muted" style={d(650)}>
              About three minutes. {builder.name} replies personally within one business day to set up a
              short call. Nothing is charged until you have a written proposal and have agreed to it.
            </p>
            <dl className="hero-fade mt-10 space-y-4 border-t border-line pt-8 text-sm" style={d(800)}>
              <div className="flex justify-between gap-6"><dt className="text-fg-muted">Setup, one time</dt><dd className="font-display text-lg">{money(offer.setup)}</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-fg-muted">The plan</dt><dd className="font-display text-lg">{money(offer.monthly)} a month</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-fg-muted">Minimum term</dt><dd className="font-display text-lg">None</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-fg-muted">Typical launch</dt><dd className="font-display text-lg">{offer.launchTime}</dd></div>
            </dl>
            <p className="hero-fade mt-8 text-sm text-fg-muted" style={d(900)}>
              <Link href="/your-site#plan" className="link-underline text-fg/85">What the plan includes</Link>
              {" · "}
              <Link href="/terms" className="link-underline text-fg/85">Terms</Link>
              {site.email ? <> · <a href={`mailto:${site.email}`} className="link-underline text-fg/85">{site.email}</a></> : null}
            </p>
          </div>
        </aside>
        <div className="hero-fade relative lg:col-span-7 lg:col-start-6" style={d(450)}>
          <SalesForm />
          <noscript>
            <p className="text-lead mt-8">
              This form needs JavaScript to send. {site.email ? <>You can also write to <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</> : <>You can also reach Eric through <a className="underline" href={builder.url}>{builder.url.replace(/^https?:\/\//, "")}</a>.</>}
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
