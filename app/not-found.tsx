import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/ui/Cta";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

const ways = [
  { href: "/experiences", label: "The experiences" },
  { href: "/menus", label: "Sample menus" },
  { href: "/gallery", label: "The gallery" },
  { href: "/your-site", label: "Get this website" },
] as const;

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="tone-dark grain relative flex min-h-[100svh] items-center">
      <div className="container-x pb-20 pt-[calc(var(--header-h)+4rem)]">
        <p className="text-eyebrow">Page not found</p>
        <h1 id="nf-title" className="mt-8 font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.012em]">
          This table <span className="italic text-accent">isn&rsquo;t set.</span>
        </h1>
        <p className="text-lead mt-8 max-w-lg text-fg-muted">The page may have moved, or the link was mistyped. One of these will be close:</p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {ways.map((w) => (
            <li key={w.href}><Link href={w.href} className="link-underline inline-block py-1 font-display text-[1.25rem]">{w.label}</Link></li>
          ))}
        </ul>
        <div className="mt-12"><Cta href="/">Back to the home page</Cta></div>
      </div>
    </section>
  );
}
