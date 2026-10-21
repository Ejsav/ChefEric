import { cn } from "@/lib/utils";

// The demo's hero in miniature: the same type, light and rhythm, set with
// someone else's name, place and palette. Pure, so it renders on the server
// for the examples and live inside the customization studio.
export type MiniHeroProps = {
  name: string;
  role: string;
  place: string;
  line: string;
  /** "R G B" accent triplet */
  accent: string;
  size?: "lg" | "sm";
  className?: string;
};

export function MiniHero({ name, role, place, line, accent, size = "lg", className }: MiniHeroProps) {
  const words = (name.trim() || "Your Name").replace(/\s+/g, " ").split(" ");
  const first = words[0]!;
  const rest = words.slice(1).join(" ");
  const prefix = role.toLowerCase().includes("chef") ? "Chef" : null;
  return (
    <div
      className={cn("relative isolate overflow-hidden border border-[rgba(237,229,214,0.12)] bg-[rgb(var(--espresso))] text-[rgb(var(--ivory))]", size === "lg" ? "p-7 sm:p-10 md:p-12" : "p-6", className)}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div aria-hidden className="absolute inset-x-[-20%] bottom-[-60%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(var(--accent)/0.28),transparent_70%)] transition-[background] duration-700" />
      <p className={cn("flex items-start gap-3 uppercase leading-relaxed text-[rgb(168_155_140)]", size === "lg" ? "text-[0.62rem] tracking-[0.3em]" : "text-[0.6rem] tracking-[0.24em]")}>
        <span aria-hidden className="mt-[0.7em] h-px w-7 shrink-0 bg-[rgb(var(--accent))] transition-colors duration-700" />
        <span className="min-w-0">{[role, place].filter(Boolean).join(" · ")}</span>
      </p>
      <p className={cn("mt-5 break-words font-display leading-[0.95] tracking-[-0.02em]", size === "lg" ? "text-[clamp(2.4rem,6vw,4.4rem)]" : "text-[clamp(2rem,3.4vw,2.6rem)]")}>
        {prefix ? <span className="mr-[0.2em] align-[0.6em] text-[0.24em] italic text-[rgb(var(--accent))] transition-colors duration-700">{prefix}</span> : null}
        {first}
        {rest ? <span className="block pl-[0.6em] italic">{rest}</span> : null}
      </p>
      <p className={cn("mt-6 max-w-[26rem] text-[rgba(237,229,214,0.82)]", size === "lg" ? "text-[0.98rem]" : "text-sm")}>{line}</p>
      <p className={cn("mt-6 inline-flex items-center gap-3 border border-[rgb(var(--accent)/0.7)] uppercase transition-colors duration-700", size === "lg" ? "px-5 py-3 text-[0.62rem] tracking-[0.26em]" : "px-4 py-2 text-[0.6rem] tracking-[0.22em]")}>
        Request an evening
      </p>
    </div>
  );
}
