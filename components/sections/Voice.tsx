import { credentials, quotes, testimonials } from "@/content/voice";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Three sections that exist only when real content does. Each renders
// nothing while its array in content/voice.ts is empty.

/** The chef's own words, set large: the closest thing to meeting him. */
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

/** Words from past hosts, anonymous by design. While any are samples, the
 *  section says so in its heading and on every card: they are illustrations
 *  of where a client's real, approved words will go, never reviews. */
export function Testimonials() {
  if (!testimonials.length) return null;
  const samples = testimonials.some((t) => t.sample);
  return (
    <section aria-labelledby="hosts-title" className="tone-linen section">
      <div className="container-x">
        <Eyebrow>{samples ? "Testimonials · Samples" : "From past hosts"}</Eyebrow>
        <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="hosts-title" className="text-h2 max-w-[18ch] md:col-span-6" data-reveal>In <span className="italic text-accent">their words.</span></h2>
          {samples ? (
            <p className="max-w-md text-sm text-fg-muted md:col-span-5 md:col-start-8" data-reveal>
              Illustrative samples written for this demo, not reviews of a real chef. A live site shows
              only real words, approved in writing by the people who said them.
            </p>
          ) : null}
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-[rgb(var(--fg)/0.12)] md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col justify-between gap-10 bg-bg p-8 md:p-10" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <div>
                <span aria-hidden className="font-display text-[3.5rem] leading-none text-accent">&ldquo;</span>
                <blockquote className="-mt-4 font-display text-[1.4rem] italic leading-snug">{t.quote}</blockquote>
              </div>
              <figcaption className="flex items-start justify-between gap-4 border-t border-line pt-5">
                <span className="text-[0.66rem] uppercase leading-relaxed tracking-[0.2em] text-fg-muted">{t.attribution}</span>
                {t.sample ? <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-fg-muted">Sample</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Verified figures, shown above the chef ledger. */
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
