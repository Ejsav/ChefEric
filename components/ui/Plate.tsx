import Image from "next/image";
import { cn } from "@/lib/utils";
import { mediaImage } from "@/lib/media";

// A "plate" is a photograph slot. Give it a `slot` id (content/media.ts) and
// it renders public/media/<slot>.* through next/image as soon as that file
// exists. Until then it renders a lit, grained tonal study in the same
// mood — never a stock photo, never a grey box. See docs/AI_IMAGERY.md.

export type PlateTone = "ember" | "linen" | "tide" | "smoke" | "portrait";

// Each study is built like a shallow-depth-of-field photograph: a key light,
// a few out-of-focus highlights (bokeh) and a falloff into shadow.
const bokeh = (x: number, y: number, r: number, c: string) =>
  `radial-gradient(${r}px ${r}px at ${x}% ${y}%, ${c}, transparent 100%)`;

const studies: Record<PlateTone, string> = {
  // Candle on a dark table: warm pool low-centre, flames blurred behind.
  ember: [
    bokeh(22, 30, 26, "rgba(255,196,120,0.35)"),
    bokeh(71, 22, 18, "rgba(255,206,140,0.28)"),
    bokeh(84, 41, 34, "rgba(214,140,70,0.22)"),
    bokeh(37, 18, 12, "rgba(255,220,170,0.3)"),
    "radial-gradient(60% 38% at 50% 74%, rgba(214,150,78,0.55), rgba(120,62,28,0.22) 50%, transparent 78%)",
    "linear-gradient(180deg, transparent 56%, rgba(237,229,214,0.035) 61%, transparent 66%)",
    "radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(6,4,3,0.8) 100%)",
    "linear-gradient(180deg, #160e0a 0%, #22160f 62%, #0d0907 100%)",
  ].join(", "),
  // Flour on walnut: soft daylight from upper left.
  linen: [
    "radial-gradient(70% 55% at 28% 24%, rgba(248,240,226,0.95), rgba(220,204,176,0.55) 42%, transparent 78%)",
    "radial-gradient(35% 18% at 58% 68%, rgba(250,244,232,0.6), transparent 80%)",
    "radial-gradient(120% 100% at 30% 30%, transparent 50%, rgba(40,26,16,0.65) 100%)",
    "linear-gradient(160deg, #cdbb9c 0%, #8d7454 55%, #3b2a1d 100%)",
  ].join(", "),
  // Dusk over water: a cold horizon, lanterns along a dock.
  tide: [
    bokeh(18, 70, 14, "rgba(255,196,120,0.55)"),
    bokeh(32, 74, 10, "rgba(255,196,120,0.45)"),
    bokeh(46, 77, 8, "rgba(255,196,120,0.4)"),
    bokeh(78, 30, 40, "rgba(150,170,186,0.12)"),
    "linear-gradient(180deg, transparent 49%, rgba(170,190,204,0.28) 52%, transparent 56%)",
    "radial-gradient(80% 30% at 50% 50%, rgba(110,132,148,0.4), transparent 70%)",
    "linear-gradient(180deg, #0b0f13 0%, #1c2730 48%, #0c0c0c 58%, #120c09 100%)",
  ].join(", "),
  // Low light through wine and smoke: oxblood haze, glassware glints.
  smoke: [
    bokeh(64, 34, 16, "rgba(255,214,160,0.3)"),
    bokeh(74, 52, 22, "rgba(220,150,90,0.24)"),
    bokeh(30, 62, 28, "rgba(160,60,56,0.35)"),
    "radial-gradient(55% 45% at 38% 40%, rgba(132,44,44,0.5), transparent 70%)",
    "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(6,4,3,0.8) 100%)",
    "linear-gradient(200deg, #1d1110 0%, #120b0a 100%)",
  ].join(", "),
  // Single key light from camera left, a dark figure against it.
  portrait: [
    "radial-gradient(18% 16% at 52% 34%, rgba(10,7,5,0.9), transparent 100%)",
    "radial-gradient(34% 30% at 52% 82%, rgba(10,7,5,0.92), transparent 100%)",
    "radial-gradient(45% 60% at 30% 36%, rgba(222,176,118,0.45), rgba(90,54,30,0.22) 50%, transparent 78%)",
    bokeh(82, 20, 20, "rgba(255,206,140,0.2)"),
    "radial-gradient(120% 90% at 40% 40%, transparent 45%, rgba(6,4,3,0.85) 100%)",
    "linear-gradient(90deg, #1d140e 0%, #0f0a08 100%)",
  ].join(", "),
};

/** A delivered photograph to stand in while a slot is still empty. It
 *  carries its own alt text and label, because it is a different picture. */
export type PlateFallback = { slot: string; alt: string; label?: string };

type Props = {
  tone: PlateTone;
  alt: string;
  label?: string;
  src?: string;
  /** media slot id; resolves to public/media/<slot>.* when present */
  slot?: string;
  /** shown, with its own alt and label, while `slot` has no asset */
  fallback?: PlateFallback;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** aspect ratio utility, e.g. "aspect-[4/5]" */
  ratio?: string;
  /** object-position utility for crops, e.g. "object-[50%_30%]" */
  focus?: string;
  reveal?: boolean;
  /** word the cursor carries over this plate, e.g. "View" */
  cursorLabel?: string;
};

/** Which picture a plate will actually show: its own asset, the fallback, or none. */
export function resolvePlate({ src, slot, alt, label, fallback }: Pick<Props, "src" | "slot" | "alt" | "label" | "fallback">) {
  const own = src ?? mediaImage(slot);
  if (own) return { src: own, alt, label };
  const stand = fallback ? mediaImage(fallback.slot) : undefined;
  if (stand && fallback) return { src: stand, alt: fallback.alt, label: fallback.label ?? label };
  return { src: undefined, alt, label };
}

export function Plate({ tone, sizes = "(min-width: 1024px) 50vw, 100vw", priority, className, ratio = "aspect-[4/5]", focus, reveal = true, cursorLabel, ...picture }: Props) {
  const { src, alt, label } = resolvePlate(picture);
  return (
    <figure
      className={cn("group/plate relative overflow-hidden bg-bg-elevated", ratio, className)}
      data-reveal={reveal ? "fade" : undefined}
      data-cursor-label={cursorLabel}
    >
      {/* Two planes: the parallax wrapper drifts with scroll (CSS scroll
          timeline), the inner layer settles from 1.06 on reveal. */}
      <div className="parallax absolute inset-x-0 -inset-y-[5%]">
        <div className="absolute inset-0 scale-[1.06] transition-transform duration-[2400ms] ease-out-expo group-[.is-in]/plate:scale-100">
          {src ? (
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", focus)} />
          ) : (
            <div role="img" aria-label={alt} className="grain absolute inset-0" style={{ backgroundImage: studies[tone] }} />
          )}
        </div>
      </div>
      {/* Inset hairline frame — the edge of a printed photograph */}
      <div aria-hidden className="pointer-events-none absolute inset-3 border border-[rgba(237,229,214,0.12)] md:inset-4" />
      {label ? (
        <>
          {/* A low scrim so the caption reads on bright frames too. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(0deg,rgba(10,7,5,0.72),rgba(10,7,5,0.28)_55%,transparent)]" />
          <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-[0.66rem] uppercase leading-relaxed tracking-[0.24em] text-[rgba(237,229,214,0.9)] md:bottom-7 md:left-7 md:right-7">
            <span>{label}</span>
            <span aria-hidden className="font-display text-sm normal-case italic tracking-normal text-[rgba(237,229,214,0.7)]">EJ</span>
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}
