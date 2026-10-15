import { credentials, quotes, testimonials } from "@/content/voice";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Three sections that exist only when real content does. Each renders
// nothing while its array in content/voice.ts is empty.

/** Eric's own words, set large: the closest thing to meeting him. */
export function PullQuote({ index = 0 }: { index?: number }) {
  const q = quotes[index];
  if (!q) return null;
  return (
    <section aria-label="In his words" className="tone-dark section relative">
      <figure className="container-x mx-auto max-w-5xl text-center" data-reveal>
        <span aria-hidden className="font-display text-[5rem] leading-none text-accent">&ldquo;</span>
        <blockquote className="text-h1 -mt-6 italic">{q.text}</blockquote>
        <figcaption className="text-eyebrow mt-10">Eric Jokl{q.context ? ` · ${q.context}` : ""}</figcaption>
      </figure>
    </section>
  );
}

/** Words from past hosts, anonymous by design. */
export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="hosts-title" className="tone-linen section">
      <div className="container-x">
        <Eyebrow>From past hosts</Eyebrow>
        <h2 id="hosts-title" className="sr-only">From past hosts</h2>
        <div className="mt-14 grid gap-px overflow-hidden border border-line bg-[rgb(var(--fg)/0.12)] md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col justify-between gap-8 bg-bg p-8 md:p-10" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <blockquote className="font-display text-[1.35rem] italic leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="text-eyebrow">{t.attribution}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Verified figures, shown above the host ledger. */
export function Credentials() {
  if (!credentials.length) return null;
  return (
    <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-3" data-reveal>
      {credentials.map((c) => (
        <div key={c.label}>
          <dt className="sr-only">{c.label}</dt>
          <dd className="font-display text-[2.6rem] leading-none text-accent">{c.figure}</dd>
          <dd className="mt-2 text-sm text-fg-muted">{c.label}</dd>
        </div>
      ))}
    </dl>
  );
}
