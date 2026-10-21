import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { Credentials } from "@/components/sections/Voice";
import { home } from "@/content/home";

// The chef, as a ledger rather than a stats bar: what he cooks, where, and
// how. Verified figures (content/voice.ts) appear above it once they exist.
export function ChefIntro({ index = "IV" }: { index?: string }) {
  const { chef } = home;
  return (
    <section aria-labelledby="chef-title" className="tone-walnut section defer-render relative overflow-hidden">
      <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <Plate tone="portrait" slot="portrait" alt="Chef Eric Jokl in a black chef's jacket, arms folded, copper pans behind him." label="Chef Eric Jokl" focus="object-[50%_30%]" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Eyebrow index={index}>The Chef</Eyebrow>
          <h2 id="chef-title" className="text-h1 mt-10" data-reveal-group>
            <span className="line-mask"><span>{chef.lines[0]}</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">{chef.lines[1]}</span></span>
          </h2>
          <div className="mt-10 max-w-[34rem] space-y-6 text-lead" data-reveal>
            <p>{chef.body[0]}</p>
            <p className="text-fg-muted">{chef.body[1]}</p>
          </div>

          <Credentials />
          <dl className="mt-14 border-t border-line" data-reveal>
            {chef.ledger.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-[0.68rem] uppercase tracking-[0.26em] text-fg-muted sm:pt-1">{k}</dt>
                <dd className="font-display text-[1.2rem]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12" data-reveal>
            <Cta href="/chef" variant="quiet">How he works</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
