import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/experiences", "/menus", "/chef", "/gallery", "/private-dining",
  "/private-dining/new-york-city", "/private-dining/the-hamptons", "/private-dining/palm-beach",
  "/private-dining/yachts", "/private-dining/private-islands", "/private-dining/private-aviation",
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
    expect(html).not.toMatch(new RegExp(["genn", "aro"].join(""), "i")); // see scripts/guard.mjs
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
  for (const slug of ["new-york-city", "the-hamptons", "palm-beach", "yachts", "private-islands", "private-aviation"]) {
    expect(xml).toContain(`/private-dining/${slug}`);
  }
  expect(xml).toContain("/menus");
});

test("production notes name the file every slot expects", async ({ page }) => {
  await page.goto("/chef?notes=1");
  const note = page.locator('[data-slot="chapter-tonight"] .slot-note');
  await expect(note).toBeVisible();
  await expect(note).toContainText("public/media/chapter-tonight.jpg");
  await page.goto("/chef?notes=0");
  await expect(page.locator(".slot-note").first()).toBeHidden();
});
