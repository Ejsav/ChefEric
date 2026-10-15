import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default config;
