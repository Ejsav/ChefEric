# Quality assurance

## Automated, on every push (CI)

| Gate | Command |
|---|---|
| Repository boundary | `npm run guard` |
| Photography guide matches the manifest | `npm run media:guide -- --check` |
| Types, lint, production build | `npm run type-check`, `npm run lint`, `npm run build` |
| Known vulnerabilities in production dependencies | `npm audit --omit=dev --audit-level=high` |
| 152 end-to-end checks | `npm run test:e2e` |

The end-to-end suite runs every route at 1440px (desktop), a Pixel 7 (phone), **320px** (the smallest phones) and **1024px landscape** (tablet). See the README for the full list of what it asserts, including axe WCAG 2.2 AA on every route.

## Measured (October 2026, production build, local)

Lighthouse 12.8, mobile profile with simulated slow 4G and 4× CPU throttling, unless noted. Simulated figures are a pessimistic lab estimate; field data from Speed Insights after launch is the measure that counts.

| Page | Performance | Accessibility | Best practices | SEO | LCP (simulated) | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 92–94 | 100 | 100 | 100 | 2.9 s | 0 | 120–220 ms |
| `/` (desktop profile) | 100 | | | | 0.6 s | 0 | 0 ms |
| `/your-site` | 96–98 | 100 | 100 | 100 | 2.3–2.5 s | 0 | 0–140 ms |
| `/your-site/start` | 95–96 | 100 | 100 | 100 | 2.5 s | 0 | 120 ms |
| `/experiences` | 95–98 | 100 | 100 | 69* | 2.4–2.8 s | 0 | 0–120 ms |
| `/menus` | 96 | 100 | 100 | 69* | 2.6 s | 0 | 90 ms |
| `/gallery` | 94 | 100 | 100 | 69* | 3.1 s | 0 | 40 ms |
| `/chef` | 94–96 | 100 | 100 | 69* | 2.7–3.0 s | 0 | 0–110 ms |
| `/inquire` | 96 | 100 | 100 | 66* | 2.7 s | 0 | 80 ms |

\* SEO is lower on purpose: these demo-persona pages are `noindex` (see `lib/seo.ts`).

Observed (unthrottled) LCP on the same runs was 0.15–0.36 s. Scores vary by a few points between identical runs.

## Manual pass before a release

Automated tests do not replace eyes and real devices. Before promoting to production, on the **preview deployment**:

- [ ] Safari on an iPhone, Chrome on an Android phone, Safari and Firefox on a Mac, Edge or Chrome on Windows.
- [ ] Phone landscape on the home page and the request form.
- [ ] Keyboard only: tab through the home page, open the menu, use the planner with arrows, open and close the lightbox, complete both forms.
- [ ] VoiceOver (iOS) on the planner and the chef request: changes are announced.
- [ ] Reduced motion on: no prelude, no parallax, content fully visible.
- [ ] One real website request reaches the inbox (and the webhook, if set), and the acknowledgment arrives.
- [ ] Share `/` and `/your-site` in a messaging app: the share cards render.
