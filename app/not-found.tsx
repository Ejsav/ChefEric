import { Cta } from "@/components/ui/Cta";

export default function NotFound() {
  return (
    <section className="tone-dark grain relative flex min-h-[100svh] items-center">
      <div className="container-x pt-[var(--header-h)]">
        <p className="text-eyebrow">Page not found</p>
        <h1 className="text-display mt-8">
          This table <span className="italic text-accent">isn&rsquo;t set.</span>
        </h1>
        <div className="mt-12"><Cta href="/">Back to the home page</Cta></div>
      </div>
    </section>
  );
}
