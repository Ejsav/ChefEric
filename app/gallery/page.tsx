import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { GalleryGrid } from "@/components/sections/GalleryStrip";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Gallery — Private Dinners, Yachts & Islands",
  description: "Dishes, tables and evenings from private chef Eric Jokl: from the market to the last plate.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery — Chef Eric Jokl", url: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <PageIntro
        id="gallery-page-title"
        eyebrow="The Gallery"
        lines={["From the market", "to the last plate."]}
        lead={<p>Dishes, rooms and the work behind them. Guests are never shown — the food, the table and the light are the story.</p>}
      />
      <section aria-label="Photographs" className="tone-dark section pt-0">
        <div className="container-x">
          <GalleryGrid sizes="(min-width: 768px) 30vw, 50vw" />
        </div>
      </section>
      <InquiryClose title={["Your table", "is next."]} />
    </>
  );
}
