"use client";
import { useState } from "react";
import { standards } from "@/content/archive";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

// How he works, as an accordion of five sentences. One is always open —
// you are never looking at a closed list — and the open one breathes wider.
export function Standards() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-labelledby="standards-title" className="tone-linen section">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Eyebrow index="—">The Standards</Eyebrow>
          <h2 id="standards-title" className="text-h1 mt-10" data-reveal-group>
            <span className="line-mask"><span>How he</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><span className="italic text-accent">works.</span></span>
          </h2>
          <p className="mt-8 max-w-xs text-fg-muted" data-reveal>Five rules that came from building for screens and survived every room since.</p>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {standards.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={s.title} className="border-t border-line last:border-b" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`standard-${i}`}
                    onClick={() => setOpen(i)}
                    onMouseEnter={() => setOpen(i)}
                    className="grid w-full grid-cols-[2.75rem_1fr] items-baseline gap-4 py-7 text-left md:grid-cols-[4rem_1fr]"
                  >
                    <span className="font-display text-lg italic text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("font-display leading-tight transition-[font-size,color] duration-700 ease-out-expo", isOpen ? "text-[clamp(1.6rem,2.8vw,2.4rem)] text-fg" : "text-[clamp(1.25rem,2vw,1.6rem)] text-fg/55")}>
                      {s.title}
                    </span>
                  </button>
                </h3>
                <div
                  id={`standard-${i}`}
                  role="region"
                  className={cn("grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <p className="overflow-hidden pl-[3.75rem] text-fg-muted md:pl-[5rem]">
                    <span className="block max-w-lg pb-8">{s.body}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
