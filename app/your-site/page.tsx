import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageIntro } from "@/components/sections/PageIntro";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

// The offer behind the template. Everything listed under "Built in" is what
// this codebase actually does. CONFIRM: whether customization is included in
// the monthly price or quoted separately, and what hosting covers.
export const metadata: Metadata = {
  title: "Get This Site — Customized to You",
  description:
    "This site is a template shown under an example name. Get it rebuilt around your name, your story and your photography, hosted for $50 a month.",
  alternates: { canonical: "/your-site" },
  openGraph: { title: "Get this site, customized to you", url: "/your-site" },
};

const customized = [
  ["Your name and mark", "The name, the monogram, the opening sequence and the share card, set for you."],
  ["Your story", "Every page rewritten in your voice, about your work — nothing invented, nothing borrowed."],
  ["Your photography", "Your own photographs, or editorial imagery created from your likeness, placed in every slot."],
  ["Your offer", "Your services in place of the evenings, your locations in place of the destinations, your questions in the inquiry."],
] as const;

const builtIn = [
  "A cinematic opening, page transitions and a responsive cursor on desktop",
  "Phone-first layouts and a thumb-reach action bar",
  "A conversational inquiry that asks one question at a time and reads the request back",
  "Private, signed invitation links for the people you want to reach",
  "Search-ready pages with structured data, a sitemap and share cards",
  "Adapts to slow connections and reduced-motion settings automatically",
] as const;

const steps = [
  ["01", "Tell us about you", "Who you are, what you offer and who you want to reach."],
  ["02", "We make it yours", "Name, words, imagery and offer, customized on this foundation."],
  ["03", "You go live", "Your site on the web, hosted and fast, with your inquiries coming to you."],
] as const;

export default function YourSitePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Get this site", path: "/your-site" }]} />
      <PageIntro
        id="your-site-title"
        eyebrow="Template example"
        lines={["Your name", "here."]}
        lead={
          <p>
            What you have been looking at is a template. Eric Jokl is the example — he isn&rsquo;t a
            chef, and these evenings are a demonstration. Every part of it can be rebuilt around
            you: your name, your story, your photographs, your offer.
          </p>
        }
      />

      <section aria-labelledby="customized-title" className="tone-linen section">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="I">Made yours</Eyebrow>
            <h2 id="customized-title" className="text-h2 mt-8">Customized <span className="italic text-accent">to you.</span></h2>
          </div>
          <dl className="md:col-span-7 md:col-start-6">
            {customized.map(([k, v], i) => (
              <div key={k} className="grid gap-2 border-t border-line py-7 last:border-b sm:grid-cols-[13rem_1fr] sm:gap-8" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <dt className="font-display text-[1.35rem] leading-snug">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="price-title" className="tone-dark grain section relative isolate overflow-hidden">
        <div aria-hidden className="candle absolute inset-x-[-20%] bottom-[-60%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.22),transparent_70%)]" />
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow index="II">Hosting</Eyebrow>
            <h2 id="price-title" className="mt-8 font-display leading-none" data-reveal>
              <span className="block text-[clamp(4.5rem,12vw,9rem)] tracking-[-0.03em]">$50</span>
              <span className="mt-3 block text-[1.4rem] italic text-accent">a month, for hosting.</span>
            </h2>
            <p className="mt-8 max-w-sm text-fg-muted" data-reveal>
              Your site kept online, fast and secure on a global network, with HTTPS as standard.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h3 className="text-eyebrow">Built in, on every site</h3>
            <ul className="mt-6 space-y-4">
              {builtIn.map((item) => (
                <li key={item} className="flex gap-4" data-reveal>
                  <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                  <span className="text-fg/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="tone-walnut section">
        <div className="container-x">
          <Eyebrow index="III">How it works</Eyebrow>
          <h2 id="how-title" className="text-h2 mt-8">Three steps <span className="italic text-accent">to live.</span></h2>
          <ol className="mt-14 grid gap-px overflow-hidden border border-line bg-[rgb(var(--fg)/0.12)] md:grid-cols-3">
            {steps.map(([n, t, b], i) => (
              <li key={n} className="bg-bg p-8 md:p-10" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                <span className="font-display text-[2.4rem] leading-none text-accent">{n}</span>
                <h3 className="text-h3 mt-6">{t}</h3>
                <p className="mt-3 text-fg-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="start-title" className="tone-dark grain relative isolate overflow-hidden">
        <div className="container-x py-[clamp(7rem,16vw,12rem)] text-center">
          <p className="text-eyebrow" data-reveal>Your turn</p>
          <h2 id="start-title" className="text-display mx-auto mt-10 max-w-[14ch]" data-reveal-group>
            <span className="line-mask"><span>Make it</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><span className="italic text-accent">yours.</span></span>
          </h2>
          <div className="mt-12 flex flex-col items-center gap-8" data-reveal>
            <Cta href="/inquire?about=website" track="cta:your-site-start">Start your site</Cta>
            {site.email ? (
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("I'd like this website")}`} className="link-underline pb-0.5 text-sm text-fg-muted hover:text-fg">
                or write to {site.email}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
