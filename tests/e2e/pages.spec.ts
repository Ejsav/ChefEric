import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/experiences", "/menus", "/chef", "/gallery", "/private-dining",
  "/private-dining/connecticut", "/private-dining/new-york-city", "/private-dining/the-hamptons",
  "/private-dining/florida", "/private-dining/yachts", "/private-dining/private-islands",
  "/questions", "/inquire", "/privacy", "/your-site",
];

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

    // Never scroll sideways, at any width.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // No placeholder contact details, and nothing of the site this one was
    // built from, leak onto the page.
    const html = await page.content();
    expect(html).not.toMatch(/gennaro|raygennaro\.com/i);
    expect(html).not.toMatch(/\bRay\b/);
    expect(errors).toEqual([]);
  });
}

test("destination pages publish FAQ structured data", async ({ page }) => {
  await page.goto("/private-dining/yachts");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.some((b) => b.includes('"FAQPage"'))).toBe(true);
});

test("sitemap lists every destination", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const slug of ["connecticut", "new-york-city", "the-hamptons", "florida", "yachts", "private-islands"]) {
    expect(xml).toContain(`/private-dining/${slug}`);
  }
  expect(xml).toContain("/menus");
});
