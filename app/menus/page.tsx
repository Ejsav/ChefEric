import type { Metadata } from "next";
import { menus } from "@/content/menus";
import { PageIntro } from "@/components/sections/PageIntro";
import { MenuCard } from "@/components/sections/MenuCard";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sample Menus — Private Dining",
  description:
    "Sample menus for private evenings by Eric Jokl: after midnight, late summer outdoors, a night aboard, a winter table. Every real menu is written with the chef for one table.",
  alternates: { canonical: "/menus" },
  openGraph: { title: "Sample menus — Eric Jokl", url: "/menus" },
};

export default function MenusPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Sample menus", path: "/menus" }]} />
      <PageIntro
        id="menus-title"
        eyebrow="Sample menus"
        lines={["A menu is", "written once."]}
        lead={
          <p>
            Each evening begins as a conversation and becomes a menu nobody else will be served. These four
            samples show the range: a table that starts after midnight, a summer lawn, a dinner at anchor, a
            winter night.
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
              Eric starts with the people at the table: what they love, what they avoid, what they would never
              order for themselves. Then he chooses the chef who should cook it.
            </p>
            <p>
              The season and the setting decide the rest. A galley asks for a different menu than an estate
              kitchen; a founders&rsquo; table is paced around the conversation. Allergies and preferences are
              designed in from the first draft, never substituted at the end.
            </p>
            <p>
              You receive the menu as a proposal, refine it together, and on the night each guest finds it printed
              at their place.
            </p>
          </div>
        </div>
      </section>
      <InquiryClose title={["Tell us about", "the table."]} />
    </>
  );
}
