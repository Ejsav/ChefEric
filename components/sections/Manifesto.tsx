import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { home } from "@/content/home";

export function Manifesto() {
  return (
    <section aria-labelledby="premise" className="tone-linen section relative">
      <div className="container-x">
        <Eyebrow index="I">The Premise</Eyebrow>
        <h2 id="premise" className="sr-only">The premise</h2>
        <ScrollWords
          className="text-h1 mt-12 max-w-[22ch] md:mt-16"
          text={home.premise.words}
          emphasis={[...home.premise.emphasis]}
        />
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
          <div aria-hidden className="hairline md:col-span-12" data-draw />
          <p className="text-lead md:col-span-5 md:col-start-8" data-reveal>{home.premise.lead}</p>
        </div>
      </div>
    </section>
  );
}
