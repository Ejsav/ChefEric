import { expect, test } from "@playwright/test";

// The planner, the gallery lightbox and the menu tabs: every interaction must
// work by pointer, by keyboard, and from a shared link.

test.describe("planner", () => {
  test("an impossible evening is moved, and the planner says why", async ({ page }) => {
    await page.goto("/#possibilities");
    const planner = page.locator("#possibilities");
    await planner.locator('input[value="lesson"]').check({ force: true });
    await planner.locator('input[value="yacht"]').check({ force: true });
    await expect(planner.getByText("A galley is too tight to teach in, so the evening becomes dinner among friends.")).toBeVisible();
    await expect(planner.locator('input[value="friends"]')).toBeChecked();
    await expect(planner.locator('input[value="yacht"]')).toBeChecked();

    await planner.locator('input[value="grand"]').check({ force: true });
    await expect(planner.getByText(/At anchor, a table seats up to twenty-four, so the evening moves to a private home/)).toBeVisible();
    await expect(planner.locator('input[value="residence"]')).toBeChecked();
  });

  test("a shared link opens the same plan, made possible", async ({ page }) => {
    await page.goto("/?room=hangar&reason=lesson&table=intimate#possibilities");
    const planner = page.locator("#possibilities");
    await expect(planner.locator('input[value="hangar"]')).toBeChecked();
    await expect(planner.locator('input[value="friends"]')).toBeChecked();
    await expect(planner.locator('input[value="gathering"]')).toBeChecked();
    await expect(planner.getByRole("heading", { level: 3 })).toContainText("Dinner among friends, in a private hangar.");
  });

  test("choices stay in the address and reach the request", async ({ page }) => {
    await page.goto("/");
    const planner = page.locator("#possibilities");
    await planner.locator('input[value="estate"]').check({ force: true });
    await expect(page).toHaveURL(/room=estate/);
    await expect(planner.getByRole("link", { name: /Request this evening/ })).toHaveAttribute("href", /setting=estate/);
  });

  test("keyboard arrows move through the rooms", async ({ page }) => {
    await page.goto("/");
    const first = page.locator('#possibilities input[value="residence"]');
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('#possibilities input[value="penthouse"]')).toBeChecked();
  });
});

test.describe("gallery", () => {
  test("the lightbox opens, steps with the keyboard, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/gallery");
    const trigger = page.getByRole("button", { name: /Enlarge photograph 1 of/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Gallery" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Photograph 1 of")).toBeAttached();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText("Photograph 2 of")).toBeAttached();
    await page.keyboard.press("End");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText("Photograph 1 of")).toBeAttached(); // wraps
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the close and next buttons work by pointer", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByRole("button", { name: /Enlarge photograph 3 of/ }).click();
    const dialog = page.getByRole("dialog", { name: "Gallery" });
    await dialog.getByRole("button", { name: "Next photograph" }).first().click();
    await expect(dialog.getByText("Photograph 4 of")).toBeAttached();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe("menus", () => {
  test("tabs follow the arrow keys, Home and End", async ({ page }) => {
    await page.goto("/menus");
    const tabs = page.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Contains");
  });
});

test.describe("sound", () => {
  test("music is off until asked, plays on request, survives navigation and turns off", async ({ page }) => {
    const audio: string[] = [];
    page.on("request", (r) => { if (r.url().includes("/audio/")) audio.push(r.url()); });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(audio).toEqual([]); // nothing downloads before the visitor asks

    const button = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Turn sound on" });
    const served = page.waitForResponse((r) => r.url().includes("/audio/kitchen-music.mp3"));
    await button.click();
    const res = await served;
    expect([200, 206]).toContain(res.status());
    expect(res.headers()["content-type"]).toContain("audio/mpeg");
    // "Sound on" appears only once playback has actually started.
    const on = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Turn sound off" });
    await expect(on).toHaveAttribute("aria-pressed", "true");
    await expect(on).toContainText("Sound on");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Menus" }).click();
    await expect(page).toHaveURL(/\/menus$/);
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Turn sound off" })).toBeVisible();

    await page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Turn sound off" }).click();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Turn sound on" })).toHaveAttribute("aria-pressed", "false");
  });
});
