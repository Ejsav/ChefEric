import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { ExperiencesPreview } from "@/components/sections/ExperiencesPreview";
import { TheTable } from "@/components/sections/TheTable";
import { ChefIntro } from "@/components/sections/ChefIntro";
import { GalleryStrip } from "@/components/sections/GalleryStrip";
import { Method } from "@/components/sections/Method";
import { PullQuote, Testimonials } from "@/components/sections/Voice";
import { Discretion } from "@/components/sections/Discretion";
import { Composer } from "@/components/sections/Composer";
import { InquiryClose } from "@/components/sections/InquiryClose";

// The home page in the order a client decides:
//   who (hero) → why (premise) → what (experiences) → the food (menus) →
//   the chef → proof you can see (gallery) → how it works (method) →
//   proof you can hear (testimonials) → trust (discretion) →
//   plan it (composer) → ask (close).
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <PullQuote />
      <ExperiencesPreview index="II" />
      <TheTable index="III" />
      <ChefIntro />
      <GalleryStrip index="V" />
      <Method />
      <Testimonials />
      <Discretion />
      <Composer index="VII" />
      <InquiryClose />
    </>
  );
}
