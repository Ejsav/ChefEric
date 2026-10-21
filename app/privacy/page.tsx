import type { Metadata } from "next";
import Link from "next/link";
import { builder, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

// Plain-language privacy notice describing exactly what this site does:
// every form, every key stored on the device, every processor. Keep it in
// step with lib/leads.ts, lib/attribution.ts and components/system/Telemetry.
// CONFIRM: have counsel review before launch; update if providers change.
export const metadata: Metadata = {
  title: "Privacy",
  description: "What this website collects, what stays on your device, who processes it, how long it is kept, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 2026";
const plausible = !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const contact = site.email ? <a href={`mailto:${site.email}`} className="link-underline text-fg">{site.email}</a> : <Link href="/your-site/start" className="link-underline text-fg">the website request form</Link>;

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "Who is responsible",
    body: <p>This site is run by {builder.name}, who decides what is collected and why. Questions go to {contact}.</p>,
  },
  {
    h: "The website request form",
    body: (
      <>
        <p>When you ask for a website at <Link href="/your-site/start" className="link-underline text-fg">/your-site/start</Link>, we receive what you type: your name, email, telephone if given, business name, current website, your choices (design, features, timing, budget) and any notes.</p>
        <p>With it, the site sends how you found us (the first page you landed on, the referring website and any campaign tags in the link) and when you started the form, which helps screen out automated spam. It is used only to reply to you and prepare a proposal. A confirmation is emailed to the address you give.</p>
      </>
    ),
  },
  {
    h: site.demo ? "The demonstration chef request" : "The request for an evening",
    body: site.demo ? (
      <p>The chef request at <Link href="/inquire" className="link-underline text-fg">/inquire</Link> is a demonstration. Your answers are checked by the server so the page can show you the result, then discarded: they are not stored, logged, emailed or passed to anyone.</p>
    ) : (
      <p>When you request an evening, we receive what you choose to tell us (name, email, telephone if given and the details of the evening) and how you found the site, and use it only to reply and plan your engagement.</p>
    ),
  },
  {
    h: "What stays on your device",
    body: (
      <>
        <p>This site sets no cookies. It keeps a few small notes in your own browser so you never retype anything:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>an unfinished chef request, for up to fourteen days, and an unfinished website request, until it is sent;</li>
          <li>the first page you visited and where you came from, for thirty days, sent only with a request;</li>
          <li>for this visit only: where it began, and whether the opening animation has played.</li>
        </ul>
        <p>None of it leaves your device unless you send a request. Clearing this site&rsquo;s data in your browser removes it.</p>
      </>
    ),
  },
  {
    h: "Analytics",
    body: (
      <p>
        We count visits in aggregate with Vercel Web Analytics and measure page speed with Vercel Speed Insights{plausible ? ", and with Plausible Analytics" : ""}: pages viewed, the referring site, the browser, device type and country, and which buttons are pressed (for example, opening the gallery or starting a form). These tools use no cookies, no advertising identifiers and no cross-site tracking. Nothing you type into a form is sent to analytics.
      </p>
    ),
  },
  {
    h: "Who processes it",
    body: (
      <>
        <p>Vercel Inc. hosts the site and runs the analytics, and keeps short-lived technical logs (such as IP address and browser) for security and troubleshooting. Resend delivers request emails. If we connect a customer-relationship tool, requests are also sent there. These providers process information only to run the service, under their own data-protection terms; some are in the United States.</p>
        <p>We do not sell, rent or share your information for marketing, and we never publish anything about you.</p>
      </>
    ),
  },
  {
    h: "How long it is kept",
    body: <p>Website requests are kept for up to two years after our last contact, unless you become a customer, in which case they are kept for as long as your plan runs and as long afterwards as tax and accounting rules require. You can ask for earlier deletion at any time.</p>,
  },
  {
    h: "Your choices",
    body: <p>You can ask to see, correct or delete what you have sent us, or object to its use, by writing to {contact}. Depending on where you live (for example the EU, the UK or California) these are legal rights, and you may also complain to your data-protection authority.</p>,
  },
  {
    h: "Security",
    body: <p>Every page is served over HTTPS with security headers. Requests are validated on the server, rate-limited and screened for spam, and only {builder.name} can read them.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} />
      <section aria-labelledby="privacy-title" className="tone-linen section pt-[calc(var(--header-h)+clamp(4rem,9vw,7rem))]">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <header className="md:col-span-4">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <p className="text-eyebrow">Updated {UPDATED}</p>
              <h1 id="privacy-title" className="text-h1 mt-6">Privacy, <span className="italic text-accent">plainly.</span></h1>
              <p className="mt-6 text-fg-muted">What this website does with what you share, and what it never does.</p>
            </div>
          </header>
          <div className="space-y-12 md:col-span-7 md:col-start-6">
            {sections.map((s) => (
              <section key={s.h} className="border-t border-line pt-6">
                <h2 className="text-h3">{s.h}</h2>
                <div className="mt-4 space-y-4 text-fg-muted">{s.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
