"use client";
import { useEffect, useId, useRef, useState } from "react";
import { defaults, describe, occasions, resolve, scales, settings, type Dial, type Plan, type ScaleId } from "@/content/possibilities";
import { Plate } from "@/components/ui/Plate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cta } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// "Plan your evening." Three choices — the room, the reason, the scale — and
// the evening is written in front of you, with the photograph of the room
// alongside. The rules in content/possibilities.ts keep every combination
// possible: a choice that rules another out moves it, and says why.
// The plan lives in the address (?room=&reason=&table=), so it can be shared
// or bookmarked, and it carries straight into the request.
const PARAMS = { room: "room", reason: "reason", table: "table" } as const;

export function Composer({ index = "VII" }: { index?: string }) {
  const [plan, setPlan] = useState<Plan>({ ...defaults });
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  // Only the current room and the one fading out are ever painted.
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const interacted = useRef(false);

  // Arrival: a shared or bookmarked plan in the address wins over the default.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (![...Object.values(PARAMS)].some((k) => q.has(k))) return;
    const r = resolve({
      room: q.get(PARAMS.room) ?? defaults.room,
      reason: q.get(PARAMS.reason) ?? defaults.reason,
      table: (q.get(PARAMS.table) ?? defaults.table) as ScaleId,
    });
    setPlan(r.plan);
    setNote(r.note);
  }, []);

  // Keep the address in step with the plan once the visitor has touched it.
  useEffect(() => {
    if (!interacted.current) return;
    const url = new URL(location.href);
    url.searchParams.set(PARAMS.room, plan.room);
    url.searchParams.set(PARAMS.reason, plan.reason);
    url.searchParams.set(PARAMS.table, plan.table);
    url.hash = "possibilities";
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }, [plan]);

  const choose = (dial: Dial, id: string) => {
    if (plan[dial] === id) return;
    interacted.current = true;
    const r = resolve({ ...plan, [dial]: id } as Plan, dial);
    if (r.plan.room !== plan.room) setOutgoing(plan.room);
    setPlan(r.plan);
    setNote(r.note);
    setCopied("idle");
    track("compose_change", { dial, value: id, adjusted: !!r.note });
  };

  const share = async () => {
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set(PARAMS.room, plan.room);
    url.searchParams.set(PARAMS.reason, plan.reason);
    url.searchParams.set(PARAMS.table, plan.table);
    url.hash = "possibilities";
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    track("compose_share", { ...plan });
  };

  const words = describe(plan);
  const href = `/inquire?setting=${plan.room}&occasion=${plan.reason}&scale=${plan.table}`;
  const lesson = plan.reason === "lesson";

  return (
    <section id="possibilities" aria-labelledby="compose-title" className="tone-dark section relative scroll-mt-[var(--header-h)]">
      <div className="container-x">
        <div className="grid gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index={index}>The Planner</Eyebrow>
            <h2 id="compose-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>Plan your</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}>
                <span className="italic text-accent">evening.</span>
              </span>
            </h2>
          </div>
          <p className="text-lead self-end text-fg-muted md:col-span-4 md:col-start-9" data-reveal>
            Choose the room, the reason and the size of the table, and read the evening that follows.
            One tap carries it into your request.
          </p>
        </div>

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
          <div className="min-w-0 space-y-12 md:col-span-6 lg:col-span-5">
            <DialGroup legend="The room" dial="room" options={settings.map((x) => ({ id: x.id, label: x.name }))} value={plan.room} onChange={choose} />
            <DialGroup legend="The reason" dial="reason" options={occasions.map((x) => ({ id: x.id, label: x.name }))} value={plan.reason} onChange={choose} />
            <DialGroup
              legend="The table"
              dial="table"
              options={scales
                .filter((x) => !lesson || x.lessonRange)
                .map((x) => ({ id: x.id, label: x.name, note: lesson ? x.lessonRange : x.range }))}
              value={plan.table}
              onChange={choose}
            />
            {/* Why something moved. Polite, so it never interrupts. */}
            <p aria-live="polite" className={cn("flex gap-4 border-l border-accent/60 pl-4 text-sm text-fg/80 transition-opacity duration-500", note ? "opacity-100" : "sr-only")}>
              {note}
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <div className="relative aspect-[16/11] overflow-hidden">
                {settings.filter((x) => x.id === plan.room || x.id === outgoing).map((x) => (
                  <div
                    key={x.id}
                    aria-hidden={x.id !== plan.room}
                    onTransitionEnd={() => { if (x.id !== plan.room) setOutgoing(null); }}
                    className={cn(
                      "absolute inset-0 transition-[opacity,clip-path] duration-[1400ms] ease-out-expo",
                      x.id === plan.room ? "opacity-100 [clip-path:inset(0)]" : "z-10 opacity-0 [clip-path:inset(4%)]",
                    )}
                  >
                    <Plate tone={x.tone} slot={x.slot} fallback={x.fallback} alt={x.alt} label={x.plateLabel} focus={x.focus} ratio="h-full" reveal={false} sizes="(min-width: 768px) 45vw, 100vw" />
                  </div>
                ))}
              </div>

              <article aria-live="polite" aria-atomic="true" className="border-b border-line pb-10 pt-10">
                <p className="text-eyebrow">{words.eyebrow}</p>
                <h3 key={`${plan.reason}-${plan.room}`} className="text-h2 mt-5 animate-[fade-up_900ms_var(--ease-out-expo)_both]">
                  {words.title}, <span className="italic text-accent">{words.phrase}.</span>
                </h3>
                <p key={`p-${plan.reason}-${plan.room}-${plan.table}`} className="mt-6 max-w-xl text-fg/85 animate-[fade-up_1100ms_var(--ease-out-expo)_80ms_both]">
                  {words.body}
                </p>
                <ul className="mt-8 space-y-3 text-sm text-fg-muted">
                  {words.approach.map((a) => (
                    <li key={a} className="flex gap-4">
                      <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                <Cta href={href} track="cta:compose-begin">Request this evening</Cta>
                <button type="button" onClick={share} className="group inline-flex min-h-11 items-center gap-3 text-[0.74rem] font-medium uppercase tracking-[0.26em] text-fg-muted transition-colors hover:text-fg">
                  <span className="link-underline pb-1">{copied === "copied" ? "Link copied" : "Copy a link to this plan"}</span>
                </button>
                <span aria-live="polite" className="sr-only">{copied === "copied" ? "Link to this plan copied." : ""}</span>
              </div>
              {copied === "failed" ? (
                <p className="mt-4 text-sm text-fg-muted">
                  Copying is blocked in this browser. The address bar already holds this plan; copy it from there.
                </p>
              ) : null}
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
function DialGroup({ legend, dial, options, value, onChange }: { legend: string; dial: Dial; options: Option[]; value: string; onChange: (d: Dial, v: string) => void }) {
  const name = useId();
  return (
    // min-w-0: a fieldset defaults to min-content width, which would let the
    // phone rail stretch the whole page sideways.
    <fieldset data-reveal className="min-w-0">
      <legend className="text-eyebrow mb-4 flex w-full items-center gap-4">
        {legend}
        <span aria-hidden className="h-px flex-1 bg-line" />
      </legend>
      <div className="-mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-x-6 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:gap-y-2 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {options.map((opt) => {
          const id = `${name}-${opt.id}`;
          const checked = opt.id === value;
          return (
            <label key={opt.id} htmlFor={id} className="group relative shrink-0 cursor-pointer snap-start py-2">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(dial, opt.id)}
                onFocus={(e) => e.currentTarget.parentElement?.scrollIntoView({ block: "nearest", inline: "nearest" })}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block whitespace-nowrap font-display text-[1.45rem] leading-tight transition-colors duration-500 md:text-[1.6rem]",
                  checked ? "text-fg" : "text-fg/60 group-hover:text-fg",
                )}
              >
                {checked ? <span className="italic">{opt.label}</span> : opt.label}
              </span>
              {opt.note ? <span className={cn("block text-[0.62rem] uppercase tracking-[0.24em] transition-colors", checked ? "text-accent" : "text-fg-muted")}>{opt.note}</span> : null}
              {/* Hover draws a faint rule; the chosen option keeps a solid one. */}
              <span aria-hidden className={cn("absolute bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-700 ease-out-expo", checked ? "scale-x-100 bg-accent" : "scale-x-0 bg-fg/40 group-hover:scale-x-100")} />
              <span aria-hidden className="pointer-events-none absolute -inset-1 hidden rounded-sm outline outline-1 outline-offset-2 outline-accent peer-focus-visible:block" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
