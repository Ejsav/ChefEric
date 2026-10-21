import type { Metadata } from "next";
import { menus } from "@/content/menus";
import { PageIntro } from "@/components/sections/PageIntro";
import { MenuCard } from "@/components/sections/MenuCard";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Plate } from "@/components/ui/Plate";
import type { PlateTone } from "@/components/ui/Plate";
import { mediaImage } from "@/lib/media";
import { demoPage } from "@/lib/seo";
import { cn } from "@/lib/utils";

// From the market to the plate: the food photographs under "How your menu is
// made". Only delivered frames are shown, so the story never pairs a
// photograph with a placeholder; with one frame it stands alone.
const sequence: { slot: string; label: string; alt: string; tone: PlateTone }[] = [
  { slot: "food-market", label: "The market, that morning", tone: "linen", alt: "A chef's hands choosing day-boat fish and heirloom tomatoes at an early-morning market." },
  { slot: "food-pass", label: "The pass", tone: "ember", alt: "Chef Eric Jokl at the pass under copper lamps, wiping the rim of a plated course." },
  { slot: "food-table", label: "Served", tone: "smoke", alt: "A plated course set on ivory linen by candlelight, a guest's hand lifting a glass." },
];
const shown = sequence.filter((s) => mediaImage(s.slot));

export const metadata: Metadata = demoPage({
  title: "Sample Menus — Private Dining",
  description:
    "Four sample menus — after midnight, late summer outdoors, at anchor, by the fire — with allergens and dietary adaptations. Every real menu is written for one table.",
  alternates: { canonical: "/menus" },
  openGraph: { title: "Sample menus — Chef Eric Jokl", url: "/menus" },
});

const how = [
  { t: "Names first", b: "It starts with the guests, not the dishes: who is coming, what they always order, what they would never admit to loving." },
  { t: "Allergies in the first draft", b: "Every allergy and diet is written into the menu from the start, so nobody is served the plate with something missing." },
  { t: "The week and the place", b: "What is good at the market that week, what a galley or a borrowed kitchen can handle, what will still be perfect at the far end of a long table." },
  { t: "A proposal, then a card", b: "The draft comes to you with the costs. You change what you like; the final version is printed and waiting at every place." },
] as const;

export default function MenusPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Sample menus", path: "/menus" }]} />
      <PageIntro
        id="menus-title"
        eyebrow="Sample menus"
        lines={["Nothing here", "is on offer."]}
        lead={
          <p>
            These four are examples, not choices: a supper that starts after midnight, a lawn in August, a
            deck at anchor, a fire in January. Your menu is written after a conversation about the people at
            your table.
          </p>
        }
      />
      <section aria-labelledby="menus-list" className="tone-walnut grain section relative">
        <div className="container-x relative">
          <h2 id="menus-list" className="sr-only">Four sample menus</h2>
          <MenuCard menus={menus} />
        </div>
      </section>
      <section aria-labelledby="menus-how" className="tone-linen section">
        <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
          <div className={cn("md:col-span-5", shown.length === 1 && "md:row-span-2")}>
            <h2 id="menus-how" className="text-h2">How your menu <span className="italic text-accent">is made.</span></h2>
            {shown.length === 1 ? (
              <div className="mt-12 max-w-md" data-reveal>
                <Plate {...shown[0]!} reveal={false} sizes="(min-width: 768px) 36vw, 100vw" />
              </div>
            ) : null}
          </div>
          <ol className="md:col-span-6 md:col-start-7">
            {how.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 last:border-b" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <span className="font-display text-lg italic text-accent">{["i", "ii", "iii", "iv"][i]}.</span>
                <div>
                  <h3 className="font-display text-[1.45rem] leading-snug">{s.t}</h3>
                  <p className="mt-2 text-fg-muted">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
          {shown.length > 1 ? (
            <ol className="mt-4 grid gap-6 sm:grid-cols-3 md:col-span-12 md:gap-8">
              {shown.map((s, i) => (
                <li key={s.slot} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                  <Plate {...s} reveal={false} sizes="(min-width: 640px) 30vw, 100vw" />
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>
      <InquiryClose title={["Start with the guests.", "The menu follows."]} lead="Tell us who is coming and what they love. The first draft arrives with your proposal." />
    </>
  );
}
