import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

// Plain-language privacy notice describing exactly what this site does.
// CONFIRM: have counsel review before launch; update if providers change.
export const metadata: Metadata = {
  title: "Privacy",
  description: "How Eric Jokl's website handles the information you share.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 2026";

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "What we collect",
    body: (
      <>
        <p>When you send a request, we receive what you choose to tell us: your name, email, telephone if given, and the details of the evening (date, place, guests, occasion, dietary notes and anything else you write).</p>
        <p>With the request, the site includes how you found it: the page you first arrived on, the website that referred you, and any campaign tags in the link. This helps the office understand where clients come from. If you arrived through a private invitation, the invitation is noted.</p>
      </>
    ),
  },
  {
    h: "What stays on your device",
    body: (
      <p>To save you retyping, an unfinished request is kept in your own browser for up to fourteen days, and the first page you visited is kept for thirty. This information stays on your device and is not sent anywhere until you send a request. Clearing your browser&rsquo;s site data removes it.</p>
    ),
  },
  {
    h: "Analytics",
    body: (
      <p>We measure visits in aggregate, such as which pages are read and which buttons are pressed, using privacy-focused analytics that do not use advertising cookies or build profiles of individuals. No personal details from your request are sent to analytics.</p>
    ),
  },
  {
    h: "How we use it",
    body: (
      <p>Only to reply to your request and plan your engagement. We do not sell, rent or share your information for marketing, and we never publish anything about you or your home.</p>
    ),
  },
  {
    h: "Who processes it",
    body: (
      <p>The site is hosted by Vercel. Requests are delivered to Eric Jokl&rsquo;s office by an email delivery service. These providers process information only to run the service.</p>
    ),
  },
  {
    h: "Your choices",
    body: (
      <p>You can ask to see, correct or delete the information you have sent us at any time, through the request form{site.email ? <> or by writing to {site.email}</> : null}. We keep request details only as long as needed to plan and follow up on your engagement.</p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} />
      <section aria-labelledby="privacy-title" className="tone-linen section pt-[calc(var(--header-h)+clamp(4rem,9vw,7rem))]">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <header className="md:col-span-4">
            <p className="text-eyebrow">Updated {UPDATED}</p>
            <h1 id="privacy-title" className="text-h1 mt-6">Privacy, <span className="italic text-accent">plainly.</span></h1>
            <p className="mt-6 text-fg-muted">Discretion is part of the design. This page explains what the website does with what you share.</p>
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
