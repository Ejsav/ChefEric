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
          text="The finest tables in the world are not found in restaurants. They are set in private rooms, on terraces above the water, in kitchens where the chef knows every guest by name. That is where Eric Jokl cooks."
          emphasis={["private", "Eric", "Jokl"]}
        />
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <div aria-hidden className="hairline md:col-span-12" data-draw />
          <p className="text-lead md:col-span-5 md:col-start-8" data-reveal>
            No set menus. No banquet trays. Each evening is written for one table,
            cooked in the host&rsquo;s own kitchen and served with the discretion of
            a great dining room — then it is gone.
          </p>
        </div>
      </div>
    </section>
  );
}
