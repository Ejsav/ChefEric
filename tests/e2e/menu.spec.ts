import { expect, test, type Page } from "@playwright/test";

// The phone menu is a native modal dialog: the page behind it is inert, focus
// cannot leave it, it has its own close button, and on short screens every
// link stays within reach.

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  return menu;
};

test.describe("phone menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("is a modal: focus starts inside, stays inside, and the page behind is inert", async ({ page }) => {
    await page.goto("/");
    const menu = await open(page);
    await expect(menu.getByRole("link", { name: "Home" })).toBeFocused();
    expect(await menu.evaluate((d) => (d as HTMLDialogElement).matches(":modal"))).toBe(true);

    // Twenty presses of Tab, both ways: focus never lands on the page behind.
    for (const key of ["Tab", "Shift+Tab"]) {
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press(key);
        const where = await page.evaluate(() => {
          const a = document.activeElement;
          return !a || a === document.body ? "none" : a.closest("#mobile-menu") ? "menu" : "page";
        });
        expect(where, `${key} ×${i + 1}`).not.toBe("page");
      }
    }

    // The close control is inside the dialog and reachable by keyboard.
    const close = menu.getByRole("button", { name: "Close menu" });
    await close.focus();
    await expect(close).toBeFocused();

    // Nothing behind can take focus while it is open.
    const behind = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>("main a[href]")!;
      link.focus();
      return document.activeElement === link;
    });
    expect(behind).toBe(false);
  });

  test("closes from its own button and on Escape, handing focus back to the toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    let menu = await open(page);
    await menu.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

    menu = await open(page);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("a link to the page you are on still closes it", async ({ page }) => {
    await page.goto("/");
    const menu = await open(page);
    await menu.getByRole("link", { name: "Home" }).click();
    await expect(menu).toBeHidden();
  });

  test("a link goes where it says and closes the menu", async ({ page }) => {
    await page.goto("/");
    const menu = await open(page);
    await menu.getByRole("link", { name: "Gallery" }).click();
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(menu).toBeHidden();
  });
});

// Landscape phones and a desktop window zoomed to 200% (1440×900 → 720×450).
for (const size of [{ width: 844, height: 390 }, { width: 667, height: 375 }, { width: 720, height: 450 }]) {
  test(`every menu link is reachable at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    const menu = await open(page);
    const links = menu.getByRole("navigation", { name: "Mobile" }).getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await link.scrollIntoViewIfNeeded();
      const box = (await link.boundingBox())!;
      expect(box.y, `link ${i}`).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height, `link ${i}`).toBeLessThanOrEqual(size.height);
      // And it is the thing under the pointer there, not covered by anything.
      const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest("a")?.textContent, { x: box.x + 4, y: box.y + box.height / 2 });
      expect(hit, `link ${i}`).toBe(await link.textContent());
    }
    // The close button stays in reach too.
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeInViewport();
    await links.last().click();
    await expect(page).toHaveURL(/\/inquire$/);
  });
}
