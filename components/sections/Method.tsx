import { method } from "@/content/method";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Sticky chapter title on the left, five courses scrolling past on the right —
// the rhythm of a tasting menu: one thing at a time, each given room.
export function Method() {
  return (
    <section aria-labelledby="method-title" className="tone-linen section defer-render relative">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+3rem)]">
            <Eyebrow index="V">The Evening</Eyebrow>
            <h2 id="method-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>How an evening</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">is made.</span></span>
            </h2>
            <p className="mt-8 max-w-sm text-fg-muted" data-reveal>
              Five movements, from the first call to the last pour. You are asked to do
              one thing: arrive at your own table.
            </p>
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7">
          {method.map((step, i) => (
            <li
              key={step.n}
              className="grid grid-cols-[3.5rem_1fr] gap-6 border-t border-line py-10 last:border-b md:grid-cols-[5rem_1fr] md:py-14"
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <span className="font-display text-[2rem] leading-none text-accent md:text-[2.75rem]">{step.n}</span>
              <div>
                <h3 className="text-h3">{step.title}</h3>
                <p className="mt-4 max-w-md text-fg-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
