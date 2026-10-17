import type { Metadata } from "next";
import { menus } from "@/content/menus";
import { PageIntro } from "@/components/sections/PageIntro";
import { MenuCard } from "@/components/sections/MenuCard";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Plate } from "@/components/ui/Plate";
import type { PlateTone } from "@/components/ui/Plate";

// From the market to the plate: three food photographs under "How your menu
// is made".
const sequence: { slot: string; label: string; alt: string; tone: PlateTone }[] = [
  { slot: "food-market", label: "The market, that morning", tone: "linen", alt: "A chef's hands choosing day-boat fish and heirloom tomatoes at an early-morning market." },
  { slot: "food-pass", label: "The pass", tone: "ember", alt: "A chef's hands placing the last herb on a plated course at the kitchen pass." },
  { slot: "food-table", label: "Served", tone: "smoke", alt: "A plated course set on ivory linen by candlelight, a guest's hand lifting a glass." },
];

export const metadata: Metadata = {
  title: "Sample Menus — Private Dining",
  description:
    "Sample menus from private chef Eric Jokl: after midnight, late summer outdoors, at anchor, by the fire. Every real menu is written for one table.",
  alternates: { canonical: "/menus" },
  openGraph: { title: "Sample menus — Chef Eric Jokl", url: "/menus" },
};

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
            These four are examples, not choices. Your menu is written after a conversation about the people
            at your table, and it is never cooked for anyone else. Read them for the range: a supper that
            starts after midnight, a lawn in August, a deck at anchor, a fire in January.
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
        <div className="container-x grid gap-12 md:grid-cols-12">
          <h2 id="menus-how" className="text-h2 md:col-span-5">How your menu <span className="italic text-accent">is made.</span></h2>
          <div className="grid gap-8 text-fg-muted md:col-span-6 md:col-start-7">
            <p className="text-lead text-fg">
              It starts with names, not dishes: who is coming, what they always order, what they would never
              admit to loving.
            </p>
            <p>
              Then the week and the place take over. What is good at the market that week, what a galley or a
              borrowed kitchen can handle, what will still be perfect at the far end of a long table. Allergies
              are written into the first draft, so nobody gets the plate with something missing.
            </p>
            <p>
              The draft comes to you as a proposal. You change what you like; the final version is printed and
              waiting at every place when your guests sit down.
            </p>
          </div>
          <ol className="mt-4 grid gap-6 sm:grid-cols-3 md:col-span-12 md:mt-10 md:gap-8">
            {sequence.map((s, i) => (
              <li key={s.slot} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <Plate tone={s.tone} slot={s.slot} alt={s.alt} label={s.label} sizes="(min-width: 640px) 30vw, 100vw" />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <InquiryClose title={["Start with the guests.", "The menu follows."]} />
    </>
  );
}
