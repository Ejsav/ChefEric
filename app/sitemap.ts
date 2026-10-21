import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { places } from "@/content/places";

// While the site is a demo, the sitemap lists only the pages that should be
// found in search: the live demo's front door, the offer, and the legal pages
// (see lib/seo.ts). A customer version lists every page.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  if (site.demo) {
    return [
      page("/", 1),
      page("/your-site", 0.9),
      page("/your-site/start", 0.7, "yearly"),
      page("/terms", 0.2, "yearly"),
      page("/privacy", 0.2, "yearly"),
    ];
  }
  return [
    page("/", 1),
    page("/experiences", 0.9),
    page("/menus", 0.8),
    page("/chef", 0.8, "yearly"),
    page("/gallery", 0.7),
    page("/private-dining", 0.8),
    ...places.map((p) => page(`/private-dining/${p.slug}`, 0.8)),
    page("/questions", 0.7),
    page("/inquire", 0.9, "yearly"),
    page("/privacy", 0.2, "yearly"),
  ];
}
