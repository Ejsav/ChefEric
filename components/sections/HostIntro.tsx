import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { Credentials } from "@/components/sections/Voice";

// Who he is, as a ledger rather than a stats bar. Every line describes
// what Eric does; numbers are added (content/voice.ts) only once verified.
// The kitchen line is deliberate: the site never implies he is the chef.
const ledger = [
  ["Discipline", "Digital builder and full-stack developer"],
  ["Craft", "Brand, experience and conversion design"],
  ["Method", "AI-assisted planning, analogue execution"],
  ["On the night", "Host and director of the evening"],
  ["The kitchen", "Led by a chef chosen for each table"],
] as const;

export function HostIntro() {
  return (
    <section aria-labelledby="host-title" className="tone-walnut section defer-render relative overflow-hidden">
      <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Plate tone="portrait" slot="portrait" alt="Portrait of Eric Jokl in a candlelit private dining room." label="Eric Jokl" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Eyebrow index="IV">The Host</Eyebrow>
          <h2 id="host-title" className="text-h1 mt-10" data-reveal-group>
            <span className="line-mask"><span>Trained on</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">screens and systems.</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}><span>Made for the room.</span></span>
          </h2>
          <div className="mt-10 max-w-[34rem] space-y-6 text-lead" data-reveal>
            <p>
              Eric Jokl is a builder. He designs the digital systems, brands and experiences
              that make ideas feel real, trusted and impossible to ignore — and he brings the
              same obsession to the oldest experience there is: a table, at night, with the
              right people around it.
            </p>
            <p className="text-fg-muted">
              Private Evenings is the result. The room, the light, the sound, the pace and the
              story are designed like a product and delivered like theatre. The kitchen belongs
              to a chef chosen for your table. Everything else is his.
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
            <Cta href="/eric" variant="quiet">Read how it was built</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
