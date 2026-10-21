import type { Metadata } from "next";
import Link from "next/link";
import { builder, site } from "@/lib/site";
import { audience, coverage, customized, examples, faqs, fixed, money, offer, onboarding, palettes, reasons, terms, type Coverage } from "@/content/offer";
import { Studio } from "@/components/sales/Studio";
import { MiniHero } from "@/components/sales/MiniHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { Faq } from "@/components/ui/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { cn } from "@/lib/utils";

// The offer behind the template: what is bought, who it is for, what it
// costs, what is included and what is not, how it works, and what happens if
// you leave. Every figure comes from content/offer.ts.
export const metadata: Metadata = {
  title: { absolute: "Luxury Private Chef Website — Your Name Here · Eric Jokl" },
  description: `A luxury website for private chefs and hospitality brands, rebuilt around your name, your story and your photography. ${money(offer.setup)} setup, ${money(offer.monthly)} a month, no minimum term. Designed and built by ${builder.name}.`,
  alternates: { canonical: "/your-site" },
  openGraph: { title: "Get this website — your name here", description: `A luxury private-chef website, made yours. ${money(offer.monthly)} a month.`, url: "/your-site" },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const where: Record<Exclude<Coverage, "yours">, string> = { monthly: "Plan", setup: "Setup", extra: "Quoted" };

const underTheHood = [
  "Server-rendered pages on Next.js and React",
  "Images served as AVIF or WebP, sized to each screen",
  "Automated tests on desktop and phone before every release",
  "Accessibility built to WCAG 2.2 AA: keyboard, screen readers, contrast",
  "Security headers, spam screening and rate limits on every form",
  "Privacy-friendly analytics, no advertising cookies",
] as const;

export default function YourSitePage() {
  const brass = palettes[0]!.accent;
  const offerLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Luxury private-chef website",
    serviceType: "Website design and hosting",
    description: metadata.description,
    url: `${site.url}/your-site`,
    provider: { "@type": "Person", name: builder.name, jobTitle: builder.role, url: builder.url },
    offers: [
      { "@type": "Offer", name: "Setup", price: offer.setup, priceCurrency: "USD" },
      {
        "@type": "Offer",
        name: "Monthly plan",
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: offer.monthly, priceCurrency: "USD", billingDuration: "P1M", unitCode: "MON" },
      },
    ],
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Get this website", path: "/your-site" }]} />
      <FaqJsonLd faqs={[...faqs, ...terms]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerLd) }} />

      {/* Opening: what this is, in one breath. */}
      <section aria-labelledby="your-site-title" className="tone-dark grain relative isolate overflow-hidden">
        <div aria-hidden className="hero-lights candle absolute inset-x-[-10%] bottom-[-70%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.22),transparent_70%)]" />
        <div className="container-x pb-16 pt-[calc(var(--header-h)+clamp(4rem,10vw,8rem))] md:pb-24">
          <p className="hero-fade text-eyebrow flex items-center gap-4" style={d(200)}>
            <span aria-hidden className="hero-draw inline-block h-px w-10 bg-accent" style={d(100)} />
            Get this website
          </p>
          <h1 id="your-site-title" className="mt-10 max-w-[13ch] font-display text-[clamp(3rem,9.5vw,9rem)] leading-[0.92] tracking-[-0.012em]">
            <span className="hero-rise line-mask"><span style={d(250)}>Your name,</span></span>
            <span className="hero-rise line-mask"><span style={d(380)} className="italic text-accent">here.</span></span>
          </h1>
          <div className="mt-12 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
            <div className="hero-fade md:col-span-6" style={d(650)}>
              <p className="text-lead max-w-xl">
                What you have been exploring is a template, and Chef Eric Jokl is a demo persona. The design, the
                planner, the request flow and the speed are real. Your version carries your name, your story, your
                photographs, your menus and your prices, on your own domain.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                <Cta href="/your-site/start" track="cta:your-site-hero">Start your website</Cta>
                <Cta href="#plan" variant="quiet" className="text-fg-muted" track="cta:your-site-plan">See the plan</Cta>
              </div>
            </div>
            <dl className="hero-fade grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 md:col-span-5 md:col-start-8" style={d(800)}>
              <div><dt className="text-eyebrow">Setup</dt><dd className="mt-2 font-display text-[1.6rem]">{money(offer.setup)}</dd></div>
              <div><dt className="text-eyebrow">Then</dt><dd className="mt-2 font-display text-[1.6rem]">{money(offer.monthly)}<span className="text-base text-fg-muted"> / month</span></dd></div>
              <div><dt className="text-eyebrow">Minimum term</dt><dd className="mt-2 font-display text-[1.6rem]">None</dd></div>
              <div><dt className="text-eyebrow">Live in</dt><dd className="mt-2 font-display text-[1.6rem]">{offer.launchTime}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* I. Try it: the customization, live. */}
      <section aria-labelledby="studio-title" className="tone-walnut section">
        <div className="container-x">
          <Eyebrow index="I">Make it yours</Eyebrow>
          <h2 id="studio-title" className="text-h2 mb-6 mt-8">See it <span className="italic text-accent">with your name.</span></h2>
          <p className="mb-14 max-w-xl text-fg-muted">Type your name, your title and where you work, choose a palette, and the opening of your home page resets itself.</p>
          <Studio />
        </div>
      </section>

      {/* II. Before and after: the same site, three ways. */}
      <section aria-labelledby="examples-title" className="tone-dark section">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow index="II">Before and after</Eyebrow>
              <h2 id="examples-title" className="text-h2 mt-8">One foundation, <span className="italic text-accent">any name.</span></h2>
            </div>
            <p className="text-sm text-fg-muted md:col-span-4 md:col-start-9">Illustrations with invented names, showing how far the same site travels. Your words, photographs and palette do the rest.</p>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            <figure className="flex flex-col">
              <MiniHero size="sm" name="Eric Jokl" role="Private Chef" place="New York" line="Modern coastal and Italian cooking for one table at a time." accent={brass} className="flex-1" />
              <figcaption className="mt-3 text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted">Before · this demo</figcaption>
            </figure>
            {examples.map((x) => (
              <figure key={x.name} className="flex flex-col">
                <MiniHero size="sm" name={x.name} role={x.role} place={x.place} line={x.line} accent={palettes.find((p) => p.id === x.palette)!.accent} className="flex-1" />
                <figcaption className="mt-3 text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted">After · {palettes.find((p) => p.id === x.palette)!.label} palette · illustration</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* III. Who it is for, and why this design. */}
      <section aria-labelledby="for-title" className="tone-linen section">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow index="III">Who it is for</Eyebrow>
            <h2 id="for-title" className="text-h2 mt-8">Built for people <span className="italic text-accent">who cook for others.</span></h2>
            <dl className="mt-10 border-t border-line">
              {audience.map((a) => (
                <div key={a.title} className="border-b border-line py-5">
                  <dt className="font-display text-[1.3rem]">{a.title}</dt>
                  <dd className="mt-1 text-fg-muted">{a.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="text-h2">Why <span className="italic text-accent">this design.</span></h2>
            <ol className="mt-10 border-t border-line">
              {reasons.map((r, i) => (
                <li key={r.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-6" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                  <span className="font-display text-lg italic text-accent">{["i", "ii", "iii", "iv"][i]}.</span>
                  <div>
                    <h3 className="font-display text-[1.35rem] leading-snug">{r.title}</h3>
                    <p className="mt-2 text-fg-muted">{r.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* IV. What changes and what stays. */}
      <section aria-labelledby="customized-title" className="tone-walnut section">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="IV">What changes</Eyebrow>
            <h2 id="customized-title" className="text-h2 mt-8">Made <span className="italic text-accent">yours.</span></h2>
            <p className="mt-6 max-w-sm text-fg-muted">{fixed}</p>
          </div>
          <dl className="md:col-span-7 md:col-start-6">
            {customized.map(([k, v], i) => (
              <div key={k} className="grid gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[13rem_1fr] sm:gap-8" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <dt className="font-display text-[1.3rem] leading-snug">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* V. The plan: exactly what is included, what is setup and what is extra. */}
      <section id="plan" aria-labelledby="plan-title" className="tone-dark grain section relative isolate scroll-mt-[var(--header-h)] overflow-hidden">
        <div aria-hidden className="candle absolute inset-x-[-20%] bottom-[-70%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.18),transparent_70%)]" />
        <div className="container-x">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Eyebrow index="V">The plan</Eyebrow>
              <h2 id="plan-title" className="mt-8 font-display leading-none">
                <span className="block text-[clamp(4.5rem,12vw,8.5rem)] tracking-[-0.03em]">{money(offer.monthly)}</span>
                <span className="mt-3 block text-[1.4rem] italic text-accent">a month, after a {money(offer.setup)} setup.</span>
              </h2>
              <p className="mt-8 max-w-sm text-fg-muted">
                No minimum term. The plan starts the day your site launches. Anything outside it is quoted in
                writing and only billed once you approve it.
              </p>
              <div className="mt-10"><Cta href="/your-site/start" track="cta:your-site-price">Start your website</Cta></div>
            </div>
            <div className="md:col-span-7">
              {/* A real table from tablet up; stacked cards on phones. */}
              <table className="hidden w-full border-collapse text-left md:table">
                <caption className="sr-only">What the plan, the setup and quoted extras cover</caption>
                <thead>
                  <tr className="border-b border-line text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted">
                    <th scope="col" className="py-3 pr-6 font-medium">Item</th>
                    <th scope="col" className="w-16 px-2 py-3 text-center font-medium">Plan</th>
                    <th scope="col" className="w-16 px-2 py-3 text-center font-medium">Setup</th>
                    <th scope="col" className="w-20 px-2 py-3 text-center font-medium">Quoted</th>
                  </tr>
                </thead>
                <tbody>
                  {coverage.map((c) => (
                    <tr key={c.item} className="border-b border-line align-top">
                      <th scope="row" className="py-4 pr-6 font-normal">
                        <span className="block font-display text-[1.15rem]">{c.item}</span>
                        <span className="mt-1 block text-sm text-fg-muted">{c.note}</span>
                      </th>
                      {c.where.includes("yours") ? (
                        <td colSpan={3} className="px-2 py-4 text-center text-sm italic text-accent">Always yours</td>
                      ) : (
                        (["monthly", "setup", "extra"] as const).map((w) => (
                          <td key={w} className="px-2 py-4 text-center">
                            {c.where.includes(w) ? <><span aria-hidden className="text-accent">●</span><span className="sr-only">Yes</span></> : <><span aria-hidden className="text-fg/25">—</span><span className="sr-only">No</span></>}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="border-t border-line md:hidden">
                {coverage.map((c) => (
                  <li key={c.item} className="border-b border-line py-5">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                      <span className="font-display text-[1.2rem]">{c.item}</span>
                      <span className="flex gap-2">
                        {c.where.map((w) => (
                          <span key={w} className={cn("border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em]", w === "extra" ? "border-line text-fg-muted" : "border-accent/60 text-accent")}>
                            {w === "yours" ? "Yours" : where[w]}
                          </span>
                        ))}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-fg-muted">{c.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VI. How it works, with times. */}
      <section aria-labelledby="how-title" className="tone-linen section">
        <div className="container-x">
          <Eyebrow index="VI">How it works</Eyebrow>
          <h2 id="how-title" className="text-h2 mt-8">From first message <span className="italic text-accent">to launch.</span></h2>
          <ol className="mt-14 grid gap-px overflow-hidden border border-line bg-[rgb(var(--fg)/0.12)] sm:grid-cols-2 lg:grid-cols-3">
            {onboarding.map((s, i) => (
              <li key={s.step} className="bg-bg p-7 md:p-9" data-reveal style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[2.2rem] leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.22em] text-fg-muted">{s.time}</span>
                </p>
                <h3 className="mt-6 font-display text-[1.45rem] leading-snug">{s.step}</h3>
                <p className="mt-3 text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VII. Billing, ownership and leaving — visible, not folded away. */}
      <section aria-labelledby="terms-title" className="tone-walnut section">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="VII">The terms</Eyebrow>
            <h2 id="terms-title" className="text-h2 mt-8">Money, ownership <span className="italic text-accent">and leaving.</span></h2>
            <p className="mt-6 text-fg-muted">In plain words, before you ask. The full <Link href="/terms" className="link-underline text-fg">terms</Link> say the same.</p>
          </div>
          <dl className="md:col-span-7 md:col-start-6">
            {terms.map((t) => (
              <div key={t.q} className="border-t border-line py-6 last:border-b">
                <dt className="font-display text-[1.3rem] leading-snug">{t.q}</dt>
                <dd className="mt-2 max-w-2xl text-fg-muted">{t.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* VIII. Who builds it. Proof is this site, not invented logos. */}
      <section aria-labelledby="builder-title" className="tone-dark section">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow index="VIII">Who builds it</Eyebrow>
            <h2 id="builder-title" className="text-h2 mt-8">{builder.name}, <span className="italic text-accent">{builder.role.toLowerCase()}.</span></h2>
            <p className="mt-6 max-w-md text-fg-muted">
              Everything you clicked on this demo, from the type and the light to the planner, the request flow
              and the tests behind them, was designed and built by the person you would work with. You deal with
              him from the first call to the last edit.
            </p>
            <div className="mt-8"><Cta href={builder.url} variant="quiet" track="cta:builder-site">More of Eric&rsquo;s work</Cta></div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h3 className="text-eyebrow">Under the hood, on every site</h3>
            <ul className="mt-6 space-y-4">
              {underTheHood.map((item) => (
                <li key={item} className="flex gap-4" data-reveal>
                  <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                  <span className="text-fg/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* IX. Questions. */}
      <section aria-labelledby="offer-faq" className="tone-linen section">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="IX">Questions</Eyebrow>
            <h2 id="offer-faq" className="text-h2 mt-8">Before <span className="italic text-accent">you ask.</span></h2>
          </div>
          <Faq faqs={[...faqs]} className="md:col-span-7 md:col-start-6" />
        </div>
      </section>

      <section aria-labelledby="start-title" className="tone-dark grain relative isolate overflow-hidden">
        <div aria-hidden className="candle absolute inset-x-[-20%] bottom-[-60%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.26),transparent_70%)]" />
        <div className="container-x py-[clamp(6rem,14vw,11rem)] text-center">
          <p className="text-eyebrow" data-reveal>Your turn</p>
          <h2 id="start-title" className="mx-auto mt-10 max-w-[14ch] font-display text-[clamp(2.9rem,8.5vw,8rem)] leading-[0.95] tracking-[-0.015em]" data-reveal-group>
            <span className="line-mask"><span>Make it</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}><span className="italic text-accent">yours.</span></span>
          </h2>
          <p className="text-lead mx-auto mt-10 max-w-md" data-reveal>Three minutes to tell us about your business. A reply within one business day.</p>
          <div className="mt-12 flex flex-col items-center gap-6" data-reveal>
            <Cta href="/your-site/start" track="cta:your-site-start">Start your website</Cta>
            {builder.bookingUrl ? (
              <a href={builder.bookingUrl} data-track="cta:your-site-book" className="link-underline inline-block py-1 text-sm text-fg-muted hover:text-fg" rel="noopener" target="_blank">or book a twenty-minute call</a>
            ) : null}
            {site.email ? (
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("I'd like this website")}`} className="link-underline inline-block py-1 text-sm text-fg-muted hover:text-fg">
                or write to {site.email}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
