# ChefEric: working rules

This repository is **the Chef Eric Jokl luxury private-chef website template**: Eric Jokl's own demonstration site, shown to prospective clients as the standard their finished site will meet. It is not a client site.

## The boundary (read before changing anything)

- A real client's private-chef site lives in a **separate repository, `Ejsav/Chef`**, with its own Vercel project. That project and that repository are never to be read from, copied from, written to, or deployed from this repository.
- Never bring the client's name, story, copy, menus, places, photography, domain, reference numbers or deployment settings into this repository. `npm run guard` (and CI) fails on known traces; passing the guard is the minimum, not the goal. Write new material instead.
- Never configure, deploy to, rename or attach domains to the client's Vercel project from work in this repository. This repository's Vercel project is **`eric-jokl`**, and `chef.ericjokl.com` belongs to it.
- If a task seems to need anything from the client project, stop and ask Eric.

## Honesty rules for the demo

- "Chef Eric Jokl" is a demo persona. The notice bar, footer and `/your-site` say so; keep them.
- Never invent credentials, employers, awards, press, years of experience or past clients. The chef page describes how the work is done, not a history.
- Testimonials stay labelled *Sample*. Prices are demo guides.
- The demo imagery is created from Eric's likeness and the footer says so.

## The demo switch and the offer

- `site.demo` in `lib/site.ts` decides what is a showcase (notice bar, colophon, chef request that never delivers, noindex on persona pages). Keep it `true` here.
- The commercial offer (prices, inclusions, terms) lives only in `content/offer.ts`. Its figures are proposed until Eric confirms them; never change a price or a term without being asked.
- The website request (`/your-site/start`) is real business: never weaken its delivery guarantees in `lib/leads.ts` (no "success" without a channel that a person reads).

## Where things live

- Brand facts: `lib/site.ts`. Copy: `content/` (home page words in `content/home.ts`). Media slots: `content/media.ts`.
- Operations, customization and QA: `docs/OPERATIONS.md`, `docs/CUSTOMIZING.md`, `docs/QA.md`.
- Images: `public/media/<slot>.<ext>`; the build picks them up. `npm run media` shows status, `docs/DEMO_IMAGES.md` maps the supplied demo images to slots.
- The professional shoot brief, `docs/PHOTOGRAPHY_GUIDE.md`, is generated: edit `content/media.ts`, then `npm run media:guide`.

## Before pushing

```bash
npm run check        # guard, type-check, lint, build
npm run test:e2e     # Playwright, desktop and phone
```
