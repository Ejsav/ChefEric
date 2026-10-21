import { devices, expect, test, type Page } from "@playwright/test";

// The fork cursor: artwork, calibration, states and companions.
// The fork is the native cursor, so these tests read the cursor the browser
// would draw (computed style) and measure the artwork itself.

const cursorOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => getComputedStyle(el).cursor);

// Where an element was placed by translate3d(), in CSS px. Browsers report
// pointer positions to a fraction of a pixel, so compare to within half a pixel.
const placedAt = async (page: Page, selector: string) => {
  const t = await page.locator(selector).first().evaluate((el) => (el as HTMLElement).style.transform);
  const m = /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0px\)/.exec(t);
  expect(m, t).not.toBeNull();
  return { x: Number(m![1]), y: Number(m![2]) };
};
const near = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  expect(Math.abs(a.x - b.x), `x ${a.x} vs ${b.x}`).toBeLessThan(0.5);
  expect(Math.abs(a.y - b.y), `y ${a.y} vs ${b.y}`).toBeLessThan(0.5);
};

test.describe("fork cursor", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("artwork is crisp at 1x, 2x and 3x, and the tines are the hotspot", async ({ page }) => {
    await page.goto("/");
    for (const name of ["fork", "fork-hover", "fork-press"]) {
      for (const scale of [1, 2, 3]) {
        const file = `/cursor/${name}${scale === 1 ? "" : `@${scale}x`}.png`;
        const res = await page.request.get(file);
        expect(res.status(), file).toBe(200);
        expect(res.headers()["content-type"], file).toContain("image/png");

        // Measure the artwork: how far does the fork reach along its own axis
        // past the hotspot, and is that reach centred on the hotspot?
        const m = await page.evaluate(async ({ file, scale }) => {
          const img = new Image();
          img.src = file;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const { data } = ctx.getImageData(0, 0, c.width, c.height);
          const hx = 4.5, hy = 4.5;                // centre of hotspot pixel (4, 4), CSS px
          const a = (-38 * Math.PI) / 180;
          const dx = Math.sin(a), dy = -Math.cos(a); // the direction the tines point
          let reach = -Infinity;
          const lead: number[] = [];
          for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {
            if (data[(py * c.width + px) * 4 + 3]! < 128) continue;
            const x = (px + 0.5) / scale - hx, y = (py + 0.5) / scale - hy;
            const along = x * dx + y * dy;
            if (along > reach) reach = along;
            if (along > -0.9) lead.push(x * -dy + y * dx); // across the axis, for the leading pixels
          }
          const across = lead.reduce((s, v) => s + v, 0) / lead.length;
          const corner = data[3]! + data[(c.width - 1) * 4 + 3]!; // top corners must be empty
          return { w: c.width, h: c.height, reach, across, corner };
        }, { file, scale });

        expect(m.w, file).toBe(32 * scale);
        expect(m.h, file).toBe(32 * scale);
        expect(m.corner, file).toBe(0);
        // The tines end at the hotspot: never short of it, never more than ~1px past (rim and anti-aliasing).
        expect(m.reach, file).toBeGreaterThan(-0.2);
        expect(m.reach, file).toBeLessThan(1.3);
        // And the leading tines straddle it.
        expect(Math.abs(m.across), file).toBeLessThan(1.2);
      }
    }
  });

  test("rest, hover, press and the system cursors land where they belong", async ({ page }) => {
    await page.goto("/your-site/start");
    expect(await cursorOf(page, "main p")).toMatch(/fork\.png.*4 4, auto/);
    expect(await cursorOf(page, "header a[href='/']")).toMatch(/fork-hover\.png.*4 4, pointer/);
    expect(await cursorOf(page, "header a[href='/'] svg")).toMatch(/fork-hover\.png/); // inside a link too
    expect(await cursorOf(page, "#f-name")).toBe("auto");            // typing: the system I-beam
    expect(await cursorOf(page, "#f-notes")).toBe("auto");           // and the resize grip
    expect(await cursorOf(page, "label:has(input[type=radio])")).toMatch(/fork-hover\.png/);

    // Press: the foreshortened fork while the button is held.
    const send = page.getByRole("button", { name: "Send the request" });
    await send.hover();
    await page.mouse.down();
    expect(await send.evaluate((el) => getComputedStyle(el).cursor)).toMatch(/fork-press\.png/);
    await page.mouse.up();
    expect(await send.evaluate((el) => getComputedStyle(el).cursor)).toMatch(/fork-hover\.png/);
  });

  test("disabled controls say so", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const b = document.createElement("button");
      b.id = "probe";
      b.disabled = true;
      b.textContent = "probe";
      document.body.appendChild(b);
    });
    expect(await cursorOf(page, "#probe")).toBe("not-allowed");

    // Still true while pressed: the press fork never overrides a refusal.
    await page.evaluate(() => {
      const a = document.createElement("a");
      a.id = "probe-link";
      a.href = "#";
      a.setAttribute("aria-disabled", "true");
      a.textContent = "probe link";
      a.style.cssText = "position:fixed;left:40px;top:300px;padding:12px;z-index:2147483647;background:#fff";
      a.addEventListener("click", (e) => e.preventDefault());
      document.body.appendChild(a);
    });
    const link = page.locator("#probe-link");
    await link.hover();
    await page.mouse.down();
    expect(await link.evaluate((el) => getComputedStyle(el).cursor)).toBe("not-allowed");
    await expect(page.locator(".fork-contact")).toHaveCount(0);
    await page.mouse.up();
  });

  test("a press leaves four tine marks at the point of contact, then clears", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto("/menus");
    const tab = page.getByRole("tab").nth(1);
    await tab.scrollIntoViewIfNeeded();
    const box = (await tab.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 12);
    await page.mouse.down();
    const mark = page.locator(".fork-contact");
    await expect(mark).toHaveCount(1);
    await expect(mark.locator("i")).toHaveCount(4);
    near(await placedAt(page, ".fork-contact"), { x: box.x + 20, y: box.y + 12 });
    await page.mouse.up();
    await expect(mark).toHaveCount(0, { timeout: 2000 });
    // Never on plain text.
    await page.mouse.click(5, 600);
    await expect(page.locator(".fork-contact")).toHaveCount(0);
    await context.close();
  });

  test("reduced motion: no marks, the fork itself unchanged", async ({ page }) => {
    await page.goto("/menus"); // the suite runs with reduced motion
    await page.getByRole("tab").nth(1).click();
    await expect(page.locator(".fork-contact")).toHaveCount(0);
    expect(await cursorOf(page, "main")).toMatch(/fork\.png/);
  });

  test("over photographs the fork carries a label beside the handle", async ({ page }) => {
    await page.goto("/gallery");
    const frame = page.locator("[data-cursor-label]").first();
    await frame.hover();
    const label = page.locator(".fork-label");
    await expect(label).toHaveAttribute("data-on", "true");
    await expect(label).toHaveText("View");
    const box = (await frame.boundingBox())!;
    near(await placedAt(page, ".fork-label"), { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    await page.mouse.move(5, 5);
    await expect(label).toHaveAttribute("data-on", "false");
  });

  test("selecting text shows the text cursor, and only while selecting", async ({ page }) => {
    await page.goto("/terms");
    const p = page.locator("main section p").first();
    const box = (await p.boundingBox())!;
    await page.mouse.move(box.x + 4, box.y + 6);
    await page.mouse.down();
    await page.mouse.move(box.x + 220, box.y + 8, { steps: 6 });
    await expect(page.locator("html")).toHaveAttribute("data-fork-selecting", "");
    expect(await cursorOf(page, "main section p")).toBe("text");
    await page.mouse.up();
    await expect(page.locator("html")).not.toHaveAttribute("data-fork-selecting", "");
    expect(await page.evaluate(() => document.getSelection()?.toString().length ?? 0)).toBeGreaterThan(3); // the selection itself is untouched
  });

  test("clicks land on what the tines point at", async ({ page }) => {
    // The hotspot is the click point: a click at a link's edge pixel still opens it.
    await page.goto("/");
    const link = page.locator("footer a[href='/terms']");
    await link.scrollIntoViewIfNeeded();
    const box = (await link.boundingBox())!;
    await page.mouse.click(box.x + 1, box.y + box.height / 2);
    await expect(page).toHaveURL(/\/terms$/);
  });
});

test("touch devices keep their own behaviour", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 7"] });
  const page = await context.newPage();
  await page.goto("/");
  expect(await page.locator("main p").first().evaluate((el) => getComputedStyle(el).cursor)).toBe("auto");
  await page.locator("#possibilities").scrollIntoViewIfNeeded();
  await page.locator('#possibilities label:has(input[value="estate"])').tap();
  await expect(page.locator('#possibilities input[value="estate"]')).toBeChecked();
  await expect(page.locator(".fork-contact")).toHaveCount(0);
  await context.close();
});

test("high-contrast settings keep the system cursor", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, contrast: "more" });
  const page = await context.newPage();
  await page.goto("/");
  expect(await page.locator("main p").first().evaluate((el) => getComputedStyle(el).cursor)).toBe("auto");
  await context.close();
});
