import type { Metadata } from "next";
import { faqGroups } from "@/content/faq";
import { site } from "@/lib/site";
import { demoPage } from "@/lib/seo";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Faq } from "@/components/ui/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export const metadata: Metadata = demoPage({
  title: "Questions — Booking a Private Chef",
  description:
    "Pricing, deposits, cancellations, guest counts, staffing, allergies and diets, travel, planning and privacy, answered plainly.",
  alternates: { canonical: "/questions" },
  openGraph: { title: "Questions — Chef Eric Jokl", url: "/questions" },
});

const slug = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");

export default function QuestionsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Questions", path: "/questions" }]} />
      {/* FAQ structured data only for a real business; a demo persona's
          policies are not search results. */}
      {site.demo ? null : <FaqJsonLd faqs={faqGroups.flatMap((g) => g.faqs)} />}
      <PageIntro
        id="questions-title"
        eyebrow="Questions"
        lines={["Before you", "ask."]}
        lead={
          <p>
            Cost, deposits, cancellations, guests, staffing, diets, travel and privacy, answered plainly.
            {site.demo ? " These are the demo persona's policies; a live site states its own." : ""}
          </p>
        }
      >
        <nav aria-label="Topics" className="mt-14 border-t border-line pt-6 md:mt-20">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {faqGroups.map((g) => (
              <li key={g.title}>
                <a href={`#${slug(g.title)}`} className="link-underline inline-block py-1 font-display text-[1.15rem] text-fg/85 hover:text-fg">{g.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>
      {faqGroups.map((g, i) => (
        <section key={g.title} id={slug(g.title)} aria-labelledby={`faq-${i}`} className={`${i % 2 ? "tone-dark" : "tone-linen"} section scroll-mt-[var(--header-h)] py-[clamp(4rem,8vw,7rem)]`}>
          <div className="container-x grid gap-10 md:grid-cols-12">
            <h2 id={`faq-${i}`} className="text-h2 md:col-span-4">{g.title}</h2>
            <Faq faqs={g.faqs} className="md:col-span-7 md:col-start-6" />
          </div>
        </section>
      ))}
      <InquiryClose title={["Ask us", "directly."]} lead="If your question is not here, put it in your request. It will be answered personally." />
    </>
  );
}
