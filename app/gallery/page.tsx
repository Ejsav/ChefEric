import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { GalleryGrid } from "@/components/sections/Gallery";
import { deliveredShots } from "@/content/gallery";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { demoPage } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = demoPage({
  title: "Gallery — Private Dinners, Yachts & Islands",
  description: "Dishes, tables and the work behind them, in one evening's order: from the counter and the fire to the last espresso.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery — Chef Eric Jokl", url: "/gallery" },
});

const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

export default function GalleryPage() {
  const count = deliveredShots().length;
  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <PageIntro
        id="gallery-page-title"
        eyebrow="The Gallery"
        lines={["One evening,", `in ${words[count] ?? count} frames.`]}
        lead={<p>Read in order, from the counter and the fire to the last espresso. Guests are never shown: the food, the table and the light are the story. Select any frame to see it large.</p>}
      />
      <section aria-label="Photographs" className="tone-dark section pt-0">
        <div className="container-x">
          <GalleryGrid
            eager={3}
            note={
              <p className="text-sm text-fg-muted">
                <span className="text-eyebrow block">About these photographs</span>
                <span className="mt-3 block">
                  {site.demo
                    ? "Every frame on this demo was created with AI from Eric Jokl's likeness and graded as one shoot. A live site uses the chef's own photography."
                    : "Every frame is from a real evening, shown with the host's permission."}
                </span>
              </p>
            }
          />
        </div>
      </section>
      <InquiryClose title={["Your table", "is next."]} />
    </>
  );
}
