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
          text="The best nights of your life did not happen in restaurants. They happened in private rooms, on terraces above the water, at tables where someone had thought of everything. That is the room Eric Jokl builds."
          emphasis={["private", "Eric", "Jokl"]}
        />
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <div aria-hidden className="hairline md:col-span-12" data-draw />
          <p className="text-lead md:col-span-5 md:col-start-8" data-reveal>
            No packages. No banquet trays. Each evening is designed for one table,
            cooked by a chef chosen for it, directed like a performance and served
            with the discretion of a great dining room — then it is gone.
          </p>
        </div>
      </div>
    </section>
  );
}
