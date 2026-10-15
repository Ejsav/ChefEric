import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { places } from "@/content/places";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1),
    page("/experiences", 0.9),
    page("/menus", 0.8),
    page("/eric", 0.8, "yearly"),
    page("/private-dining", 0.8),
    ...places.map((p) => page(`/private-dining/${p.slug}`, 0.8)),
    page("/questions", 0.7),
    page("/inquire", 0.9, "yearly"),
    page("/privacy", 0.2, "yearly"),
  ];
}
