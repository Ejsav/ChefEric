import type { Metadata } from "next";
import { site } from "@/lib/site";

// Search, honestly. While the site is a demo, the persona's service pages
// (experiences, menus, the chef, places, questions, the request) are real
// pages for visitors but are kept out of search results, so no search engine
// ever presents a fictional chef as a business you can book. Links on them are
// still followed. The home page, the offer, the terms and the privacy notice
// stay indexable. A customer version (site.demo = false) indexes everything.
export function demoPage(meta: Metadata): Metadata {
  return site.demo ? { ...meta, robots: { index: false, follow: true } } : meta;
}
