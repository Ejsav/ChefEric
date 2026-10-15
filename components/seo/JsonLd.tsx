import { site } from "@/lib/site";
import { experiences } from "@/content/experiences";

// Structured data: Eric as a Person, Private Evenings as a ProfessionalService
// with an offer catalogue. Only verifiable facts — no ratings, no reviews,
// no culinary credentials.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#eric`,
        name: "Eric Jokl",
        jobTitle: "Host & Creative Director, Private Evenings",
        url: `${site.url}/eric`,
        knowsAbout: ["Hospitality design", "Private dining", "Experience design", "Full-stack development", "Brand and conversion design", "AI workflows"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: `${site.house} by ${site.name}`,
        url: site.url,
        ...(site.email ? { email: site.email } : {}),
        description: site.description,
        founder: { "@id": `${site.url}/#eric` },
        areaServed: site.serviceArea.map((name) => ({ "@type": "Place", name })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Private evenings",
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
