// The opening sequence: ~1.6s, once per session, CSS only (no JS dependency,
// nothing to hydrate). A brass ring draws itself like a seal being pressed,
// the name rises, a hairline measures the pause — then the room is revealed
// by a curtain lifting from the floor. The hero's own entrance is delayed to
// begin as the curtain clears (see html.prelude rules in globals.css).
export function Prelude() {
  return (
    <div aria-hidden className="prelude-veil tone-dark grain">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 64 64" className="h-20 w-20 text-accent">
          <circle className="prelude-ring" cx="32" cy="32" r="30.5" fill="none" stroke="currentColor" strokeWidth="0.6" pathLength={1} />
          <circle className="prelude-ring prelude-ring--inner" cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="0.3" pathLength={1} />
        </svg>
        <p className="line-mask mt-8 font-display text-[clamp(1.6rem,3vw,2.2rem)] tracking-[0.01em] text-fg">
          <span className="prelude-name">Eric <span className="italic">Jokl</span></span>
        </p>
        <span className="prelude-rule mt-6 block h-px w-24 bg-accent/70" />
        <p className="prelude-sub mt-6 text-[0.62rem] uppercase tracking-[0.36em] text-fg-muted">Private Evenings · By Arrangement</p>
      </div>
    </div>
  );
}
