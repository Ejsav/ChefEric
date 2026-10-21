import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { builder, site } from "@/lib/site";
import { money, offer, say, terms } from "@/content/offer";

// Terms for the website plan and for this demonstration site, in plain
// language. CONFIRM: have counsel review before the first customer signs.
// The signed proposal governs a plan; these terms fill in what it does not.
export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for the ${money(offer.monthly)}-a-month website plan by ${builder.name} — fees, billing, cancellation, ownership, leaving — and for this demonstration site.`,
  alternates: { canonical: "/terms" },
};

const UPDATED = "October 2026";
const contact = site.email ? <a href={`mailto:${site.email}`} className="link-underline text-fg">{site.email}</a> : <Link href="/your-site/start" className="link-underline text-fg">the website request form</Link>;

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "Who these terms are between",
    body: (
      <>
        <p>This website and the website plan are offered by {builder.name} (&ldquo;we&rdquo;). &ldquo;You&rdquo; means the person or business using this site or buying a plan.</p>
        <p>A plan begins with a written proposal. Where the proposal and these terms differ, the proposal you signed wins.</p>
      </>
    ),
  },
  {
    h: "This demonstration site",
    body: (
      <>
        <p>&ldquo;Chef Eric Jokl&rdquo; is a fictional persona used to demonstrate the template. The menus, prices, policies, testimonials and invitations shown for the chef are examples. Nothing on the chef pages can be booked, and the chef request form never creates a reservation.</p>
        <p>The photography of the persona was created with AI from Eric Jokl&rsquo;s likeness. The site&rsquo;s design, code, words and images may not be copied without permission.</p>
      </>
    ),
  },
  {
    h: "What the plan includes",
    body: (
      <p>
        The plan and the one-time setup cover what is listed under <Link href="/your-site#plan" className="link-underline text-fg">the plan</Link>: hosting and HTTPS, your domain connected, the request form delivered to your inbox, analytics, maintenance and security updates, backups in version control, {say(offer.editsPerMonth)} small edit requests a month, and email support with a reply within {offer.supportReply}. Anything else is quoted in writing before work starts.
      </p>
    ),
  },
  ...terms.map((t) => ({ h: t.q, body: <p>{t.a}</p> })),
  {
    h: "Your material",
    body: (
      <p>You supply your words, photographs, logos and prices, and confirm you own them or have the right to use them on your site. You are responsible for the accuracy of your prices, policies, allergen information and any claims about your work. We may decline to publish material that is unlawful or infringes someone else&rsquo;s rights.</p>
    ),
  },
  {
    h: "Availability and support",
    body: (
      <p>Sites are hosted on a global network and monitored. We respond to outages as quickly as we reasonably can, but no uptime figure is guaranteed unless your proposal states one. Support is by email, during business days.</p>
    ),
  },
  {
    h: "Liability",
    body: (
      <p>We are not liable for indirect losses such as lost bookings or profits. Our total liability for any claim is limited to the fees you paid in the three months before it arose. Nothing in these terms limits liability that cannot be limited by law.</p>
    ),
  },
  {
    h: "Changes to these terms",
    body: <p>If these terms change, active customers are told by email at least thirty days before the change applies. The version in force is always on this page.</p>,
  },
  {
    h: "Contact",
    body: <p>Questions about these terms: {contact}.</p>,
  },
];

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms", path: "/terms" }]} />
      <section aria-labelledby="terms-title" className="tone-linen section pt-[calc(var(--header-h)+clamp(4rem,9vw,7rem))]">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <header className="md:col-span-4">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <p className="text-eyebrow">Updated {UPDATED}</p>
              <h1 id="terms-title" className="text-h1 mt-6">Terms, <span className="italic text-accent">plainly.</span></h1>
              <p className="mt-6 text-fg-muted">For the website plan, and for this demonstration site. Short on purpose.</p>
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
