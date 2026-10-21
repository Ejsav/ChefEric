// Interior page opener — same entrance language as the home hero, scaled down.
// `children` sit under the lead (a jump list, a note), inside the same frame.
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

type Props = {
  eyebrow: string;
  lines: readonly [React.ReactNode, React.ReactNode];
  lead: React.ReactNode;
  id: string;
  children?: React.ReactNode;
};

export function PageIntro({ eyebrow, lines, lead, id, children }: Props) {
  return (
    <section aria-labelledby={id} className="tone-dark grain relative isolate overflow-hidden">
      <div aria-hidden className="hero-lights candle absolute inset-x-[-10%] bottom-[-70%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.22),transparent_70%)]" />
      <div className="container-x pb-16 pt-[calc(var(--header-h)+clamp(4rem,10vw,8.5rem))] md:pb-24">
        <p className="hero-fade text-eyebrow flex items-center gap-4" style={d(200)}>
          <span aria-hidden className="hero-draw inline-block h-px w-10 bg-accent" style={d(100)} />
          {eyebrow}
        </p>
        <h1 id={id} className="mt-10 max-w-[13ch] font-display text-[clamp(3rem,9.5vw,9rem)] leading-[0.92] tracking-[-0.012em] [text-wrap:balance]">
          <span className="hero-rise line-mask"><span style={d(250)}>{lines[0]}</span></span>
          <span className="hero-rise line-mask"><span style={d(380)} className="italic text-accent">{lines[1]}</span></span>
        </h1>
        <div className="mt-12 grid md:mt-14 md:grid-cols-12">
          <div className="hero-fade text-lead max-w-xl md:col-span-6 md:col-start-7" style={d(750)}>{lead}</div>
        </div>
        {children ? <div className="hero-fade" style={d(900)}>{children}</div> : null}
      </div>
    </section>
  );
}
