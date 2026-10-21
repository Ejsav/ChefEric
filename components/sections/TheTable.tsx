import { menus } from "@/content/menus";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MenuCard } from "@/components/sections/MenuCard";
import { home } from "@/content/home";

// The food, on the home page. A section of paper and type, set in the
// dark room like a menu card left at a place setting.
export function TheTable({ index = "III" }: { index?: string }) {
  return (
    <section aria-labelledby="table-title" className="tone-walnut grain section defer-render relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-[-10%] top-[30%] h-[80%] bg-[radial-gradient(45%_45%_at_60%_50%,rgba(205,140,70,0.16),transparent_70%)]" />
      <div className="container-x relative">
        <div className="grid gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index={index}>The Table</Eyebrow>
            <h2 id="table-title" className="text-h1 mt-10" data-reveal-group>
              <span className="line-mask"><span>{home.table.lines[0]}</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "110ms" } as React.CSSProperties}>
                <span className="italic text-accent">{home.table.lines[1]}</span>
              </span>
            </h2>
          </div>
          <p className="text-lead self-end text-fg-muted md:col-span-4 md:col-start-9" data-reveal>
            {home.table.lead}
          </p>
        </div>
        <div className="mt-14 md:mt-20">
          <MenuCard menus={menus} />
        </div>
      </div>
    </section>
  );
}
