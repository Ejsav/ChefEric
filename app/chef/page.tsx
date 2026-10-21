import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Archive } from "@/components/sections/Archive";
import { Standards } from "@/components/sections/Standards";
import { Discretion } from "@/components/sections/Discretion";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { demoPage } from "@/lib/seo";

export const metadata: Metadata = demoPage({
  title: "The Chef",
  description:
    "How private chef Eric Jokl works: six chapters of the craft, from slow cooking and live fire to the room, the water and the table, and the rules of the house.",
  alternates: { canonical: "/chef" },
  openGraph: { title: "The Chef — Eric Jokl", url: "/chef" },
});

export default function ChefPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "The Chef", path: "/chef" }]} />
      <PageIntro
        id="chef-page-title"
        eyebrow="The Chef"
        lines={["Eric", "Jokl"]}
        lead={
          <p>
            Private dinners for people who could book any restaurant and would rather not. What
            follows is how the work is done, not a list of credentials: six chapters of the craft
            and the rules that hold in every kitchen.
          </p>
        }
      />
      <Archive />
      <Standards />
      <Discretion />
      <InquiryClose title={["Your table,", "his kitchen."]} lead="Share the date and the guests, and the first call is about them, not about him." />
    </>
  );
}
