"use client";
import { useId, useMemo, useState } from "react";
import { occasions, scales, settings } from "@/content/possibilities";
import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// "Compose an evening." Three choices — the room, the reason, the scale —
// and the evening is written in front of you, with the photograph of the
// room alongside. It replaces the package list: nothing is for sale here
// except possibility, and the composition carries straight into the inquiry.
export function Composer({ index = "II" }: { index?: string }) {
  const [setting, setSetting] = useState(settings[0]!.id);
  const [occasion, setOccasion] = useState(occasions[1]!.id);
  const [scale, setScale] = useState(scales[0]!.id);

  // Only the current room and the one fading out are ever painted.
  const [outgoing, setOutgoing] = useState<string | null>(null);

  const s = settings.find((x) => x.id === setting)!;
  const o = occasions.find((x) => x.id === occasion)!;
  const sc = scales.find((x) => x.id === scale)!;

  const href = useMemo(() => `/inquire?setting=${s.id}&occasion=${o.id}&scale=${sc.id}`, [s.id, o.id, sc.id]);

  const choose = (dial: string, id: string, set: (v: string) => void) => {
    if (dial === "setting" && id !== setting) setOutgoing(setting);
    set(id);
    track("compose_change", { dial, value: id });
  };

  return (
    <section id="possibilities" aria-labelledby="compose-title" className="tone-dark section relative scroll-mt-[var(--header-h)]">
      <div className="container-x">
        <div className="grid gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index={index}>The Possibilities</Eyebrow>
            <h2 id="compose-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>There is no menu.</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}>
                <span className="italic text-accent">Compose an evening.</span>
              </span>
            </h2>
          </div>
          <p className="text-lead self-end text-fg-muted md:col-span-4 md:col-start-9" data-reveal>
            Every engagement begins with the place, the people and the reason for gathering. Choose
            yours, and read the evening that follows.
          </p>
        </div>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          <div className="min-w-0 space-y-12 md:col-span-6 lg:col-span-5">
            <Dial legend="The room" options={settings.map((x) => ({ id: x.id, label: x.name }))} value={setting} onChange={(v) => choose("setting", v, setSetting)} />
            <Dial legend="The reason" options={occasions.map((x) => ({ id: x.id, label: x.name }))} value={occasion} onChange={(v) => choose("occasion", v, setOccasion)} />
            <Dial legend="The table" options={scales.map((x) => ({ id: x.id, label: x.name, note: x.range }))} value={scale} onChange={(v) => choose("scale", v, setScale)} />
          </div>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <div className="relative aspect-[16/11] overflow-hidden">
                {settings.filter((x) => x.id === setting || x.id === outgoing).map((x) => (
                  <div
                    key={x.id}
                    aria-hidden={x.id !== setting}
                    onTransitionEnd={() => { if (x.id !== setting) setOutgoing(null); }}
                    className={cn(
                      "absolute inset-0 transition-[opacity,clip-path] duration-[1400ms] ease-out-expo",
                      x.id === setting ? "opacity-100 [clip-path:inset(0)]" : "z-10 opacity-0 [clip-path:inset(4%)]",
                    )}
                  >
                    <Plate tone={x.tone} slot={x.slot} alt={`An evening ${x.phrase}.`} label={x.plateLabel} ratio="h-full" reveal={false} sizes="(min-width: 768px) 45vw, 100vw" />
                  </div>
                ))}
              </div>

              <article aria-live="polite" className="border-b border-line pb-10 pt-10">
                <p className="text-eyebrow">{sc.range} · {s.name}</p>
                <h3 key={`${o.id}-${s.id}`} className="text-h2 mt-5 animate-[fade-up_900ms_var(--ease-out-expo)_both]">
                  {o.title}, <span className="italic text-accent">{s.phrase}.</span>
                </h3>
                <p key={`p-${o.id}-${s.id}-${sc.id}`} className="mt-6 max-w-xl text-fg/85 animate-[fade-up_1100ms_var(--ease-out-expo)_80ms_both]">
                  Imagine {o.fragment}. {s.line} {sc.line}
                </p>
                <ul className="mt-8 space-y-3 text-sm text-fg-muted">
                  {s.approach.map((a) => (
                    <li key={a} className="flex gap-4">
                      <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                <Cta href={href} track="cta:compose-begin">Begin with this evening</Cta>
                <Cta href="/experiences" variant="quiet" className="text-fg-muted">The four forms</Cta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Option = { id: string; label: string; note?: string };

// A radio group styled as a line of type. Arrow keys move the selection
// (native radio behaviour); on phones the line becomes a swipeable rail.
function Dial({ legend, options, value, onChange }: { legend: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  const name = useId();
  return (
    // min-w-0: a fieldset defaults to min-content width, which would let the
    // phone rail stretch the whole page sideways.
    <fieldset data-reveal className="min-w-0">
      <legend className="text-eyebrow mb-5 flex w-full items-center gap-4">
        {legend}
        <span aria-hidden className="h-px flex-1 bg-line" />
      </legend>
      <div className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-x-6 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:gap-y-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {options.map((opt) => {
          const id = `${name}-${opt.id}`;
          const checked = opt.id === value;
          return (
            <label key={opt.id} htmlFor={id} className="group relative shrink-0 snap-start py-1">
              <input id={id} type="radio" name={name} value={opt.id} checked={checked} onChange={() => onChange(opt.id)} className="peer sr-only" />
              <span
                className={cn(
                  "block whitespace-nowrap font-display text-[1.45rem] leading-tight transition-colors duration-500 md:text-[1.6rem]",
                  checked ? "text-fg" : "text-fg/55 group-hover:text-fg/85",
                )}
              >
                {checked ? <span className="italic">{opt.label}</span> : opt.label}
              </span>
              {opt.note ? <span className={cn("block text-[0.62rem] uppercase tracking-[0.24em] transition-colors", checked ? "text-accent" : "text-fg-muted")}>{opt.note}</span> : null}
              <span aria-hidden className={cn("absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-700 ease-out-expo", checked ? "scale-x-100" : "scale-x-0")} />
              <span aria-hidden className="pointer-events-none absolute -inset-1 hidden rounded-sm outline outline-1 outline-offset-2 outline-accent peer-focus-visible:block" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
