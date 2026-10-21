import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/experiences", "/menus", "/chef", "/gallery", "/private-dining",
  "/private-dining/new-york-city", "/private-dining/the-hamptons", "/private-dining/palm-beach",
  "/private-dining/yachts", "/private-dining/private-islands", "/private-dining/private-aviation",
  "/questions", "/inquire", "/privacy", "/terms", "/your-site", "/your-site/start",
];

// Pages that exist to demonstrate the persona: kept out of search results.
const DEMO_ONLY = ["/experiences", "/menus", "/chef", "/gallery", "/private-dining", "/private-dining/yachts", "/questions", "/inquire"];
// Pages that should be found.
const INDEXED = ["/", "/your-site", "/your-site/start", "/terms", "/privacy"];

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

    const res = await page.goto(route, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect((await page.locator('meta[name="description"]').getAttribute("content"))?.length ?? 0).toBeGreaterThan(50);

    // Never scroll sideways, at any width.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // Nothing of the client project, and no production tooling, in the page.
    const html = await page.content();
    expect(html).not.toMatch(new RegExp(["genn", "aro"].join(""), "i")); // see scripts/guard.mjs
    expect(html).not.toMatch(/\bRay\b/);
    expect(html).not.toMatch(/public\/media\/|Production notes|Awaiting photograph|>Delivered</);
    expect(html).not.toMatch(/lorem ipsum|TODO|FIXME|undefined<|>null</i);
    expect(errors).toEqual([]);
  });
}

test("demo pages stay out of search; real pages are indexable", async ({ page }) => {
  for (const route of DEMO_ONLY) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]'), route).toHaveAttribute("content", /noindex/);
  }
  for (const route of INDEXED) {
    await page.goto(route);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "", route).not.toMatch(/noindex/);
  }
});

test("structured data never presents the persona as a business", async ({ page }) => {
  for (const route of ["/", "/private-dining/yachts", "/questions"]) {
    await page.goto(route);
    const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(blocks, route).not.toContain('"ProfessionalService"');
    expect(blocks, route).not.toContain('"FAQPage"');
  }
  await page.goto("/your-site");
  const offer = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
  expect(offer).toContain('"FAQPage"');
  expect(offer).toContain('"UnitPriceSpecification"');
});

test("sitemap lists only the pages meant to be found", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/your-site", "/terms", "/privacy"]) expect(xml).toContain(path);
  expect(xml).not.toContain("/private-dining");
  expect(xml).not.toContain("/experiences");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/api\//);
});

test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    hrefs.forEach((h) => seen.add(h.split("#")[0]!));
  }
  for (const href of seen) {
    if (!href) continue;
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("security headers are sent", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'self'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["strict-transport-security"]).toContain("max-age=");
});

test("unknown pages answer 404 with a way back", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("isn’t set");
  await expect(page.getByRole("link", { name: "Back to the home page" })).toBeVisible();
});

// WCAG 2.2 AA, automated. Run on the two main viewports; content is forced
// into its revealed state so contrast is measured on what people read.
for (const route of ROUTES) {
  test(`${route} has no WCAG 2.2 AA violations`, async ({ page }, info) => {
    test.skip(!["desktop", "phone"].includes(info.project.name), "axe runs on desktop and phone");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelectorAll("[data-reveal],[data-reveal-group],[data-draw]").forEach((e) => e.classList.add("is-in")));
    await page.addStyleTag({ content: ".defer-render{content-visibility:visible!important}" });
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const summary = result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
    expect(summary).toEqual([]);
  });
}
