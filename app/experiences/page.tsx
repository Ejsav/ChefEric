import type { Metadata } from "next";
import { experiences } from "@/content/experiences";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Plate } from "@/components/ui/Plate";
import { Cta } from "@/components/ui/Cta";
import { cn } from "@/lib/utils";
import { demoPage } from "@/lib/seo";
import { Composer } from "@/components/sections/Composer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = demoPage({
  title: "Experiences — Private Dining, Yachts, Islands & Classes",
  description:
    "Private dinners at home, yacht and private-island dining, cooking classes and celebrations: what each includes, what it costs as a guide, and what the venue needs.",
  alternates: { canonical: "/experiences" },
  openGraph: { title: "The Experiences — Chef Eric Jokl", url: "/experiences" },
});

export default function ExperiencesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Experiences", path: "/experiences" }]} />
      <PageIntro
        id="experiences-title"
        eyebrow="The Experiences"
        lines={["Begin with", "the room."]}
        lead={<p>The place, the people and the reason decide the evening. Here are the four forms it usually takes, what each includes and what the venue needs, and a planner to sketch your own.</p>}
      >
        {/* Jump list: four anchors, so the page reads like a menu's contents. */}
        <nav aria-label="The four experiences" className="mt-14 border-t border-line pt-6 md:mt-20">
          <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((e) => (
              <li key={e.slug}>
                <a href={`#${e.slug}`} className="group flex items-baseline gap-3 py-1">
                  <span className="font-display text-sm italic text-accent">{e.numeral}</span>
                  <span className="link-underline pb-0.5 font-display text-[1.2rem] text-fg/85 group-hover:text-fg">{e.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageIntro>

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

                <div className="mt-12 grid gap-10 border-t border-line pt-8 sm:grid-cols-2" data-reveal>
                  <div>
                    <h3 className="text-eyebrow">Included</h3>
                    <ul className="mt-5 space-y-3">
                      {exp.includes.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-eyebrow">What the venue needs</h3>
                    <ul className="mt-5 space-y-3">
                      {exp.venue.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-accent/60" />
                          <span className="text-fg-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-3" data-reveal>
                  <div>
                    <dt className="text-eyebrow">Guide price</dt>
                    <dd className="mt-2 font-display text-lg">{exp.from}</dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow">Guests</dt>
                    <dd className="mt-2 font-display text-lg">{exp.scale}</dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow">Notice</dt>
                    <dd className="mt-2 font-display text-lg">{exp.notice}</dd>
                  </div>
                </dl>
                <p className="mt-5 max-w-[34rem] text-sm text-fg-muted" data-reveal>
                  {exp.priceNote} A guide price is a starting point, not a quote: the written proposal prices the evening line by line before anything is agreed.
                </p>

                <div className="mt-10" data-reveal>
                  <Cta href={`/inquire?experience=${exp.slug}`} variant="quiet" track={`cta:experience-${exp.slug}`}>Inquire about {exp.name}</Cta>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Composer index="V" />
      <InquiryClose title={["None of these", "quite right?"]} lead="Describe the evening you have in mind. If it can be cooked, it can be planned." />
    </>
  );
}
