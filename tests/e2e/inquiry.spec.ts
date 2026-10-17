import { expect, test, type Page } from "@playwright/test";

const next = (page: Page) => page.getByRole("button", { name: "Continue" }).click();
const heading = (page: Page) => page.locator("h2").first();

test("composer hands a composed evening to the inquiry", async ({ page }) => {
  await page.goto("/");
  await page.locator('#possibilities input[value="yacht"]').check({ force: true });
  await page.locator('#possibilities input[value="celebration"]').check({ force: true });
  const href = await page.getByRole("link", { name: /Request this evening/ }).getAttribute("href");
  expect(href).toContain("setting=yacht");
  await page.goto(href!);
  await expect(page.getByText(/You composed:.*aboard a yacht/)).toBeVisible();
});

test("planner booking a yacht follows the yacht branch and submits", async ({ page }) => {
  await page.goto("/inquire?setting=yacht&occasion=celebration&scale=gathering");
  await page.getByText("For a client", { exact: true }).click(); // auto-advances
  await expect(heading(page)).toHaveText("What is your client imagining?");
  await next(page);
  await expect(heading(page)).toHaveText("Where will the table be?");
  await next(page);
  await expect(page.getByText("A town, city or region is enough.")).toBeVisible();
  await page.locator('[data-field="location"]').fill("Newport, RI");
  await next(page);
  await expect(heading(page)).toHaveText("A few practical things.");
  await expect(page.getByText("The galley")).toBeVisible();
  await page.getByText("A compact galley").click();
  await page.getByText("A weekend").click();
  await next(page);
  await page.getByText("A month or season").click();
  await page.locator('[data-field="season"]').fill("late June");
  await next(page); // when
  await next(page); // guests (prefilled)
  await next(page); // occasion (prefilled)
  await page.getByText("A confidentiality agreement will be needed").click();
  await next(page); // considerations
  await page.locator('[data-field="name"]').fill("Alex Morgan");
  await page.locator('[data-field="email"]').fill("alex@example.com");
  await next(page);
  await expect(page.locator("p.font-display.italic").first()).toContainText("aboard a yacht in Newport, RI, in late June");
  await page.getByRole("button", { name: "Send the request" }).click();
  await expect(page.getByRole("status")).toContainText(/EJ-[A-Z0-9]{6}/);
});

test("a collaboration skips the dinner questions", async ({ page }) => {
  await page.goto("/inquire");
  await page.getByText("For a brand or production").click();
  await page.getByText("A collaboration or appearance").click();
  await expect(heading(page)).toHaveText("Tell us about the project.");
  await expect(page.getByText(/\/ 06/)).toBeVisible();
});

test("a gift can be requested and sample menus pre-fill the request", async ({ page }) => {
  await page.goto("/inquire?menu=at-anchor");
  await page.getByText("For myself, or my family").click();
  await expect(page.getByText("An evening as a gift")).toBeVisible();
  await page.goto("/inquire?menu=at-anchor&form=gift");
  await page.getByText("For myself, or my family").click();
  await expect(page.locator('input[value="gift"]')).toBeChecked();
});

test("the API rejects incomplete requests", async ({ request }) => {
  const res = await request.post("/api/inquire", { data: { name: "x" } });
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(body.errors.email).toBeTruthy();
});
