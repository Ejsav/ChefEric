import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bodoni, instrument } from "./fonts";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Chef Eric Jokl — Private Chef, New York",
    template: "%s — Chef Eric Jokl",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Chef Eric Jokl — Private tables, by arrangement",
    description:
      "Private chef in New York. Private dinners written for one table, yacht and private-island dining, cooking classes and celebrations.",
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#110c09",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${instrument.variable}`} suppressHydrationWarning>
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
        <Footer />
        <MobileBar />
        <Cursor />
      </body>
    </html>
  );
}
