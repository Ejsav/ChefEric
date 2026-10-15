import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { Credentials } from "@/components/sections/Voice";

// The chef, as a ledger rather than a stats bar: what he cooks, where, and
// how. Verified figures (content/voice.ts) appear above it once they exist.
const ledger = [
  ["Cuisine", "Modern coastal and Italian, led by the season"],
  ["Service", "Private dinners, yachts, islands and classes"],
  ["Based", "New York — travelling by arrangement"],
  ["The table", "From two guests to eighty"],
  ["The rule", "Every menu is written once"],
] as const;

export function ChefIntro() {
  return (
    <section aria-labelledby="chef-title" className="tone-walnut section defer-render relative overflow-hidden">
      <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <Plate tone="portrait" slot="portrait" alt="Portrait of Chef Eric Jokl in his kitchen." label="Chef Eric Jokl" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Eyebrow index="IV">The Chef</Eyebrow>
          <h2 id="chef-title" className="text-h1 mt-10" data-reveal-group>
            <span className="line-mask"><span>Cooked for</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">one table.</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}><span>Never repeated.</span></span>
          </h2>
          <div className="mt-10 max-w-[34rem] space-y-6 text-lead" data-reveal>
            <p>
              Eric Jokl cooks for private tables: dinners written for the people at them,
              served in homes, aboard yachts and on islands.
            </p>
            <p className="text-fg-muted">
              He brings a small kitchen team, sources from growers and day boats, cooks in
              your kitchen and leaves it cleaner than he found it. The cooking is precise.
              The hospitality is warm. Nobody sees the effort.
            </p>
          </div>

          <Credentials />
          <dl className="mt-14 border-t border-line" data-reveal>
            {ledger.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-[0.68rem] uppercase tracking-[0.26em] text-fg-muted sm:pt-1">{k}</dt>
                <dd className="font-display text-[1.2rem]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12" data-reveal>
            <Cta href="/chef" variant="quiet">Read his story</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
