import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollWords } from "@/components/motion/ScrollWords";

export function Manifesto() {
  return (
    <section aria-labelledby="premise" className="tone-linen section relative">
      <div className="container-x">
        <Eyebrow index="I">The Premise</Eyebrow>
        <h2 id="premise" className="sr-only">The premise</h2>
        <ScrollWords
          className="text-h1 mt-12 max-w-[22ch] md:mt-16"
          text="The best seat in any city is not in a restaurant. It is at a private table, in a house with the candles lit and nobody else waiting for it. Eric Jokl cooks for that table, wherever it happens to be."
          emphasis={["private", "table,", "Eric", "Jokl"]}
        />
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <div aria-hidden className="hairline md:col-span-12" data-draw />
          <p className="text-lead md:col-span-5 md:col-start-8" data-reveal>
            Nothing is chosen from a list. The menu is written for the people coming,
            cooked in your kitchen, served by a team you barely notice, and never
            repeated for anyone else.
          </p>
        </div>
      </div>
    </section>
  );
}
