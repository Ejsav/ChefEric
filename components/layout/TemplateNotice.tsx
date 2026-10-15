import Link from "next/link";

// This site is a template shown under an example name. The notice sits above
// the navigation on every page, says so plainly, and leads to the offer.
export function TemplateNotice() {
  return (
    <div className="border-b border-[rgba(190,156,104,0.22)] bg-[rgba(12,8,6,0.94)]">
      <div className="container-x flex h-[var(--notice-h)] items-center justify-center gap-x-3 text-center text-[0.62rem] uppercase tracking-[0.2em] text-[rgba(237,229,214,0.78)] sm:text-[0.64rem]">
        <span className="truncate">
          <span className="text-[rgb(var(--brass))]">Template example</span>
          <span className="hidden md:inline"> · Eric Jokl is the example, not a chef. This site can be yours, customized to you</span>
        </span>
        <Link
          href="/your-site"
          data-track="cta:template-notice"
          className="link-underline shrink-0 pb-0.5 text-[rgb(var(--ivory))]"
        >
          <span className="md:hidden">Get this site →</span>
          <span className="hidden md:inline">Get this site · $50/mo →</span>
        </Link>
      </div>
    </div>
  );
}
