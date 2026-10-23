import type { Metadata, Viewport } from "next";
import "./globals.css";
import { serif, instrument } from "./fonts";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { bootScript } from "@/lib/boot";
import { Prelude } from "@/components/system/Prelude";
import { Transitions } from "@/components/system/Transitions";
import { Cursor } from "@/components/system/Cursor";
import { Telemetry } from "@/components/system/Telemetry";
import { MobileBar } from "@/components/system/MobileBar";
import { Colophon } from "@/components/layout/Colophon";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.demo ? "Chef Eric Jokl — Luxury Private Chef Website, Live Demo" : "Chef Eric Jokl — Private Chef, New York",
    template: "%s — Chef Eric Jokl",
  },
  description: site.demo
    ? "A live demonstration of a luxury private-chef website by Eric Jokl: editorial design, sample menus, an evening planner and a request flow that reads like a reservation book. Chef Eric Jokl is a demo persona; the website can be yours."
    : site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.demo ? "Chef Eric Jokl · website demo" : site.name,
    title: site.demo ? "Chef Eric Jokl — a private-chef website, live demo" : "Chef Eric Jokl — Private tables, by arrangement",
    description: site.demo
      ? "Explore a luxury private-chef website, then make it yours: your name, your story, your photographs."
      : "Private chef in New York. Private dinners for one table, yacht and private-island dining, cooking classes and celebrations.",
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#110c09",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${instrument.variable}`}
      // No demo notice on a customer's site, so no room is kept for it.
      style={site.demo ? undefined : ({ "--notice-h": "0px" } as React.CSSProperties)}
      suppressHydrationWarning
    >
      <head>
        {/* Capability tier, pointer type and prelude decided before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Prelude />
        <SmoothScroll />
        <RevealObserver />
        <Transitions />
        <Telemetry />
        <Header />
        <main id="main">{children}</main>
        <Colophon />
        <Footer />
        <MobileBar />
        <Cursor />
      </body>
    </html>
  );
}
