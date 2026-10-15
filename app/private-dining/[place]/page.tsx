import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { places } from "@/content/places";
import { menus } from "@/content/menus";
import { site } from "@/lib/site";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Plate } from "@/components/ui/Plate";
import { Cta } from "@/components/ui/Cta";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

type Props = { params: Promise<{ place: string }> };

export function generateStaticParams() {
  return places.map((p) => ({ place: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { place } = await params;
  const p = places.find((x) => x.slug === place);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/private-dining/${p.slug}` },
    openGraph: { title: `${p.metaTitle} — Chef Eric Jokl`, description: p.metaDescription, url: `/private-dining/${p.slug}` },
  };
}

export default async function PlacePage({ params }: Props) {
  const { place } = await params;
  const p = places.find((x) => x.slug === place);
  if (!p) notFound();
  const menu = menus.find((m) => m.slug === p.menu);
  const others = places.filter((x) => x.slug !== p.slug);
  const href = `/inquire?setting=${p.setting}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Private chef — ${p.name}`,
    serviceType: "Private chef",
    description: p.metaDescription,
    url: `${site.url}/private-dining/${p.slug}`,
    provider: { "@id": `${site.url}/#service` },
    areaServed: { "@type": "Place", name: p.name },
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Where he cooks", path: "/private-dining" }, { name: p.name, path: `/private-dining/${p.slug}` }]} />
      <FaqJsonLd faqs={p.faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />

      <PageIntro id="place-title" eyebrow={p.eyebrow} lines={p.lines} lead={<p>{p.intro[0]}</p>} />

      <section aria-labelledby="place-evening" className="tone-linen section">
        <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <Plate {...p.plate} sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Eyebrow>{p.name}</Eyebrow>
            <h2 id="place-evening" className="text-h2 mt-8" data-reveal>What an evening here <span className="italic text-accent">looks like.</span></h2>
            <p className="text-lead mt-8" data-reveal>{p.intro[1]}</p>
            <ol className="mt-12 border-t border-line">
              {p.evening.map((e, i) => (
                <li key={e.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-7" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                  <span className="font-display text-lg italic text-accent">{["i", "ii", "iii"][i]}.</span>
                  <div>
                    <h3 className="text-h3">{e.title}</h3>
                    <p className="mt-2 text-fg-muted">{e.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12 border-t border-line pt-8" data-reveal>
              <h3 className="text-eyebrow">How it works here</h3>
              <ul className="mt-6 space-y-3">
                {p.logistics.map((l) => (
                  <li key={l} className="flex gap-4"><span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" /><span>{l}</span></li>
                ))}
              </ul>
              {p.areas ? <p className="mt-8 text-sm text-fg-muted"><span className="text-eyebrow mr-2">Areas</span>{p.areas}</p> : null}
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6" data-reveal>
              <Cta href={href} track={`cta:place-${p.slug}`}>Request an evening in {p.name}</Cta>
              {menu ? <Cta href="/menus" variant="quiet">Sample menu: {menu.title}</Cta> : null}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="place-faq" className="tone-dark section">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="place-faq" className="text-h2 mt-8">Asked about <span className="italic text-accent">{p.name}.</span></h2>
            <p className="mt-6 text-fg-muted"><Link href="/questions" className="link-underline pb-0.5">All questions</Link></p>
          </div>
          <Faq faqs={p.faqs} className="md:col-span-7 md:col-start-6" />
        </div>
      </section>

      <nav aria-label="Other places" className="tone-walnut border-t border-line">
        <div className="container-x flex flex-wrap items-baseline gap-x-8 gap-y-3 py-10">
          <span className="text-eyebrow">Also by arrangement</span>
          {others.map((o) => (
            <Link key={o.slug} href={`/private-dining/${o.slug}`} className="link-underline pb-0.5 font-display text-lg text-fg/80 hover:text-fg">{o.name}</Link>
          ))}
        </div>
      </nav>

      <InquiryClose title={["Tell us about", "the table."]} href={href} />
    </>
  );
}
