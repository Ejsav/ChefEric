"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  contactOptions, dateProblem, details, discretionOptions, forms, galleyOptions, guestOptionsFor, guestsFit, isCollab,
  isIntermediary, kitchenOptions, latestDay, localDay, needsKitchen, needsStay, occasionOptions, officeEmail,
  prefillFromParams, roles, settingOptions, stayOptions, stillValid, summarize, whenOptions, type AnswerKey, type Answers,
} from "@/lib/inquiry";
import Link from "next/link";
import { getAttribution, originLines } from "@/lib/attribution";
import { peekInviteName } from "@/lib/invite-public";
import { track } from "@/lib/analytics";
import { getLenis } from "@/lib/lenis";
import { site } from "@/lib/site";
import { cn, submissionId } from "@/lib/utils";
import { Arrow } from "@/components/ui/Cta";

// ─────────────────────────────────────────────────────────────────────────
// The inquiry as a conversation: the first chapter of working with the
// chef. One question at a time, each shaped by the answers before it —
// a planner is asked about their client, a yacht about its galley, a
// collaboration skips the dinner questions entirely. Letter keys choose,
// Enter continues, progress is saved as a draft, and the visitor reads their
// request back as a sentence before it is sent.
// ─────────────────────────────────────────────────────────────────────────

type A = Partial<Answers>;
type StepId = "role" | "form" | "project" | "place" | "details" | "when" | "guests" | "occasion" | "considerations" | "contact" | "review";

const STEPS: { id: StepId; show: (a: A) => boolean; auto?: AnswerKey }[] = [
  { id: "role", show: () => true, auto: "role" },
  { id: "form", show: () => true, auto: "form" },
  { id: "project", show: isCollab },
  { id: "place", show: (a) => !isCollab(a) },
  { id: "details", show: (a) => !isCollab(a) && (needsKitchen(a) || needsStay(a)) },
  { id: "when", show: () => true },
  { id: "guests", show: (a) => !isCollab(a), auto: "guests" },
  { id: "occasion", show: (a) => !isCollab(a) },
  { id: "considerations", show: (a) => !isCollab(a) },
  { id: "contact", show: () => true },
  { id: "review", show: () => true },
];

// Which step owns which answer — used to route server-side errors back.
const OWNER: Partial<Record<string, StepId>> = {
  role: "role", form: "form", project: "project", setting: "place", location: "place", kitchen: "details", stay: "details",
  when: "when", date: "when", season: "when", guests: "guests", occasion: "occasion", atmosphere: "occasion",
  dietary: "considerations", discretion: "considerations", name: "contact", email: "contact", phone: "contact", contactPref: "contact",
};

// Organisation is asked in the project step for collaborations, otherwise
// alongside the practical considerations.
const ownerOf = (key: string, a: A): StepId | undefined =>
  key === "organisation" ? (isCollab(a) ? "project" : "considerations") : OWNER[key];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function stepErrors(id: StepId, a: A): Partial<Record<AnswerKey, string>> {
  const e: Partial<Record<AnswerKey, string>> = {};
  if (id === "role" && !a.role) e.role = "Choose one to continue.";
  if (id === "form" && !a.form) e.form = "Choose one to continue.";
  if (id === "project" && (!a.project || a.project.trim().length < 10)) e.project = "A few lines about the project, please.";
  if (id === "place") {
    if (!a.setting) e.setting = "Choose where the table will be.";
    else if (a.setting !== "undecided" && (!a.location || a.location.trim().length < 2)) e.location = "A town, city or region is enough.";
  }
  if (id === "when") {
    if (!a.when) e.when = "Choose one to continue.";
    else if (a.when === "date") { const p = dateProblem(a.date, localDay()); if (p) e.date = p; }
    else if (a.when === "season" && !a.season?.trim()) e.season = "A month or a season, please.";
  }
  if (id === "guests" && !guestsFit(a.form, a.guests)) e.guests = "Choose one to continue.";
  if (id === "contact") {
    if (!a.name || a.name.trim().length < 2) e.name = "Please share your name.";
    if (!a.email || !EMAIL.test(a.email.trim())) e.email = "Please use a valid email address.";
    if ((a.contactPref === "phone" || a.contactPref === "text") && !a.phone?.trim()) e.phone = "A number, so we can reach you as you prefer.";
  }
  return e;
}

const DRAFT = "ej:inquiry-draft";
type Draft = { answers: A; step: StepId; ts: number };

export function Concierge() {
  const [answers, setAnswers] = useState<A>({});
  const [stepId, setStepId] = useState<StepId>("role");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const [ref, setRef] = useState("");
  const [resume, setResume] = useState<Draft | null>(null);
  const [composed, setComposed] = useState(false);
  const [invite, setInvite] = useState<{ token: string; name: string | null } | null>(null);
  const touched = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const autoTimer = useRef<number>(0);
  const submission = useRef("");
  const [demoMail, setDemoMail] = useState<{ subject: string; text: string } | null>(null);

  const visible = useMemo(() => STEPS.filter((s) => s.show(answers)), [answers]);
  const index = Math.max(0, visible.findIndex((s) => s.id === stepId));
  const step = visible[index] ?? visible[0]!;
  const isLast = step.id === "review";

  // Arrival: URL prefill (composer, experiences, invitations) or a saved draft.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const pre = prefillFromParams(q);
    const token = q.get("invite");
    if (token) setInvite({ token, name: peekInviteName(token) });
    if (Object.keys(pre).length) {
      setAnswers(pre);
      setComposed(!!(pre.setting || pre.occasion || pre.guests));
      return;
    }
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT) ?? "null") as Draft | null;
      if (d && Date.now() - d.ts < 14 * 864e5 && Object.keys(d.answers).length > 1) setResume({ ...d, answers: stillValid(d.answers) });
    } catch {}
  }, []);

  // Keep a draft as they go.
  useEffect(() => {
    if (!touched.current || status === "sent") return;
    try { localStorage.setItem(DRAFT, JSON.stringify({ answers, step: stepId, ts: Date.now() } satisfies Draft)); } catch {}
  }, [answers, stepId, status]);

  // New step: move focus to the question, bring it into view, report it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
    const top = (rootRef.current?.getBoundingClientRect().top ?? 0) + scrollY - 120;
    if (Math.abs(scrollY - top) > 40) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(top, { duration: 1 });
      else window.scrollTo({ top, behavior: "smooth" });
    }
    track("inquiry_step", { step: stepId, index });
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback(<K extends AnswerKey>(key: K, value: Answers[K] | undefined) => {
    touched.current = true;
    setAnswers((a) => stillValid({ ...a, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  const goTo = (id: StepId) => { setErrors({}); setStepId(id); };

  const next = useCallback((from?: A) => {
    const a = from ?? answers;
    const e = stepErrors(step.id, a);
    if (Object.keys(e).length) {
      setErrors(e);
      const first = Object.keys(e)[0];
      rootRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const steps = STEPS.filter((s) => s.show(a));
    const i = steps.findIndex((s) => s.id === step.id);
    const n = steps[i + 1];
    if (n) goTo(n.id);
  }, [answers, step.id]);

  const back = () => { const p = visible[index - 1]; if (p) goTo(p.id); };

  // Pure single-choice steps advance on their own after a choice by pointer or
  // letter key — never on arrow-key browsing, which would yank focus away.
  const choose = (key: AnswerKey, value: string, advance: boolean) => {
    set(key, value as never);
    window.clearTimeout(autoTimer.current);
    if (advance && step.auto === key) {
      const a = { ...answers, [key]: value };
      autoTimer.current = window.setTimeout(() => next(a), 380);
    }
  };

  async function submit() {
    if (status === "sending") return; // a second press while the first is in flight
    if (honeypot.current?.value) { setStatus("sent"); return; }
    setStatus("sending");
    setFormError("");
    // One id per request: a retry after a dropped connection is recognised as
    // the same request, never delivered twice.
    submission.current ||= submissionId();
    const attribution = getAttribution();
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, invite: invite?.token, attribution, submissionId: submission.current, company: "" }),
      });
      const body = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; ref?: string; demo?: boolean; error?: string; errors?: Record<string, string> };
      if (!res.ok || !body.ok) {
        setStatus("idle");
        if (body.errors) {
          setErrors(body.errors);
          const owner = ownerOf(Object.keys(body.errors)[0] ?? "", answers);
          if (owner) setStepId(owner);
        }
        setFormError(body.error ?? "A detail needs another look.");
        return;
      }
      setRef(body.ref ?? "");
      if (body.demo) setDemoMail(officeEmail(answers, body.ref ?? "EJ-DEMO", originLines(attribution)));
      setStatus("sent");
      track("inquiry_submit", { form: answers.form, setting: answers.setting, guests: answers.guests, role: answers.role, invited: !!invite, demo: !!body.demo });
      try { localStorage.removeItem(DRAFT); } catch {}
    } catch {
      setStatus("idle");
      setFormError(`The connection was interrupted. Your answers are saved on this device — please try again in a moment${site.email ? `, or write to ${site.email}` : ""}.`);
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    const typing = t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && (t as HTMLInputElement).type !== "radio");
    if (e.key === "Enter" && !e.shiftKey && t.tagName !== "TEXTAREA" && t.tagName !== "BUTTON" && t.tagName !== "A") {
      e.preventDefault();
      if (isLast) void submit(); else next();
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || !/^[a-z]$/i.test(e.key)) return;
    const group = rootRef.current?.querySelector<HTMLElement>("[data-letters]");
    const option = group?.querySelectorAll<HTMLInputElement>("input[type=radio]")[e.key.toLowerCase().charCodeAt(0) - 97];
    if (option) { e.preventDefault(); option.focus(); option.dataset.viaLetter = "1"; option.click(); }
  };

  // ── Sent ─────────────────────────────────────────────────────────────
  if (status === "sent" && demoMail) {
    return (
      <div role="status" className="animate-[fade-up_1s_var(--ease-out-expo)_both]">
        <p className="text-eyebrow flex items-center gap-4"><span aria-hidden className="h-px w-10 bg-accent" />Demonstration complete{ref ? ` · ${ref}` : ""}</p>
        <h2 className="text-h1 mt-8 max-w-[18ch]">That is the whole <span className="italic text-accent">request.</span></h2>
        <p className="text-lead mt-8 max-w-xl">
          Nothing was booked: Chef Eric Jokl is a demo persona. Your answers were checked by the server and
          discarded, not kept or passed to anyone, and the draft saved in this browser has been cleared. On a
          live site, this is the email the chef would have in their inbox now, with an acknowledgment on its
          way to the client.
        </p>
        <figure className="mt-12 border border-line bg-bg-elevated">
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted sm:px-7">
            <span>What the chef receives</span>
            <span>Reply goes straight to the client</span>
          </figcaption>
          <div className="px-5 py-6 sm:px-7">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-fg-muted">Subject</p>
            <p className="mt-1 break-words font-display text-[1.15rem] leading-snug">{demoMail.subject}</p>
            <pre className="mt-6 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words border-t border-line pt-6 font-body text-sm leading-relaxed text-fg/85">{demoMail.text}</pre>
          </div>
        </figure>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <Link href="/your-site" data-track="cta:inquiry-demo-done" className="cta-primary group">
            <span className="cta-fill" aria-hidden /><span className="relative">Get this website</span><Arrow className="relative transition-transform duration-700 ease-out-expo group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            onClick={() => { setAnswers({}); setStepId("role"); setStatus("idle"); setDemoMail(null); setRef(""); submission.current = ""; }}
            className="link-underline inline-flex min-h-11 items-center text-[0.74rem] font-medium uppercase tracking-[0.26em] text-fg-muted hover:text-fg"
          >
            Try another request
          </button>
        </div>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div role="status" className="animate-[fade-up_1s_var(--ease-out-expo)_both]">
        <p className="text-eyebrow flex items-center gap-4"><span aria-hidden className="h-px w-10 bg-accent" />Received{ref ? ` · ${ref}` : ""}</p>
        <h2 className="text-h1 mt-8 max-w-[16ch]">Your request is with <span className="italic text-accent">Chef Jokl.</span></h2>
        <p className="text-lead mt-8 max-w-lg">{site.responseNote}</p>
        <ol className="mt-14 border-t border-line">
          {[
            ["Read", "Your request is read in full by the chef's office — not sorted by software."],
            ["A conversation", "A call or a note to understand the people, the place and the reason."],
            ["A proposal", "A menu and a plan written for your table, refined together until it is right."],
          ].map(([t, b], i) => (
            <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
              <span className="font-display text-lg italic text-accent">{["i", "ii", "iii"][i]}.</span>
              <div><p className="font-display text-xl">{t}</p><p className="mt-2 text-fg-muted">{b}</p></div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // ── Resume a draft ───────────────────────────────────────────────────
  if (resume) {
    return (
      <div className="animate-[fade-up_900ms_var(--ease-out-expo)_both]">
        <p className="text-eyebrow">Welcome back</p>
        <h2 className="text-h2 mt-6 max-w-[20ch]">You began a request on {new Date(resume.ts).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.</h2>
        <p className="mt-6 max-w-lg font-display text-xl italic text-fg/80">&ldquo;{summarize(resume.answers)}&rdquo;</p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <button type="button" onClick={() => { touched.current = true; setAnswers(resume.answers); setStepId(resume.step); setResume(null); }} className="cta-primary group">
            <span className="cta-fill" aria-hidden /><span className="relative">Continue</span><Arrow className="relative transition-transform duration-700 ease-out-expo group-hover:translate-x-1" />
          </button>
          <button type="button" onClick={() => { try { localStorage.removeItem(DRAFT); } catch {} setResume(null); }} className="link-underline pb-1 text-[0.74rem] font-medium uppercase tracking-[0.26em] text-fg-muted hover:text-fg">
            Start again
          </button>
        </div>
      </div>
    );
  }

  // ── The conversation ─────────────────────────────────────────────────
  const progress = visible.length > 1 ? index / (visible.length - 1) : 0;
  const subject = answers.role === "assistant" ? "they" : answers.role === "planner" ? "your client" : "you";

  return (
    <div ref={rootRef} onKeyDown={onKeyDown}>
      {site.demo && index === 0 ? (
        <p className="mb-10 border-l border-accent/70 pl-4 text-sm text-fg/80">
          <span className="text-eyebrow mb-1 block text-accent">Demonstration</span>
          This is the request your clients would use, so use any details you like. Your progress is saved as a
          draft in this browser only; when you send, the server checks the answers and discards them. Nothing is
          booked, kept or passed to anyone. <Link href="/your-site" className="link-underline text-fg">Get this website</Link>
        </p>
      ) : null}
      {/* Progress */}
      <div className="flex items-center justify-between gap-6 text-[0.66rem] uppercase tracking-[0.26em] text-fg-muted">
        <span aria-live="polite">
          <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(visible.length).padStart(2, "0")}
          <span className="sr-only">: step {index + 1} of {visible.length}</span>
        </span>
        {index > 0 ? (
          <button type="button" onClick={back} className="group flex h-11 items-center gap-3 hover:text-fg">
            <Arrow className="rotate-180 transition-transform duration-700 ease-out-expo group-hover:-translate-x-1" /> Back
          </button>
        ) : <span className="h-11" />}
      </div>
      <div aria-hidden className="mt-3 h-px bg-line">
        <div className="h-px origin-left bg-accent transition-transform duration-1000 ease-out-expo" style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }} />
      </div>

      {index === 0 && (invite?.name || composed) ? (
        <p className="mt-10 font-display text-xl italic text-accent animate-[fade-up_900ms_var(--ease-out-expo)_both]">
          {invite?.name ? `Welcome, ${invite.name}.` : `You composed: ${summarize(answers).replace(/\.$/, "")}.`}
        </p>
      ) : null}

      <div key={step.id} className="mt-12 animate-[fade-up_800ms_var(--ease-out-expo)_both] md:mt-16">
        {step.id === "role" && (
          <Question headingRef={headingRef} title="Who is the evening for?" sub="Every request is read personally. Start by telling us where you are writing from.">
            <Choices field="role" options={roles} value={answers.role} onChoose={(v, adv) => choose("role", v, adv)} error={errors.role} letters />
          </Question>
        )}

        {step.id === "form" && (
          <Question
            headingRef={headingRef}
            title={answers.role === "venue" ? "What are you imagining for your guests?" : answers.role === "planner" ? "What is your client imagining?" : answers.role === "assistant" ? "What are they imagining?" : "What are you imagining?"}
            sub="Choose the closest. Everything can be shaped later."
          >
            <Choices
              field="form"
              options={answers.role === "brand" || answers.role === "venue" ? [...forms.filter((f) => f.id === "collaboration"), ...forms.filter((f) => f.id !== "collaboration")] : forms}
              value={answers.form}
              onChoose={(v, adv) => choose("form", v, adv)}
              error={errors.form}
              letters
            />
          </Question>
        )}

        {step.id === "project" && (
          <Question headingRef={headingRef} title="Tell us about the project." sub="What it is, who it is for, and what you would like the chef to bring to it.">
            <TextArea field="project" label="The project" value={answers.project} onChange={(v) => set("project", v)} error={errors.project} rows={6} autoFocus />
            <Text field="organisation" label="Brand, company or production" value={answers.organisation} onChange={(v) => set("organisation", v)} optional autoComplete="organization" />
          </Question>
        )}

        {step.id === "place" && (
          <Question headingRef={headingRef} title="Where will the table be?" sub="Geography is never the limit. Name the town, the marina, the island — whatever you can share.">
            <Choices field="setting" options={settingOptions} value={answers.setting} onChoose={(v) => choose("setting", v, false)} error={errors.setting} letters columns />
            {answers.setting && answers.setting !== "undecided" ? (
              <Text
                field="location"
                label={answers.setting === "yacht" ? "Where will the yacht be?" : answers.setting === "island" ? "Which island, or which waters?" : answers.setting === "abroad" ? "Which country or region?" : "Town, city or region"}
                value={answers.location}
                onChange={(v) => set("location", v)}
                error={errors.location}
                placeholder={answers.setting === "yacht" ? "Newport, the Bahamas, the Riviera…" : "Greenwich, the Upper East Side, Sag Harbor…"}
              />
            ) : null}
          </Question>
        )}

        {step.id === "details" && (
          <Question headingRef={headingRef} title="A few practical things." sub="So the first conversation can be about the evening, not the logistics.">
            {needsKitchen(answers) ? (
              <Choices
                field="kitchen"
                legend={answers.setting === "yacht" ? "The galley" : "The kitchen"}
                options={answers.setting === "yacht" ? galleyOptions : kitchenOptions}
                value={answers.kitchen}
                onChoose={(v) => choose("kitchen", v, false)}
                letters
              />
            ) : null}
            {needsStay(answers) ? (
              <Choices field="stay" legend="How long is the stay?" options={stayOptions} value={answers.stay} onChoose={(v) => choose("stay", v, false)} letters={!needsKitchen(answers)} />
            ) : null}
          </Question>
        )}

        {step.id === "when" && (
          <Question headingRef={headingRef} title="When are you thinking?" sub={`Tell us as much as ${subject === "you" ? "you know" : `${subject} know${subject === "they" ? "" : "s"}`}.`}>
            <Choices field="when" options={whenOptions} value={answers.when} onChoose={(v) => choose("when", v, false)} error={errors.when} letters />
            {answers.when === "date" ? (
              <Text field="date" label="The date" type="date" value={answers.date} onChange={(v) => set("date", v)} error={errors.date} min={localDay()} max={latestDay(localDay())} />
            ) : null}
            {answers.when === "season" ? (
              <Text field="season" label="Month or season" value={answers.season} onChange={(v) => set("season", v)} error={errors.season} placeholder="Late June, the holidays, next spring…" />
            ) : null}
          </Question>
        )}

        {step.id === "guests" && (
          <Question headingRef={headingRef} title={answers.form === "lesson" ? "How many will be cooking?" : "How many at the table?"} sub="An estimate is perfect.">
            <Choices field="guests" options={guestOptionsFor(answers.form)} value={answers.guests} onChoose={(v, adv) => choose("guests", v, adv)} error={errors.guests} letters />
          </Question>
        )}

        {step.id === "occasion" && (
          <Question headingRef={headingRef} title="What is the occasion?" sub="And, if you like, the atmosphere you have in mind.">
            <Choices field="occasion" options={occasionOptions} value={answers.occasion} onChoose={(v) => choose("occasion", v, false)} letters columns />
            <TextArea field="atmosphere" label="The atmosphere" value={answers.atmosphere} onChange={(v) => set("atmosphere", v)} optional placeholder="Candlelit and quiet. Loud and long. A surprise. A table nobody wants to leave…" />
          </Question>
        )}

        {step.id === "considerations" && (
          <Question headingRef={headingRef} title="Anything the chef should know?" sub="All of this is optional — and all of it helps.">
            <TextArea field="dietary" label="Allergies and preferences" value={answers.dietary} onChange={(v) => set("dietary", v)} optional rows={3} placeholder="Allergies, things nobody at the table eats, favourite things…" />
            <Choices field="discretion" legend="Discretion" options={discretionOptions} value={answers.discretion} onChoose={(v) => choose("discretion", v, false)} letters />
            {isIntermediary(answers) ? (
              <Text
                field="organisation"
                label={answers.role === "planner" ? "Your firm" : answers.role === "venue" ? "The property" : "Household office or company"}
                value={answers.organisation}
                onChange={(v) => set("organisation", v)}
                optional
                autoComplete="organization"
              />
            ) : null}
          </Question>
        )}

        {step.id === "contact" && (
          <Question headingRef={headingRef} title={answers.role === "host" || !answers.role ? "And who should we write back to?" : "And how do we reach you?"} sub={site.demo ? "On a live site, used only to reply to this request. On this demo, it stays in this browser's draft until you send; the server then checks it and discards it." : "Used only to reply to this request. Never shared, never added to a list."}>
            <div className="grid gap-x-10 md:grid-cols-2">
              <Text field="name" label="Your name" value={answers.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" />
              <Text field="email" label="Email" type="email" value={answers.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" inputMode="email" />
              <Text field="phone" label="Telephone" type="tel" value={answers.phone} onChange={(v) => set("phone", v)} error={errors.phone} autoComplete="tel" optional={answers.contactPref !== "phone" && answers.contactPref !== "text"} />
            </div>
            <Choices field="contactPref" legend="Preferred reply" options={contactOptions} value={answers.contactPref} onChoose={(v) => choose("contactPref", v, false)} inline />
          </Question>
        )}

        {step.id === "review" && (
          <Question headingRef={headingRef} title="Your request, as we will read it." sub="Change anything before it is sent.">
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] italic leading-snug text-fg">&ldquo;{summarize(answers)}&rdquo;</p>
            <dl className="mt-10 border-t border-line">
              {details(answers).map((r) => (
                <div key={r.key} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line py-4 sm:grid-cols-[10rem_1fr_auto]">
                  <dt className="text-[0.66rem] uppercase tracking-[0.24em] text-fg-muted">{r.label}</dt>
                  <dd className="col-span-2 row-start-2 whitespace-pre-line break-words text-fg sm:col-span-1 sm:row-start-auto">{r.value}</dd>
                  <dd className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
                    {ownerOf(r.key, answers) ? (
                      <button type="button" onClick={() => goTo(ownerOf(r.key, answers)!)} className="link-underline inline-flex min-h-6 items-center text-[0.66rem] uppercase tracking-[0.24em] text-accent">
                        Edit<span className="sr-only"> {r.label}</span>
                      </button>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input ref={honeypot} id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
          </Question>
        )}
      </div>

      {/* Actions */}
      <div className="mt-14 flex flex-col-reverse gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.66rem] uppercase tracking-[0.24em] text-fg-muted">
          {isLast
            ? site.demo ? "Demonstration: sending shows what a chef would receive. Nothing is booked." : "Nothing is booked until you have spoken with the chef's office."
            : <>Press <kbd className="font-body text-fg">Enter ↵</kbd> to continue</>}
        </p>
        <button
          type="button"
          onClick={() => (isLast ? void submit() : next())}
          disabled={status === "sending"}
          data-magnetic="0.2"
          className="cta-primary group self-start sm:self-auto"
        >
          <span className="cta-fill" aria-hidden />
          <span className="relative">{isLast ? (status === "sending" ? "Sending…" : "Send the request") : "Continue"}</span>
          <Arrow className="relative transition-transform duration-700 ease-out-expo group-hover:translate-x-1" />
        </button>
      </div>
      <p role="alert" className={cn("mt-6 text-sm text-[#d98c88]", !formError && "sr-only")}>{formError}</p>
    </div>
  );
}

// ── Building blocks ────────────────────────────────────────────────────

function Question({ title, sub, children, headingRef }: { title: string; sub?: string; children: React.ReactNode; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-h1 max-w-[18ch] outline-none">{title}</h2>
      {sub ? <p className="mt-6 max-w-lg text-fg-muted">{sub}</p> : null}
      <div className="mt-12 space-y-12">{children}</div>
    </div>
  );
}

type ChoiceOpt = { readonly id: string; readonly label: string; readonly hint?: string };

function Choices({
  field, options, value, onChoose, error, legend, letters, columns, inline,
}: {
  field: string;
  options: readonly ChoiceOpt[];
  value?: string;
  onChoose: (v: string, advance: boolean) => void;
  error?: string;
  legend?: string;
  letters?: boolean;
  columns?: boolean;
  inline?: boolean;
}) {
  const name = useId();
  const pointer = useRef(false);
  return (
    <fieldset className="min-w-0" data-letters={letters ? "" : undefined} aria-describedby={error ? `${name}-err` : undefined}>
      <legend className={legend ? "text-eyebrow mb-5" : "sr-only"}>{legend ?? "Choose one"}</legend>
      <div className={cn(inline ? "flex flex-wrap gap-3" : columns ? "grid gap-x-8 sm:grid-cols-2" : "grid", !inline && "border-t border-line")}>
        {options.map((o, i) => {
          const checked = o.id === value;
          const id = `${name}-${o.id}`;
          return (
            <label
              key={o.id}
              htmlFor={id}
              onPointerDown={() => { pointer.current = true; }}
              className={cn(
                "group relative flex cursor-pointer items-baseline gap-5 transition-colors duration-500",
                inline ? "border px-5 py-3 text-sm" : "border-b border-line py-5",
                inline && (checked ? "border-accent text-fg" : "border-line text-fg/60 hover:text-fg"),
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.id}
                checked={checked}
                data-field={i === 0 ? field : undefined}
                onChange={(e) => {
                  const viaLetter = e.currentTarget.dataset.viaLetter === "1";
                  delete e.currentTarget.dataset.viaLetter;
                  onChoose(o.id, pointer.current || viaLetter);
                  pointer.current = false;
                }}
                onClick={(e) => {
                  // Re-choosing the current answer by pointer still advances.
                  if (checked && pointer.current) { onChoose(o.id, true); pointer.current = false; }
                  void e;
                }}
                className="peer sr-only"
              />
              {!inline ? (
                <span aria-hidden className={cn("flex h-6 w-6 shrink-0 items-center justify-center border text-[0.62rem] uppercase transition-colors duration-500", checked ? "border-accent bg-accent text-[rgb(var(--ink))]" : "border-line text-fg-muted group-hover:border-fg/50")}>
                  {letters ? String.fromCharCode(65 + i) : ""}
                </span>
              ) : null}
              <span className="min-w-0">
                <span className={cn(inline ? "" : "block font-display text-[1.35rem] leading-snug transition-colors duration-500 md:text-[1.55rem]", !inline && (checked ? "text-fg" : "text-fg/65 group-hover:text-fg"))}>
                  {checked && !inline ? <span className="italic">{o.label}</span> : o.label}
                </span>
                {o.hint ? <span className="mt-1 block text-sm text-fg-muted">{o.hint}</span> : null}
              </span>
              <span aria-hidden className="pointer-events-none absolute -inset-x-2 inset-y-1 hidden outline outline-1 outline-accent peer-focus-visible:block" />
            </label>
          );
        })}
      </div>
      {error ? <p id={`${name}-err`} className="mt-3 text-sm text-[#d98c88]">{error}</p> : null}
    </fieldset>
  );
}

type TextProps = {
  field: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

function Text({ field, label, value, onChange, error, optional, ...rest }: TextProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-eyebrow">{label}</label>
        {optional ? <span className="text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted">Optional</span> : null}
      </div>
      <input
        id={id}
        data-field={field}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="field [color-scheme:dark]"
        {...rest}
      />
      {error ? <p id={`${id}-err`} className="mt-2 text-sm text-[#d98c88]">{error}</p> : null}
    </div>
  );
}

function TextArea({ field, label, value, onChange, error, optional, rows = 4, placeholder, autoFocus }: { field: string; label: string; value?: string; onChange: (v: string) => void; error?: string; optional?: boolean; rows?: number; placeholder?: string; autoFocus?: boolean }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-eyebrow">{label}</label>
        {optional ? <span className="text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted">Optional</span> : null}
      </div>
      <textarea
        id={id}
        data-field={field}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="field"
      />
      {error ? <p id={`${id}-err`} className="mt-2 text-sm text-[#d98c88]">{error}</p> : null}
    </div>
  );
}
