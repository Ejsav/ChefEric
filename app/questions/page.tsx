import type { Metadata } from "next";
import { faqGroups } from "@/content/faq";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Faq } from "@/components/ui/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export const metadata: Metadata = {
  title: "Questions — Booking a Private Chef",
  description:
    "How booking, pricing, menus, dietary needs, travel, yachts, gifts and discretion work when you book private chef Eric Jokl.",
  alternates: { canonical: "/questions" },
  openGraph: { title: "Questions — Chef Eric Jokl", url: "/questions" },
};

export default function QuestionsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Questions", path: "/questions" }]} />
      <FaqJsonLd faqs={faqGroups.flatMap((g) => g.faqs)} />
      <PageIntro
        id="questions-title"
        eyebrow="Questions"
        lines={["Before you", "ask."]}
        lead={<p>Booking, cost, allergies, travel and privacy, answered plainly. If your question is not here, put it in your request and it will be answered personally.</p>}
      />
      {faqGroups.map((g, i) => (
        <section key={g.title} aria-labelledby={`faq-${i}`} className={i % 2 ? "tone-dark section" : "tone-linen section"}>
          <div className="container-x grid gap-10 md:grid-cols-12">
            <h2 id={`faq-${i}`} className="text-h2 md:col-span-4">{g.title}</h2>
            <Faq faqs={g.faqs} className="md:col-span-7 md:col-start-6" />
          </div>
        </section>
      ))}
      <InquiryClose title={["Ask us", "directly."]} />
    </>
  );
}
