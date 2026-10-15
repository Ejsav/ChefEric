import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Archive } from "@/components/sections/Archive";
import { Standards } from "@/components/sections/Standards";
import { Discretion } from "@/components/sections/Discretion";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "The Chef — Eric Jokl",
  description:
    "The story of private chef Eric Jokl: the family table, the restaurant line, private rooms, yachts and islands, and the standards he cooks by.",
  alternates: { canonical: "/chef" },
  openGraph: { title: "The Chef — Eric Jokl", url: "/chef" },
};

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
            A cook shaped by family tables, professional kitchens and evenings in places most
            people never see. Private by profession, precise by habit, generous by upbringing.
          </p>
        }
      />
      <Archive />
      <Standards />
      <Discretion />
      <InquiryClose title={["Bring him", "to your table."]} />
    </>
  );
}
