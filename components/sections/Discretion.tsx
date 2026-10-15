import { Monogram } from "@/components/ui/Monogram";

// The trust section for a host who builds in public but never publishes his
// guests. Instead of logos and testimonials, it states the rules — which is
// the stronger signal.
const principles = [
  {
    title: "Guests are never named",
    body: "No guest lists, no name-dropping, no photographs of your home. Ever.",
  },
  {
    title: "Content by consent",
    body: "Eric documents his craft in public. Your evening is never part of it unless you say so, in writing.",
  },
  {
    title: "Phones down, on request",
    body: "For evenings that should stay in the room, phones are checked discreetly at the door.",
  },
] as const;

export function Discretion() {
  return (
    <section aria-labelledby="discretion-title" className="tone-dark section defer-render relative overflow-hidden">
      <div aria-hidden className="absolute left-1/2 top-[30%] -z-0 h-[60vw] max-h-[44rem] w-[60vw] max-w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(108,30,34,0.28),transparent)]" />
      <div className="container-x relative text-center">
        <div className="flex justify-center" data-reveal>
          <Monogram className="h-16 w-16 text-accent" />
        </div>
        <h2 id="discretion-title" className="text-h1 mx-auto mt-10 max-w-[16ch]" data-reveal-group>
          <span className="line-mask"><span>Discretion is part</span></span>
          <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">of the design.</span></span>
        </h2>

        <div className="mt-20 grid gap-px overflow-hidden border border-line bg-[rgb(var(--fg)/0.12)] text-left md:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="bg-bg p-8 md:p-10" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}>
              <p className="font-display text-sm italic text-accent">{["i", "ii", "iii"][i]}.</p>
              <h3 className="text-h3 mt-6">{p.title}</h3>
              <p className="mt-4 text-fg-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
