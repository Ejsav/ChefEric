import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Monogram } from "@/components/ui/Monogram";

// The footer is the last course: the full name set large, quiet details
// underneath, nothing that looks like a sitemap dump.
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tone-dark defer-render relative overflow-hidden border-t border-line">
      <div className="container-x pb-10 pt-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5" data-reveal>
            <Monogram className="h-14 w-14 text-accent" />
            <p className="mt-8 max-w-sm font-display text-[1.6rem] italic leading-snug text-fg/90">
              A table is the oldest form of hospitality. We still set it by hand.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div>
              <p className="text-eyebrow">The House</p>
              <ul className="mt-5 space-y-3">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-underline pb-0.5 text-fg/85 hover:text-fg">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-eyebrow">Correspondence</p>
              <ul className="mt-5 space-y-3">
                {site.email ? (
                  <li><a href={`mailto:${site.email}`} className="link-underline break-all pb-0.5 text-fg/85 hover:text-fg">{site.email}</a></li>
                ) : (
                  <li><Link href="/inquire" className="link-underline pb-0.5 text-fg/85 hover:text-fg">By private request</Link></li>
                )}
                {site.social.instagram ? (
                  <li><a href={`https://instagram.com/${site.social.instagram}`} className="link-underline pb-0.5 text-fg/85 hover:text-fg" rel="me noopener" target="_blank">Instagram</a></li>
                ) : null}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-eyebrow">Where</p>
              <p className="mt-5 text-fg/85">Based in {site.region}.<br />Travelling by arrangement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* The name, set at architectural scale and cropped by the page edge. */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        {/* Rendered via ::before so the decorative word is not text content. */}
        <p className="translate-y-[18%] whitespace-nowrap text-center font-display text-[17vw] leading-[0.8] tracking-[-0.03em] text-fg/[0.07] before:content-['Eric_Jokl']" />
      </div>

      <div className="container-x relative flex flex-col gap-3 border-t border-line py-7 text-[0.7rem] uppercase tracking-[0.22em] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} {site.name}</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="link-underline pb-0.5 hover:text-fg">Privacy</Link>
          <span>{site.house} · {site.region}</span>
          <span>{site.imageryNote}</span>
        </span>
      </div>
    </footer>
  );
}
