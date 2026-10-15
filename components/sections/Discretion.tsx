import { Monogram } from "@/components/ui/Monogram";

// The trust section for a house that does not name its guests. It states
// the rules — which, at this level, is a stronger signal than any logo.
const principles = [
  {
    title: "Guests are never named",
    body: "No guest lists, no name-dropping, no photographs of your home. Ever.",
  },
  {
    title: "Cameras by invitation",
    body: "Nothing from your evening is published unless you ask for it to be.",
  },
  {
    title: "Agreements as standard",
    body: "Confidentiality agreements are signed on request, for every guest list and every crew.",
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
          <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">of the menu.</span></span>
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
