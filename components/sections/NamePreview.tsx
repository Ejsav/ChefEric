"use client";
import { useState } from "react";
import { Cta } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";

// "Your name here", literally: the visitor types a name and sees it set the
// way the hero sets "Chef Eric Jokl". The name travels into the request.
export function NamePreview() {
  const [name, setName] = useState("");
  const clean = name.trim().replace(/\s+/g, " ").slice(0, 40);
  const [first, ...rest] = (clean || "Your Name").split(" ");
  const last = rest.join(" ");
  const href = `/inquire?about=website${clean ? `&name=${encodeURIComponent(clean)}` : ""}`;

  return (
    <div className="grid gap-12 md:grid-cols-12 md:items-end">
      <div className="md:col-span-5">
        <label htmlFor="preview-name" className="text-eyebrow">Type your name</label>
        <input
          id="preview-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => clean && track("template_name_preview")}
          placeholder="e.g. Sofia Marchetti"
          autoComplete="name"
          maxLength={40}
          className="mt-4 w-full border-b border-line bg-transparent pb-3 font-display text-[1.6rem] text-fg outline-none transition-colors placeholder:text-fg/30 focus:border-accent"
        />
        <p className="mt-4 text-sm text-fg-muted">Nothing is sent until you start your request.</p>
        <div className="mt-10"><Cta href={href} track="cta:your-site-name">Start with this name</Cta></div>
      </div>
      <div aria-live="polite" className="relative overflow-hidden border border-line bg-[rgb(var(--espresso))] p-8 text-[rgb(var(--ivory))] md:col-span-6 md:col-start-7 md:p-12">
        <div aria-hidden className="absolute inset-x-[-20%] bottom-[-60%] h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.3),transparent_70%)]" />
        <p className="relative flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.3em] text-[rgb(168_155_140)]">
          <span aria-hidden className="h-px w-8 bg-[rgb(var(--brass))]" />Private Chef
        </p>
        <p className="relative mt-6 break-words font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] tracking-[-0.02em]">
          <span className="mr-[0.2em] align-[0.6em] text-[0.24em] italic text-[rgb(var(--brass))]">Chef</span>
          {first}
          {last ? <span className="block pl-[0.6em] italic">{last}</span> : null}
        </p>
      </div>
    </div>
  );
}
