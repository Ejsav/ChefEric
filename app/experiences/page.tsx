import type { Metadata } from "next";
import { experiences } from "@/content/experiences";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Plate } from "@/components/ui/Plate";
import { Cta } from "@/components/ui/Cta";
import { cn } from "@/lib/utils";
import { Composer } from "@/components/sections/Composer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Experiences — Private Dining, Yachts, Islands & Classes",
  description:
    "Private dinners in your residence, yacht and private-island dining, cooking classes and celebrations with private chef Eric Jokl, New York.",
  alternates: { canonical: "/experiences" },
  openGraph: { title: "The Experiences — Chef Eric Jokl", url: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Experiences", path: "/experiences" }]} />
      <PageIntro
        id="experiences-title"
        eyebrow="The Experiences"
        lines={["Begin with", "the room."]}
        lead={<p>Every evening is composed from nothing for one table: the place, the people, the reason for gathering. Here are the four forms it usually takes — and a planner to compose your own.</p>}
      />

      {experiences.map((exp, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={exp.slug}
            id={exp.slug}
            aria-labelledby={`${exp.slug}-title`}
            className={cn("section scroll-mt-[var(--header-h)]", i % 2 === 0 ? "tone-linen" : "tone-dark")}
          >
            <div className="container-x grid gap-14 md:grid-cols-12 md:gap-10">
              <div className={cn("md:col-span-5", flip ? "md:order-2 md:col-start-8" : "")}>
                <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
                  <Plate {...exp.plate} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
              </div>

              <div className={cn("md:col-span-6", flip ? "md:order-1 md:col-start-1" : "md:col-start-7")}>
                <p className="flex items-center gap-4" data-reveal>
                  <span className="font-display text-xl italic text-accent">{exp.numeral}</span>
                  <span aria-hidden className="h-px w-10 bg-accent/60" />
                  <span className="text-eyebrow">{exp.kicker}</span>
                </p>
                <h2 id={`${exp.slug}-title`} className="text-h1 mt-8" data-reveal-group>
                  <span className="line-mask"><span>{exp.name}</span></span>
                </h2>
                <p className="text-lead mt-8 max-w-[34rem]" data-reveal>{exp.summary}</p>
                <div className="mt-8 max-w-[34rem] space-y-5 text-fg-muted" data-reveal>
                  {exp.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
                </div>

                <div className="mt-12 border-t border-line pt-8" data-reveal>
                  <h3 className="text-eyebrow">Included</h3>
                  <ul className="mt-6 space-y-3">
                    {exp.includes.map((item) => (
                      <li key={item} className="flex gap-4">
                        <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-3" data-reveal>
                  <div>
                    <dt className="text-eyebrow">Guide</dt>
                    <dd className="mt-2 font-display text-lg">{exp.from}</dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow">Scale</dt>
                    <dd className="mt-2 font-display text-lg">{exp.scale}</dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow">Notice</dt>
                    <dd className="mt-2 font-display text-lg">{exp.notice}</dd>
                  </div>
                </dl>

                <div className="mt-10" data-reveal>
                  <Cta href={`/inquire?experience=${exp.slug}`} variant="quiet" track={`cta:experience-${exp.slug}`}>Inquire about {exp.name}</Cta>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Composer index="V" />
      <InquiryClose title={["None of these", "quite right?"]} />
    </>
  );
}
