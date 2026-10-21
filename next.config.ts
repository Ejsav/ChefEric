import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";
const onVercel = !!process.env.VERCEL;
const plausible = !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// Content Security Policy: everything comes from this origin. The only
// third parties are the analytics collectors, and only when enabled.
// 'unsafe-inline' scripts are required by the App Router's inline payload
// and the pre-paint boot script; nothing else is allowed to execute.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com${plausible ? " https://plausible.io" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://vitals.vercel-insights.com${plausible ? " https://plausible.io" : ""}${dev ? " ws: wss:" : ""}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

// Which media slots have an asset (see lib/media.ts). Read once at build
// time and inlined, so client and server components agree without a fetch.
function listMedia() {
  try {
    return readdirSync(join(process.cwd(), "public", "media"))
      .filter((f) => /\.(avif|webp|jpe?g|png|webm|mp4)$/i.test(f))
      .join(",");
  } catch {
    return "";
  }
}

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_MEDIA: listMedia() },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    // Long-lived cache for optimised photographs: file names are stable per slot,
    // and a replaced photograph is a new deployment.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/api/(.*)", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    return [
      // Website requests used to travel through the chef's inquiry; they now
      // have their own form. Old links (and the query they carry) still land.
      { source: "/inquire", has: [{ type: "query", key: "about", value: "website" }], destination: "/your-site/start", permanent: false },
    ];
  },
};

export default config;
