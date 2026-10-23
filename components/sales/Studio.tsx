"use client";
import { useState } from "react";
import { examples, palettes } from "@/content/offer";
import { MiniHero } from "@/components/sales/MiniHero";
import { Cta } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// "Your name here", literally: type a name, a title and a place, choose a
// palette, and watch the hero reset itself. All four choices travel into the
// website request (and from there into the lead). Nothing is sent from here.
const DEFAULT_LINE = "Private dinners, by arrangement.";

export function Studio() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Private Chef");
  const [place, setPlace] = useState("");
  const [palette, setPalette] = useState<string>("brass");
  const [line, setLine] = useState(DEFAULT_LINE);
  const [used, setUsed] = useState(false);

  const accent = palettes.find((p) => p.id === palette)!.accent;
  const tidy = (s: string) => s.trim().replace(/\s+/g, " ").slice(0, 40);
  const clean = tidy(name);
  const preview = { name: clean, title: tidy(role), place: tidy(place), palette };
  const href = `/your-site/start?${new URLSearchParams(Object.entries(preview).filter(([, v]) => v)).toString()}`;

  const touch = () => { if (!used) { setUsed(true); track("studio_use"); } };

  return (
    <div className="grid gap-12 md:grid-cols-12 md:items-start">
      <div className="space-y-8 md:col-span-5">
        <div>
          <p className="text-eyebrow mb-3">Try an example</p>
          <p className="mb-4 text-sm text-fg-muted">Invented names, to show the range. Not client sites.</p>
          <div className="flex flex-wrap gap-3">
            {examples.map((x) => (
              <button
                key={x.name}
                type="button"
                onClick={() => { setName(x.name); setRole(x.role); setPlace(x.place); setPalette(x.palette); setLine(x.line); touch(); track("studio_example", { example: x.palette }); }}
                className="inline-flex min-h-11 items-center border border-line px-4 text-sm text-fg/80 transition-colors hover:border-fg/40 hover:text-fg"
              >
                {x.role} · {x.place}
              </button>
            ))}
          </div>
        </div>

        <Field id="studio-name" label="Your name" value={name} onChange={(v) => { setName(v); touch(); }} placeholder="e.g. Sofia Marchetti" autoComplete="name" />
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="studio-role" label="Title" value={role} onChange={(v) => { setRole(v); touch(); }} placeholder="Private Chef" />
          <Field id="studio-place" label="Where" value={place} onChange={(v) => { setPlace(v); touch(); }} placeholder="New York" />
        </div>

        <fieldset>
          <legend className="text-eyebrow mb-4">Palette</legend>
          <div className="flex flex-wrap gap-3">
            {palettes.map((p) => (
              <label key={p.id} className={cn("group relative inline-flex min-h-11 cursor-pointer items-center gap-3 border px-4 text-sm transition-colors", palette === p.id ? "border-accent text-fg" : "border-line text-fg/70 hover:border-fg/40 hover:text-fg")}>
                <input type="radio" name="studio-palette" value={p.id} checked={palette === p.id} onChange={() => { setPalette(p.id); touch(); }} className="peer sr-only" />
                <span aria-hidden className="h-3.5 w-3.5 rounded-full" style={{ background: `rgb(${p.accent})` }} />
                {p.label}
                <span aria-hidden className="pointer-events-none absolute -inset-1 hidden outline outline-1 outline-accent peer-focus-visible:block" />
              </label>
            ))}
          </div>
        </fieldset>

        <p className="text-sm text-fg-muted">Nothing is sent until you start your request.</p>
        <Cta href={href} track="cta:studio-start">Start with this</Cta>
      </div>

      <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:col-span-6 md:col-start-7">
        <div aria-live="polite" aria-label="Preview">
          <MiniHero name={clean} role={role.trim() || "Private Chef"} place={place.trim()} line={line} accent={accent} />
        </div>
        <p className="mt-4 text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted">Live preview · the opening of your home page</p>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-eyebrow">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "off"}
        maxLength={40}
        className="mt-2 w-full border-b border-line bg-transparent pb-3 pt-1 font-display text-[1.5rem] text-fg outline-none transition-colors placeholder:text-fg/35 focus:border-accent"
      />
    </div>
  );
}
