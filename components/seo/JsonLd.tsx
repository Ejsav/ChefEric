import { site } from "@/lib/site";
import { experiences } from "@/content/experiences";

// Structured data: the chef as a Person, the practice as a ProfessionalService
// with an offer catalogue. No ratings or reviews.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#chef`,
        name: "Eric Jokl",
        jobTitle: "Private Chef",
        url: `${site.url}/chef`,
        knowsAbout: ["Private dining", "Coastal cuisine", "Italian cuisine", "Cooking instruction"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: `Chef ${site.name}`,
        url: site.url,
        ...(site.email ? { email: site.email } : {}),
        description: site.description,
        founder: { "@id": `${site.url}/#chef` },
        areaServed: site.serviceArea.map((name) => ({ "@type": "Place", name })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Private dining experiences",
          itemListElement: experiences.map((e) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: e.name, description: e.summary, url: `${site.url}/experiences#${e.slug}` },
          })),
        },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
