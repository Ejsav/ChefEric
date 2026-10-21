"use client";
import { useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

// A page that failed to render. Says so plainly, offers a retry, and reports
// the failure (name and digest only, no personal data) so it can be fixed.
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    track("page_error", { name: error.name, digest: error.digest ?? null, path: location.pathname });
    console.error(error);
  }, [error]);

  return (
    <section aria-labelledby="err-title" className="tone-dark grain relative flex min-h-[100svh] items-center">
      <div className="container-x pb-20 pt-[calc(var(--header-h)+4rem)]">
        <p className="text-eyebrow">Something went wrong</p>
        <h1 id="err-title" className="mt-8 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] tracking-[-0.012em]">
          The kitchen <span className="italic text-accent">dropped a plate.</span>
        </h1>
        <p className="text-lead mt-8 max-w-lg text-fg-muted">This page could not be shown. Try again, or go back to the home page.</p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <button type="button" onClick={reset} className="cta-primary group">
            <span className="cta-fill" aria-hidden /><span className="relative">Try again</span>
          </button>
          <Link href="/" className="link-underline inline-block py-1 text-[0.74rem] font-medium uppercase tracking-[0.26em]">Home</Link>
        </div>
      </div>
    </section>
  );
}
