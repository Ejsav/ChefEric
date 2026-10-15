import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { InquiryClose } from "@/components/sections/InquiryClose";
import { Archive } from "@/components/sections/Archive";
import { Standards } from "@/components/sections/Standards";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "The Builder Behind the Evening",
  description:
    "Eric Jokl is a digital builder who designs, directs and hosts private evenings: how a career in code, brands and experience design became a standard for the room.",
  alternates: { canonical: "/eric" },
  openGraph: { title: "Eric Jokl — The builder behind the evening", url: "/eric" },
};

export default function EricPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Eric Jokl", path: "/eric" }]} />
      <PageIntro
        id="eric-page-title"
        eyebrow="The Host"
        lines={["Eric", "Jokl"]}
        lead={
          <p>
            A builder by trade, a host by obsession. He designs the systems, brands and
            experiences that make ideas feel real — and, for a few tables at a time, the
            evenings people talk about for years.
          </p>
        }
      />

      <Archive />
      <Standards />

      <InquiryClose title={["Bring him", "to your table."]} />
    </>
  );
}
