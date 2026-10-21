import { builder, site } from "@/lib/site";
import { experiences } from "@/content/experiences";

// Structured data. While the site is a demo it describes what is real: a
// website (the template, live) made by a real person, Eric Jokl. It never
// describes the persona as a chef or a business you can book. A customer
// version (site.demo = false) publishes the chef as a Person and the practice
// as a ProfessionalService with its offer catalogue. No ratings or reviews.
export function JsonLd() {
  const maker = { "@type": "Person", "@id": `${site.url}/#builder`, name: builder.name, jobTitle: builder.role, url: builder.url };
  const data = site.demo
    ? {
        "@context": "https://schema.org",
        "@graph": [
          maker,
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            name: "Chef Eric Jokl — private-chef website template (live demo)",
            url: site.url,
            description: "A live demonstration of a luxury private-chef website. Chef Eric Jokl is a fictional persona; the website is offered to chefs and hospitality brands.",
            creator: { "@id": `${site.url}/#builder` },
            publisher: { "@id": `${site.url}/#builder` },
            inLanguage: "en-US",
          },
        ],
      }
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${site.url}/#chef`,
            name: site.name,
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
