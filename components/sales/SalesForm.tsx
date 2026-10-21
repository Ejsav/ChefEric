"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { budgets, businessTypes, designChoices, featureChoices, onboarding, palettes, timelines } from "@/content/offer";
import { checkRequest, type WebsiteField, type WebsiteRequest } from "@/lib/sales";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { builder, site } from "@/lib/site";
import { cn, submissionId } from "@/lib/utils";
import { Arrow } from "@/components/ui/Cta";

// The request for a website. One page, four short groups, nothing asked that
// the first call would not need. Errors show beside their field and in a
// summary that takes focus; the draft is kept on this device until the
// request has arrived; a request can never be sent twice.

type Draft = Partial<WebsiteRequest>;
const DRAFT = "ej:website-request";
const ORDER: WebsiteField[] = ["name", "email", "phone", "business", "website", "type", "design", "timeline", "budget", "notes"];

export function SalesForm() {
  const [r, setR] = useState<Draft>({ features: [] });
  const [errors, setErrors] = useState<Partial<Record<WebsiteField, string>>>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState<{ ref: string; acknowledged: boolean } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const started = useRef(0);
  const submission = useRef("");
  const touched = useRef(false);

  // Arrival: a name or palette carried from /your-site, else a saved draft.
  useEffect(() => {
    started.current = Date.now();
    let draft: Draft = {};
    try { draft = JSON.parse(localStorage.getItem(DRAFT) ?? "{}") as Draft; } catch {}
    const q = new URLSearchParams(location.search);
    const name = q.get("name")?.trim().slice(0, 120);
    const palette = palettes.find((p) => p.id === q.get("palette"))?.id;
    setR((prev) => ({
      ...prev,
      ...draft,
      ...(name ? { name } : {}),
      ...(palette && palette !== "brass" ? { design: "palette" as const, palette } : {}),
      features: draft.features ?? [],
    }));
  }, []);

  // Keep the draft as they type; it is removed once the request arrives.
  useEffect(() => {
    if (!touched.current || status === "sent") return;
    try { localStorage.setItem(DRAFT, JSON.stringify(r)); } catch {}
  }, [r, status]);

  const set = <K extends WebsiteField>(key: K, value: WebsiteRequest[K] | undefined) => {
    if (!touched.current) { touched.current = true; track("sales_form_start"); }
    const next = { ...r, [key]: value };
    setR(next);
    if (tried) setErrors(checkRequest(next));
  };

  const toggleFeature = (id: WebsiteRequest["features"][number]) =>
    set("features", (r.features ?? []).includes(id) ? (r.features ?? []).filter((f) => f !== id) : [...(r.features ?? []), id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setTried(true);
    const found = checkRequest(r);
    setErrors(found);
    if (Object.keys(found).length) {
      setFormError("");
      track("sales_form_error", { fields: Object.keys(found).length });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("sending");
    setFormError("");
    submission.current ||= submissionId();
    try {
      const res = await fetch("/api/website-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...r,
          palette: r.design === "palette" ? r.palette : undefined,
          submissionId: submission.current,
          startedAt: started.current,
          attribution: getAttribution(),
          company: honeypot.current?.value ?? "",
        }),
      });
      const body = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; ref?: string; acknowledged?: boolean; error?: string; errors?: Partial<Record<WebsiteField, string>> };
      if (!res.ok || !body.ok) {
        setStatus("idle");
        if (body.errors) {
          setErrors(body.errors);
          requestAnimationFrame(() => summaryRef.current?.focus());
        }
        setFormError(body.error ?? "Something went wrong. Your answers are saved; please try again.");
        track("sales_form_error", { status: res.status });
        return;
      }
      setDone({ ref: body.ref ?? "", acknowledged: !!body.acknowledged });
      setStatus("sent");
      try { localStorage.removeItem(DRAFT); } catch {}
      track("sales_form_submit", { type: r.type, design: r.design, timeline: r.timeline, budget: r.budget, features: r.features?.length ?? 0 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("idle");
      setFormError(`The connection was interrupted. Your answers are saved on this device; please try again in a moment${site.email ? `, or write to ${site.email}` : ""}.`);
    }
  }

  if (status === "sent" && done) {
    const first = r.name?.trim().split(/\s+/)[0];
    return (
      <div role="status" className="animate-[fade-up_1s_var(--ease-out-expo)_both]">
        <p className="text-eyebrow flex items-center gap-4"><span aria-hidden className="h-px w-10 bg-accent" />Received · {done.ref}</p>
        <h2 className="text-h1 mt-8 max-w-[16ch]">Thank you{first ? `, ${first}` : ""}. <span className="italic text-accent">It has arrived.</span></h2>
        <p className="text-lead mt-8 max-w-xl">
          {builder.name} will reply personally within one business day to set up a short call.
          {done.acknowledged ? ` A confirmation is on its way to ${r.email}.` : ` Keep your reference, ${done.ref}, in case you want to follow up.`}
        </p>
        <ol className="mt-14 border-t border-line">
          {onboarding.slice(1, 4).map((s, i) => (
            <li key={s.step} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
              <span className="font-display text-lg italic text-accent">{["i", "ii", "iii"][i]}.</span>
              <div>
                <p className="font-display text-xl">{s.step} <span className="text-fg-muted">· {s.time}</span></p>
                <p className="mt-2 text-fg-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Link href="/" className="link-underline inline-flex min-h-11 items-center text-[0.74rem] font-medium uppercase tracking-[0.26em] text-fg-muted hover:text-fg">Back to the demo</Link>
        </div>
      </div>
    );
  }

  const list = (Object.keys(errors) as WebsiteField[]).filter((k) => errors[k]).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

  return (
    <form noValidate onSubmit={submit} aria-describedby="form-privacy">
      {list.length ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-12 border-l border-[#d98c88] pl-5">
          <p className="font-display text-[1.35rem]">{list.length === 1 ? "One detail needs another look." : `${list.length} details need another look.`}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {list.map((k) => (
              <li key={k}><a href={`#f-${k}`} className="link-underline text-[#e3a19d]">{errors[k]}</a></li>
            ))}
          </ul>
        </div>
      ) : null}

      <Group n="01" title="You">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <Text field="name" label="Your name" value={r.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" />
          <Text field="email" label="Email" type="email" value={r.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" inputMode="email" />
          <Text field="phone" label="Telephone" type="tel" value={r.phone} onChange={(v) => set("phone", v)} error={errors.phone} autoComplete="tel" optional />
        </div>
      </Group>

      <Group n="02" title="Your business">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <Text field="business" label="Business name" value={r.business} onChange={(v) => set("business", v)} error={errors.business} autoComplete="organization" />
          <Text field="website" label="Current website" value={r.website} onChange={(v) => set("website", v)} error={errors.website} autoComplete="url" inputMode="url" placeholder="yourname.com" optional />
        </div>
        <Chips field="type" legend="What you do" options={businessTypes} value={r.type} onChange={(v) => set("type", v as WebsiteRequest["type"])} error={errors.type} />
      </Group>

      <Group n="03" title="The site">
        <Cards field="design" legend="The design" options={designChoices} value={r.design} onChange={(v) => set("design", v as WebsiteRequest["design"])} error={errors.design} />
        {r.design === "palette" ? (
          <Chips
            field="palette"
            legend="A palette to start from"
            options={palettes}
            value={r.palette}
            onChange={(v) => set("palette", v as WebsiteRequest["palette"])}
            swatch={(id) => palettes.find((p) => p.id === id)!.accent}
          />
        ) : null}
        <fieldset className="min-w-0">
          <legend className="text-eyebrow mb-2">Features you would like <span className="normal-case tracking-normal text-fg-muted">(optional)</span></legend>
          <p className="mb-5 text-sm text-fg-muted">The request form, hosting, analytics and the pages in this demo are always included.</p>
          <div className="flex flex-wrap gap-3">
            {featureChoices.map((f) => {
              const on = (r.features ?? []).includes(f.id);
              return (
                <label key={f.id} className={cn("group relative inline-flex min-h-11 cursor-pointer items-center gap-3 border px-4 text-sm transition-colors duration-300", on ? "border-accent text-fg" : "border-line text-fg/70 hover:border-fg/40 hover:text-fg")}>
                  <input type="checkbox" checked={on} onChange={() => toggleFeature(f.id)} className="peer sr-only" />
                  <span aria-hidden className={cn("flex h-4 w-4 items-center justify-center border text-[0.6rem]", on ? "border-accent bg-accent text-[rgb(var(--ink))]" : "border-fg/40")}>{on ? "✓" : ""}</span>
                  {f.label}
                  <span aria-hidden className="pointer-events-none absolute -inset-1 hidden outline outline-1 outline-accent peer-focus-visible:block" />
                </label>
              );
            })}
          </div>
        </fieldset>
      </Group>

      <Group n="04" title="Timing and budget">
        <Chips field="timeline" legend="When would you like to launch?" options={timelines} value={r.timeline} onChange={(v) => set("timeline", v as WebsiteRequest["timeline"])} error={errors.timeline} />
        <Cards field="budget" legend="Budget" options={budgets} value={r.budget} onChange={(v) => set("budget", v as WebsiteRequest["budget"])} error={errors.budget} />
        <TextArea field="notes" label="Anything else" value={r.notes} onChange={(v) => set("notes", v)} error={errors.notes} placeholder="Your cooking, your clients, a site you admire, a date you are working towards…" />
      </Group>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-field">Company</label>
        <input ref={honeypot} id="company-field" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-14 flex flex-col-reverse gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-privacy" className="max-w-sm text-sm text-fg-muted">
          Used only to reply to you. Never shared or added to a list. <Link href="/privacy" className="link-underline text-fg/85">Privacy</Link>
        </p>
        <button type="submit" disabled={status === "sending"} aria-disabled={status === "sending"} data-magnetic="0.2" className="cta-primary group self-start sm:self-auto">
          <span className="cta-fill" aria-hidden />
          <span className="relative">{status === "sending" ? "Sending…" : "Send the request"}</span>
          <Arrow className="relative transition-transform duration-700 ease-out-expo group-hover:translate-x-1" />
        </button>
      </div>
      <p role="alert" className={cn("mt-6 text-sm text-[#e3a19d]", !formError && "sr-only")}>{formError}</p>
    </form>
  );
}

// ── Building blocks ────────────────────────────────────────────────────

function Group({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pb-12 pt-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-baseline gap-4">
        <span className="font-display text-lg italic text-accent">{n}</span>
        <span className="font-display text-[1.7rem] leading-tight">{title}</span>
      </h2>
      <div className="mt-8 space-y-10">{children}</div>
    </section>
  );
}

type TextProps = { field: WebsiteField; label: string; value?: string; onChange: (v: string) => void; error?: string; optional?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

function Text({ field, label, value, onChange, error, optional, ...rest }: TextProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={`f-${field}`} className="text-eyebrow">{label}</label>
        {optional ? <span className="text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted">Optional</span> : null}
      </div>
      <input
        id={`f-${field}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `f-${field}-err` : undefined}
        required={!optional}
        className="field [color-scheme:dark]"
        {...rest}
      />
      {error ? <p id={`f-${field}-err`} className="mt-2 text-sm text-[#e3a19d]">{error}</p> : null}
    </div>
  );
}

function TextArea({ field, label, value, onChange, error, placeholder }: { field: WebsiteField; label: string; value?: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={`f-${field}`} className="text-eyebrow">{label}</label>
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted">Optional</span>
      </div>
      <textarea
        id={`f-${field}`}
        rows={4}
        maxLength={2000}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `f-${field}-err` : undefined}
        className="field"
      />
      {error ? <p id={`f-${field}-err`} className="mt-2 text-sm text-[#e3a19d]">{error}</p> : null}
    </div>
  );
}

type Opt = { readonly id: string; readonly label: string; readonly hint?: string };

/** Single choice as a row of chips. */
function Chips({ field, legend, options, value, onChange, error, swatch }: { field: string; legend: string; options: readonly Opt[]; value?: string; onChange: (v: string) => void; error?: string; swatch?: (id: string) => string }) {
  const name = useId();
  return (
    <fieldset id={`f-${field}`} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="text-eyebrow mb-5">{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label key={o.id} className={cn("group relative inline-flex min-h-11 cursor-pointer items-center gap-3 border px-4 text-sm transition-colors duration-300", on ? "border-accent text-fg" : "border-line text-fg/70 hover:border-fg/40 hover:text-fg")}>
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} className="peer sr-only" />
              {swatch ? <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: `rgb(${swatch(o.id)})` }} /> : null}
              {on ? <span className="italic">{o.label}</span> : o.label}
              <span aria-hidden className="pointer-events-none absolute -inset-1 hidden outline outline-1 outline-accent peer-focus-visible:block" />
            </label>
          );
        })}
      </div>
      {error ? <p id={`${name}-err`} className="mt-3 text-sm text-[#e3a19d]">{error}</p> : null}
    </fieldset>
  );
}

/** Single choice as cards with a hint line. */
function Cards({ field, legend, options, value, onChange, error }: { field: string; legend: string; options: readonly Opt[]; value?: string; onChange: (v: string) => void; error?: string }) {
  const name = useId();
  return (
    <fieldset id={`f-${field}`} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="text-eyebrow mb-5">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label key={o.id} className={cn("group relative flex cursor-pointer gap-4 border p-5 transition-colors duration-300", on ? "border-accent bg-[rgb(var(--accent)/0.06)]" : "border-line hover:border-fg/40")}>
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} className="peer sr-only" />
              <span aria-hidden className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full border", on ? "border-accent bg-accent" : "border-fg/40")} />
              <span className="min-w-0">
                <span className={cn("block font-display text-[1.25rem] leading-snug", on ? "text-fg" : "text-fg/80")}>{o.label}</span>
                {o.hint ? <span className="mt-1 block text-sm text-fg-muted">{o.hint}</span> : null}
              </span>
              <span aria-hidden className="pointer-events-none absolute -inset-1 hidden outline outline-1 outline-accent peer-focus-visible:block" />
            </label>
          );
        })}
      </div>
      {error ? <p id={`${name}-err`} className="mt-3 text-sm text-[#e3a19d]">{error}</p> : null}
    </fieldset>
  );
}
