import type { Metadata } from "next";
import { verifyInvite } from "@/lib/invite";
import { Monogram } from "@/components/ui/Monogram";
import { Cta } from "@/components/ui/Cta";
import { InviteSeen } from "@/components/system/InviteSeen";

// A private invitation. Reached only by a signed link sent by Eric Jokl's
// office; never indexed. Valid links greet the guest by name and open the
// request already addressed to them. Expired or altered links close politely.
export const metadata: Metadata = {
  title: "A private invitation",
  robots: { index: false, follow: false, nocache: true },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = verifyInvite(decodeURIComponent(token));

  if (!result.ok) {
    return (
      <section className="tone-dark grain relative flex min-h-[100svh] items-center">
        <div className="container-x pt-[var(--header-h)] text-center">
          <Monogram className="mx-auto h-14 w-14 text-accent" />
          <h1 className="text-h1 mx-auto mt-10 max-w-[16ch]">
            {result.reason === "expired" ? <>This invitation has <span className="italic text-accent">closed.</span></> : <>This invitation could not be <span className="italic text-accent">opened.</span></>}
          </h1>
          <p className="text-lead mx-auto mt-8 max-w-md">The chef&rsquo;s office will gladly send a new one — or begin a request below.</p>
          <div className="mt-12"><Cta href="/inquire">Begin a request</Cta></div>
        </div>
      </section>
    );
  }

  const { n: name, m: note, s: setting } = result.payload;
  const href = `/inquire?invite=${encodeURIComponent(token)}${setting ? `&setting=${encodeURIComponent(setting)}` : ""}`;

  return (
    <section aria-labelledby="invite-title" className="tone-dark grain relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <InviteSeen />
      <div aria-hidden className="hero-lights candle absolute inset-x-[-20%] bottom-[-55%] -z-10 h-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(205,140,70,0.3),transparent_70%)]" />
      <div className="container-x py-[calc(var(--header-h)+4rem)] text-center">
        <div className="hero-fade" style={d(100)}><Monogram className="mx-auto h-16 w-16 text-accent" /></div>
        <p className="hero-fade text-eyebrow mt-12" style={d(300)}>A private invitation</p>
        <h1 id="invite-title" className="text-display mx-auto mt-8 max-w-[14ch] !text-[clamp(2.8rem,7vw,6.5rem)]">
          <span className="hero-rise line-mask"><span style={d(420)}>For</span></span>
          <span className="hero-rise line-mask"><span style={d(540)} className="italic text-accent">{name}</span></span>
        </h1>
        <p className="hero-fade text-lead mx-auto mt-10 max-w-lg" style={d(900)}>
          You have been invited to book a private evening with Chef Eric Jokl. Share a date, a
          place and who will be at the table, and he will be in touch personally.
        </p>
        {note ? (
          <blockquote className="hero-fade mx-auto mt-10 max-w-md border-y border-line py-6 font-display text-xl italic text-fg/85" style={d(1050)}>
            {note}
          </blockquote>
        ) : null}
        <div className="hero-fade mt-12" style={d(1200)}>
          <Cta href={href} track="cta:invite-begin">Begin your request</Cta>
        </div>
      </div>
    </section>
  );
}
