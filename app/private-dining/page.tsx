import type { Metadata } from "next";
import Link from "next/link";
import { places } from "@/content/places";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Arrow } from "@/components/ui/Cta";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Where Evenings Travel — Private Dining by Location",
  description:
    "Private evenings by Eric Jokl in Manhattan, Connecticut, the Hamptons, Florida, aboard yachts and on private islands. Find out what an evening looks like where you are.",
  alternates: { canonical: "/private-dining" },
  openGraph: { title: "Where evenings travel — Eric Jokl", url: "/private-dining" },
};

export default function PlacesIndex() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Where evenings travel", path: "/private-dining" }]} />
      <PageIntro
        id="places-title"
        eyebrow="Where evenings travel"
        lines={["Wherever the", "table is."]}
        lead={<p>Everywhere is by arrangement: a Manhattan apartment, a Connecticut country house, a Hamptons lawn, a Florida terrace, a yacht at anchor, an island reached by boat.</p>}
      />
      <section aria-label="Places" className="tone-dark section pt-0">
        <ol className="container-x border-t border-line">
          {places.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/private-dining/${p.slug}`} className="group relative grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-line py-8 md:grid-cols-[4.5rem_1fr_1fr_auto] md:py-10">
                <span className="font-display text-lg italic text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-h2 transition-transform duration-1000 ease-out-expo group-hover:translate-x-3">{p.name}</span>
                <span className="col-span-2 col-start-2 text-fg-muted md:col-span-1 md:col-start-auto">{p.metaDescription.split(".")[0]}.</span>
                <Arrow className="row-start-1 self-center text-fg-muted transition-all duration-700 ease-out-expo group-hover:translate-x-1 group-hover:text-accent md:col-start-4 md:row-start-auto" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <InquiryClose title={["Somewhere", "not listed?"]} />
    </>
  );
}
