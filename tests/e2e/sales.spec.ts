import { expect, test, type Page } from "@playwright/test";
import { websiteLeadEmail, type WebsiteRequest } from "../../lib/sales";

// The one form that is real business: it must validate, never send twice,
// screen bots, and only say "arrived" when the request has a destination.

async function fill(page: Page) {
  await page.locator("#f-name").fill("Sofia Marchetti");
  await page.locator("#f-email").fill("sofia@example.com");
  await page.locator("#f-business").fill("Marchetti Private Dining");
  await page.locator("#f-website").fill("marchetti-dining.com");
  await page.getByText("Private chef", { exact: true }).click();
  await page.getByText("This design, in my colors").click();
  await page.getByText("Sage", { exact: true }).click();
  await page.getByText("Booking calendar").click();
  await page.getByText("Within a month").click();
  await page.getByText("The plan as listed").click();
  await page.locator("#f-notes").fill("Dinners in Connecticut, mostly weekends.");
}

test("an empty request lists what is missing and takes focus", async ({ page }) => {
  await page.goto("/your-site/start");
  await page.getByRole("button", { name: "Send the request" }).click();
  const summary = page.getByRole("alert").filter({ hasText: "need another look" });
  await expect(summary).toBeFocused();
  await expect(summary).toContainText("Please add your name.");
  await expect(page.locator("#f-email")).toHaveAttribute("aria-invalid", "true");
  // Fixing a field clears its error live.
  await page.locator("#f-name").fill("Sofia Marchetti");
  await expect(summary).not.toContainText("Please add your name.");
});

test("a complete request arrives with a reference", async ({ page }) => {
  await page.goto("/your-site/start");
  await fill(page);
  await page.getByRole("button", { name: "Send the request" }).click();
  const done = page.getByRole("status");
  await expect(done).toContainText(/Received · EW-[A-Z0-9]{6}/);
  await expect(done).toContainText("Thank you, Sofia.");
});

test("the studio carries the whole preview into the request", async ({ page }) => {
  await page.goto("/your-site");
  await page.locator("#studio-name").fill("Aiko Mori");
  await page.locator("#studio-role").fill("Chef's Table");
  await page.locator("#studio-place").fill("Kyoto");
  await page.getByText("Tide", { exact: true }).first().click();
  await page.getByRole("link", { name: "Start with this" }).click();
  await expect(page).toHaveURL(/name=Aiko\+Mori|name=Aiko%20Mori/);
  await expect(page.locator("#f-name")).toHaveValue("Aiko Mori");
  await expect(page.locator("#f-title")).toHaveValue("Chef's Table");
  await expect(page.locator("#f-place")).toHaveValue("Kyoto");
  await expect(page.locator('input[value="palette"]')).toBeChecked();
  await expect(page.getByText("A palette to start from")).toBeVisible();
  await expect(page.locator('input[value="tide"]')).toBeChecked();

  // The house palette is this design as it stands.
  await page.goto("/your-site/start?name=Aiko%20Mori&palette=brass");
  await expect(page.locator('input[value="as-is"]')).toBeChecked();
});

test("the preview reaches the lead", async ({ request }) => {
  // The server accepts it…
  const ok = await request.post("/api/website-inquiry", { data: { ...valid, title: "Chef's Table", place: "Kyoto", submissionId: `e2e-preview-${Date.now()}` } });
  expect(ok.status()).toBe(200);
  const long = await request.post("/api/website-inquiry", { data: { ...valid, title: "x".repeat(61), submissionId: `e2e-preview-long-${Date.now()}` } });
  expect(long.status()).toBe(422);
  // …and the email Eric receives (and the confirmation) says what was previewed.
  const lead = websiteLeadEmail({ ...valid, title: "Chef's Table", place: "Kyoto", design: "palette", palette: "tide" } as WebsiteRequest, "EW-TEST01", []);
  expect(lead.text).toContain("On the site: Sofia Marchetti · Chef's Table · Kyoto");
  expect(lead.text).toContain("Design: This design, in my colors — Tide");
});

const valid = {
  name: "Sofia Marchetti",
  email: "sofia@example.com",
  business: "Marchetti Private Dining",
  type: "private-chef",
  design: "as-is",
  features: ["gallery"],
  timeline: "month",
  budget: "plan",
  startedAt: Date.now() - 60_000,
};

test("the API validates on the server", async ({ request }) => {
  const res = await request.post("/api/website-inquiry", { data: { ...valid, email: "nope", website: "not a site", submissionId: "e2e-invalid-0001" } });
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(body.errors.email).toBeTruthy();
  expect(body.errors.website).toBeTruthy();
});

test("the same submission is never delivered twice", async ({ request }) => {
  const data = { ...valid, submissionId: `e2e-dup-${Date.now()}` };
  const a = await (await request.post("/api/website-inquiry", { data })).json();
  const b = await (await request.post("/api/website-inquiry", { data })).json();
  expect(a.ok).toBe(true);
  expect(b.ref).toBe(a.ref);
});

test("a bot that fills the honeypot is answered but not delivered", async ({ request }) => {
  const res = await request.post("/api/website-inquiry", { data: { ...valid, company: "Acme", submissionId: `e2e-bot-${Date.now()}` } });
  expect(res.status()).toBe(200); // a bot learns nothing
  expect((await res.json()).acknowledged).toBe(false);
});

test("bursts from one address are slowed down", async ({ request }) => {
  const headers = { "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 200) + 20}` };
  const codes: number[] = [];
  for (let i = 0; i < 7; i++) {
    const res = await request.post("/api/website-inquiry", { headers, data: { ...valid, submissionId: `e2e-burst-${Date.now()}-${i}` } });
    codes.push(res.status());
  }
  expect(codes.slice(0, 5).every((c) => c === 200)).toBe(true);
  expect(codes.at(-1)).toBe(429);
});
