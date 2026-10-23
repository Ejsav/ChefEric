import { expect, test, type Page } from "@playwright/test";

const next = (page: Page) => page.getByRole("button", { name: "Continue" }).click();
const heading = (page: Page) => page.locator("h2").first();
// Choosing who it is for moves on by itself; wait for the next question.
const asHost = async (page: Page) => {
  await page.getByText("For myself, or my family").click();
  await expect(heading(page)).toHaveText("What are you imagining?");
};

test("the planner hands a composed evening to the request", async ({ page }) => {
  await page.goto("/");
  await page.locator('#possibilities input[value="yacht"]').check({ force: true });
  await page.locator('#possibilities input[value="celebration"]').check({ force: true });
  const href = await page.getByRole("link", { name: /Request this evening/ }).getAttribute("href");
  expect(href).toContain("setting=yacht");
  await page.goto(href!);
  await expect(page.getByText(/You composed:.*aboard a yacht/)).toBeVisible();
});

test("the chef request says it is a demonstration, follows the yacht branch and shows what a chef would receive", async ({ page }) => {
  await page.goto("/inquire?setting=yacht&occasion=celebration&scale=gathering");
  await expect(page.getByText("saved as a draft in this browser only")).toBeVisible();
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
  const done = page.getByRole("status");
  await expect(done).toContainText(/Demonstration complete · EJ-[A-Z0-9]{6}/);
  await expect(done).toContainText("Nothing was booked");
  await expect(done).toContainText("checked by the server and discarded"); // says exactly what happened
  expect(await page.evaluate(() => localStorage.getItem("ej:inquiry-draft"))).toBeNull();
  await expect(done.getByText("What the chef receives")).toBeVisible();
  await expect(done.locator("pre")).toContainText("Location: Newport, RI");
  await expect(done.getByRole("link", { name: "Get this website" })).toHaveAttribute("href", "/your-site");
});

test("a class offers class-sized groups only", async ({ page }) => {
  await page.goto("/inquire?occasion=lesson&scale=gathering&setting=residence");
  await page.getByText("For myself, or my family").click();
  await expect(page.locator('input[value="lesson"]')).toBeChecked();
  await next(page);
  await page.locator('[data-field="location"]').fill("Greenwich");
  await next(page); // place
  await next(page); // details (kitchen optional)
  await page.getByText("We're flexible").click();
  await next(page);
  await expect(heading(page)).toHaveText("How many will be cooking?");
  await expect(page.locator('input[value="9-12"]')).toBeChecked();
  await expect(page.getByText("Twenty-five to eighty")).toHaveCount(0);
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

test("the API refuses a class for sixty", async ({ request }) => {
  const res = await request.post("/api/inquire", {
    data: { role: "host", form: "lesson", setting: "residence", location: "Greenwich", when: "flexible", guests: "25-80", name: "Alex Morgan", email: "alex@example.com" },
  });
  expect(res.status()).toBe(422);
  expect((await res.json()).errors.guests).toContain("twelve");
});

test("old website links land on the website request", async ({ page }) => {
  await page.goto("/inquire?about=website&name=Sofia%20Marchetti");
  await expect(page).toHaveURL(/\/your-site\/start\?.*name=Sofia/);
  await expect(page.locator("#f-name")).toHaveValue("Sofia Marchetti");
});

// ── Guest numbers: one set of bands, from the planner to the server ─────

test("the planner's table size arrives in the request exactly as shown", async ({ page }) => {
  const cases = [
    { url: "/inquire?setting=residence&occasion=celebration&scale=grand", value: "25-80", label: "Twenty-five to eighty" },
    { url: "/inquire?setting=residence&occasion=friends&scale=gathering", value: "9-24", label: "Nine to twenty-four" },
    { url: "/inquire?setting=residence&occasion=lesson&scale=intimate", value: "1-8", label: "One to eight" },
  ];
  for (const c of cases) {
    await page.goto(c.url);
    await expect(page.getByText(/You composed:/)).toBeVisible();
    await asHost(page);
    await next(page); // form (prefilled)
    await page.locator('[data-field="location"]').fill("Greenwich");
    await next(page); // place
    await next(page); // details
    await page.getByText("We're flexible").click();
    await next(page); // when
    await expect(page.locator(`input[value="${c.value}"]`)).toBeChecked();
    await expect(page.getByText(c.label, { exact: true })).toBeVisible();
  }
});

test("the planner's ranges meet without gaps and match the request", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#possibilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText("Two to eight").first()).toBeVisible();
  await expect(section.getByText("Nine to twenty-four").first()).toBeVisible();
  await expect(section.getByText("Twenty-five to eighty").first()).toBeVisible();
  await expect(section.getByText("Ten to twenty-four")).toHaveCount(0);
});

test("a dinner that was a class drops the class size", async ({ page }) => {
  await page.goto("/inquire?occasion=lesson&scale=gathering&setting=residence");
  await asHost(page);
  await next(page);
  await page.locator('[data-field="location"]').fill("Greenwich");
  await next(page);
  await next(page);
  await page.getByText("We're flexible").click();
  await next(page);
  await expect(page.locator('input[value="9-12"]')).toBeChecked();
  // Back to the question, and make it a dinner: the class size is no longer an answer.
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Back" }).click();
  await expect(heading(page)).toHaveText("What are you imagining?");
  await page.getByText("A private dinner", { exact: true }).click();
  await expect(heading(page)).toHaveText("Where will the table be?");
  await next(page); // place (kept)
  await next(page); // details
  await next(page); // when (kept)
  await expect(heading(page)).toHaveText(/How many/);
  await expect(page.locator('input[name][type="radio"]:checked')).toHaveCount(0);
  await next(page);
  await expect(page.getByText("Choose one to continue.")).toBeVisible();
});

test("the server applies the request's own rules", async ({ request }) => {
  const base = { role: "host", form: "dinner", setting: "residence", location: "Greenwich", when: "flexible", name: "Alex Morgan", email: "alex@example.com" };
  const post = (data: object) => request.post("/api/inquire", { data: { ...base, ...data } });

  // Guests are required for an evening, as the conversation requires them.
  let res = await post({});
  expect(res.status()).toBe(422);
  expect((await res.json()).errors.guests).toBeTruthy();
  expect((await post({ guests: "9-24" })).status()).toBe(200);
  expect((await post({ guests: "10-24" })).status()).toBe(422); // retired band
  expect((await post({ form: "lesson", guests: "1-8" })).status()).toBe(200); // a class for one
  expect((await post({ form: "lesson", guests: "2-8" })).status()).toBe(422); // dinner band, not a class band

  // A date must be a real day, today or later, within three years.
  const day = (offset: number) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
  for (const date of ["tomorrow", "2026-02-30", day(-3), day(365 * 4)]) {
    res = await post({ guests: "2-8", when: "date", date });
    expect(res.status(), date).toBe(422);
    expect((await res.json()).errors.date, date).toBeTruthy();
  }
  expect((await post({ guests: "2-8", when: "date", date: day(30) })).status()).toBe(200);

  // A collaboration has no guest count.
  expect((await post({ form: "collaboration", setting: undefined, location: undefined, project: "A dinner series for a magazine." })).status()).toBe(200);
});

test("the date field starts from the visitor's own today", async ({ browser }) => {
  // Late evening in Los Angeles is already tomorrow in UTC: the minimum must be the local day.
  const context = await browser.newContext({ timezoneId: "America/Los_Angeles", reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date("2026-11-20T23:30:00-08:00"));
  await page.goto("/inquire?setting=residence&occasion=friends&scale=intimate");
  await asHost(page);
  await next(page);
  await page.locator('[data-field="location"]').fill("Greenwich");
  await next(page);
  await next(page);
  await page.getByText("A specific date").click();
  const date = page.locator('[data-field="date"]');
  await expect(date).toHaveAttribute("min", "2026-11-20");
  await expect(date).toHaveAttribute("max", "2029-11-20");
  await date.fill("2026-11-19");
  await next(page);
  await expect(page.getByText("Please choose a date from today onwards.")).toBeVisible();
  await date.fill("2026-11-20");
  await next(page);
  await expect(heading(page)).toHaveText(/How many/);
  await context.close();
});

test("an old draft never carries an answer the questions no longer offer", async ({ page }) => {
  await page.goto("/inquire");
  await page.evaluate(() => localStorage.setItem("ej:inquiry-draft", JSON.stringify({
    answers: { role: "host", form: "dinner", setting: "residence", location: "Greenwich", when: "flexible", guests: "10-24" },
    step: "guests",
    ts: Date.now(),
  })));
  await page.reload();
  await page.getByRole("button", { name: /Continue where you left off|Continue/ }).first().click();
  await expect(heading(page)).toHaveText(/How many/);
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
});
