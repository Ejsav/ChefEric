// Browser tests for the task manager, driven by Playwright. The static files
// are served by a throwaway local HTTP server; one smoke test also opens
// index.html straight from disk (file://), as a user might.
// Run: npm run test:tasks
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const APP_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_URL = pathToFileURL(join(APP_DIR, "index.html")).href;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
let APP_URL;
let server;
const KEY = "taskManager.tasks";
const launchOptions = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};

let browser;
before(async () => {
  server = createServer((req, res) => {
    const name = new URL(req.url, "http://x").pathname.replace(/^\/+/, "") || "index.html";
    const ext = name.slice(name.lastIndexOf("."));
    if (!["index.html", "styles.css", "tasks.js", "app.js"].includes(name)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": `${TYPES[ext]}; charset=utf-8` }).end(readFileSync(join(APP_DIR, name)));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  APP_URL = `http://127.0.0.1:${server.address().port}/index.html`;
  browser = await chromium.launch(launchOptions);
});
after(async () => {
  await browser?.close();
  await new Promise((resolve) => server?.close(resolve));
});

/** New isolated page that records JavaScript errors. */
async function openApp({ init, viewport, colorScheme = "light", url } = {}) {
  const context = await browser.newContext({ viewport: viewport || { width: 1280, height: 860 }, reducedMotion: "reduce", colorScheme });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(url || APP_URL);
  await page.waitForSelector("html[data-ready]");
  return { page, context, errors };
}

const titles = (page) => page.locator("#task-list .task__title").allTextContents();
const counts = async (page) => ({
  total: await page.textContent("#count-total"),
  active: await page.textContent("#count-active"),
  completed: await page.textContent("#count-completed"),
});
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);

async function add(page, title, priority = "medium") {
  await page.fill("#new-task-title", title);
  await page.selectOption("#new-task-priority", priority);
  await page.click("button:has-text('Add task')");
  // Let the double-submit guard window pass so tests can add quickly.
  await page.evaluate(() => new Promise((r) => setTimeout(r, 850)));
}

const row = (page, title) => page.locator("#task-list li", { has: page.locator(".task__title", { hasText: title }) });

test("full lifecycle keeps list, filters, counts and storage in step", async () => {
  const { page, context, errors } = await openApp();

  // Empty state
  assert.equal(await page.isVisible("#empty-state"), true);
  assert.match(await page.textContent("#empty-title"), /No tasks yet/);
  assert.deepEqual(await counts(page), { total: "0", active: "0", completed: "0" });

  await add(page, "Write proposal", "high");
  await add(page, "Book flights", "low");
  await add(page, "Reply to emails");
  assert.deepEqual(await titles(page), ["Reply to emails", "Book flights", "Write proposal"]);
  assert.deepEqual(await counts(page), { total: "3", active: "3", completed: "0" });
  assert.equal(await page.isVisible("#empty-state"), false);
  assert.equal(await page.inputValue("#new-task-title"), "", "field clears after add");
  assert.equal(await page.evaluate(() => document.activeElement.id), "new-task-title", "focus returns to the field");

  let data = await stored(page);
  assert.equal(data.version, 1);
  assert.equal(data.tasks.length, 3);
  const original = data.tasks.find((t) => t.title === "Write proposal");
  assert.equal(original.priority, "high");

  // Priority shown as text, not only colour
  assert.match(await row(page, "Write proposal").locator(".priority").innerText(), /High/);

  // Edit title and priority
  await row(page, "Write proposal").getByRole("button", { name: /^Edit/ }).click();
  const editTitle = page.locator('[data-role="edit-title"]');
  assert.equal(await editTitle.evaluate((n) => n === document.activeElement), true, "edit field is focused");
  await editTitle.fill("Write final proposal");
  await page.selectOption('[data-role="edit-priority"]', "medium");
  await page.click("button:has-text('Save')");
  assert.deepEqual(await titles(page), ["Reply to emails", "Book flights", "Write final proposal"]);
  data = await stored(page);
  const edited = data.tasks.find((t) => t.id === original.id);
  assert.equal(edited.title, "Write final proposal");
  assert.equal(edited.priority, "medium");
  assert.equal(edited.createdAt, original.createdAt, "edit keeps other fields");
  assert.equal(edited.completed, false);

  // Complete
  await row(page, "Book flights").locator('input[type="checkbox"]').check();
  assert.deepEqual(await counts(page), { total: "3", active: "2", completed: "1" });
  assert.equal(await row(page, "Book flights").evaluate((n) => n.classList.contains("task--completed")), true);
  assert.equal((await stored(page)).tasks.find((t) => t.title === "Book flights").completed, true);

  // Status filters
  await page.check('input[name="status"][value="active"]', { force: true });
  assert.deepEqual(await titles(page), ["Reply to emails", "Write final proposal"]);
  await page.check('input[name="status"][value="completed"]', { force: true });
  assert.deepEqual(await titles(page), ["Book flights"]);
  assert.match(await page.textContent("#showing"), /Showing 1 of 3/);

  // Restore from the Completed view: it leaves the view, counts update.
  // (click, not uncheck: the row correctly disappears, so there is nothing
  // left for uncheck() to verify.)
  await row(page, "Book flights").locator('input[type="checkbox"]').click();
  assert.deepEqual(await titles(page), []);
  assert.equal(await page.isVisible("#empty-state"), true);
  assert.match(await page.textContent("#empty-title"), /No completed tasks/);
  assert.deepEqual(await counts(page), { total: "3", active: "3", completed: "0" });

  // Priority filter combined with status
  await page.check('input[name="status"][value="all"]', { force: true });
  await page.selectOption("#priority-filter", "low");
  assert.deepEqual(await titles(page), ["Book flights"]);
  await page.selectOption("#priority-filter", "medium");
  assert.deepEqual(await titles(page), ["Reply to emails", "Write final proposal"]);

  // Adding a task does not reset the filters
  await add(page, "Urgent fix", "high");
  assert.equal(await page.inputValue("#priority-filter"), "medium");
  assert.match(await page.textContent("#new-task-hint"), /hidden by the current filters/);
  assert.deepEqual(await titles(page), ["Reply to emails", "Write final proposal"]);
  assert.deepEqual(await counts(page), { total: "4", active: "4", completed: "0" });
  await page.selectOption("#priority-filter", "all");

  // Delete, then undo, then delete for good
  await row(page, "Reply to emails").getByRole("button", { name: /^Delete/ }).click();
  assert.deepEqual(await titles(page), ["Urgent fix", "Book flights", "Write final proposal"]);
  assert.deepEqual(await counts(page), { total: "3", active: "3", completed: "0" });
  assert.equal((await stored(page)).tasks.length, 3);
  assert.equal(await page.isVisible("#undo-bar"), true);
  await page.click("#undo-button");
  assert.deepEqual(await titles(page), ["Urgent fix", "Reply to emails", "Book flights", "Write final proposal"], "undo restores the original position");
  assert.equal((await stored(page)).tasks.length, 4);
  await row(page, "Urgent fix").getByRole("button", { name: /^Delete/ }).click();
  assert.deepEqual(await titles(page), ["Reply to emails", "Book flights", "Write final proposal"]);

  // Reload: tasks, completion and filters survive
  await row(page, "Write final proposal").locator('input[type="checkbox"]').check();
  await page.check('input[name="status"][value="active"]', { force: true });
  await page.reload();
  await page.waitForSelector("html[data-ready]");
  assert.deepEqual(await titles(page), ["Reply to emails", "Book flights"]);
  assert.equal(await page.isChecked('input[name="status"][value="active"]'), true);
  assert.deepEqual(await counts(page), { total: "3", active: "2", completed: "1" });

  assert.deepEqual(errors, []);
  await context.close();
});

test("works when opened straight from disk (file://)", async () => {
  const { page, context, errors } = await openApp({ url: FILE_URL });
  await add(page, "From disk", "low");
  await page.reload();
  await page.waitForSelector("html[data-ready]");
  assert.deepEqual(await titles(page), ["From disk"]);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).fontFamily.length > 0 && !!document.styleSheets.length), true);
  assert.deepEqual(errors, []);
  await context.close();
});

test("rejects empty and whitespace-only titles with a visible, linked error", async () => {
  const { page, context, errors } = await openApp();
  for (const value of ["", "    "]) {
    await page.fill("#new-task-title", value);
    await page.click("button:has-text('Add task')");
    assert.equal(await page.isVisible("#new-task-error"), true);
    assert.match(await page.textContent("#new-task-error"), /Enter a task title/);
    assert.equal(await page.getAttribute("#new-task-title", "aria-invalid"), "true");
    assert.match(await page.getAttribute("#new-task-title", "aria-describedby"), /new-task-error/);
  }
  assert.equal(await page.locator("#task-list li").count(), 0);
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), KEY), null, "nothing saved");

  // Typing clears the error
  await page.fill("#new-task-title", "Real task");
  assert.equal(await page.isVisible("#new-task-error"), false);
  await page.press("#new-task-title", "Enter");
  assert.deepEqual(await titles(page), ["Real task"]);

  // Editing to blank is refused and the original is kept
  await page.waitForTimeout(850);
  await row(page, "Real task").getByRole("button", { name: /^Edit/ }).click();
  await page.fill('[data-role="edit-title"]', "   ");
  await page.click("button:has-text('Save')");
  assert.match(await page.textContent('[data-role="edit-error"]'), /Enter a task title/);
  assert.equal((await stored(page)).tasks[0].title, "Real task");
  await page.press('[data-role="edit-title"]', "Escape");
  assert.deepEqual(await titles(page), ["Real task"]);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.role), "edit", "focus returns to Edit");

  assert.deepEqual(errors, []);
  await context.close();
});

test("renders user text as text, never as HTML", async () => {
  const { page, context, errors } = await openApp();
  const nasty = `<img src=x onerror="window.__xss=1"><script>window.__xss=2</script> & "quotes" 'single' 🍝 العربية`;
  await add(page, nasty, "high");
  assert.deepEqual(await titles(page), [nasty]);
  assert.equal(await page.locator("#task-list img, #task-list script").count(), 0);
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  // Long unbroken text wraps instead of overflowing
  await add(page, "x".repeat(200));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(overflow, false);
  await page.reload();
  await page.waitForSelector("html[data-ready]");
  assert.equal((await titles(page))[1], nasty);
  assert.deepEqual(errors, []);
  await context.close();
});

test("repeated submissions do not create duplicates", async () => {
  const { page, context, errors } = await openApp();
  await page.fill("#new-task-title", "Only once");
  await page.dblclick("button:has-text('Add task')");
  assert.equal(await page.locator("#task-list li").count(), 1);
  assert.equal(await page.isVisible("#new-task-error"), false, "no spurious error from the second click");

  await page.fill("#new-task-title", "Enter twice");
  await page.press("#new-task-title", "Enter");
  await page.press("#new-task-title", "Enter");
  assert.equal(await page.locator("#task-list li").count(), 2);
  assert.equal((await stored(page)).tasks.length, 2);

  // Deliberately adding the same title later is allowed
  await page.waitForTimeout(850);
  await add(page, "Only once");
  assert.equal(await page.locator("#task-list li").count(), 3);
  const ids = (await stored(page)).tasks.map((t) => t.id);
  assert.equal(new Set(ids).size, 3, "ids are unique");
  assert.deepEqual(errors, []);
  await context.close();
});

test("recovers from corrupted saved data and keeps a copy", async () => {
  const { page, context, errors } = await openApp({
    init: () => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("taskManager.tasks", "{definitely not json");
        localStorage.setItem("taskManager.view", "also broken");
        sessionStorage.setItem("seeded", "1");
      }
    },
  });
  assert.equal(await page.isVisible("#load-notice"), true);
  assert.match(await page.textContent("#load-notice"), /couldn't be read/);
  assert.equal(await page.locator("#task-list li").count(), 0);
  assert.equal(await page.evaluate(() => localStorage.getItem("taskManager.tasks.unreadable")), "{definitely not json");
  assert.equal(await page.isChecked('input[name="status"][value="all"]'), true);
  await add(page, "Fresh start");
  assert.equal((await stored(page)).tasks.length, 1);
  await page.click("#load-notice-dismiss");
  assert.equal(await page.isVisible("#load-notice"), false);
  assert.deepEqual(errors, []);
  await context.close();
});

test("repairs partly invalid saved data", async () => {
  const { page, context, errors } = await openApp({
    init: () => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem(
          "taskManager.tasks",
          JSON.stringify({ version: 1, tasks: [{ id: "a", title: "Good", priority: "low", completed: true }, { id: "a", title: "Same id" }, { title: "" }, 5] }),
        );
        sessionStorage.setItem("seeded", "1");
      }
    },
  });
  assert.deepEqual(await titles(page), ["Good", "Same id"]);
  assert.match(await page.textContent("#load-notice"), /2 saved tasks were unreadable/);
  assert.deepEqual(await counts(page), { total: "2", active: "1", completed: "1" });
  const ids = (await stored(page)).tasks.map((t) => t.id);
  assert.equal(new Set(ids).size, 2, "duplicate id replaced and saved");
  // Each row still works: the repaired duplicate can be completed on its own
  await row(page, "Same id").locator('input[type="checkbox"]').check();
  assert.deepEqual(await counts(page), { total: "2", active: "0", completed: "2" });
  assert.deepEqual(errors, []);
  await context.close();
});

test("keeps working and warns when saving fails", async () => {
  const { page, context, errors } = await openApp({
    init: () => {
      Storage.prototype.setItem = function () {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      };
    },
  });
  await add(page, "Unsaved task", "high");
  assert.deepEqual(await titles(page), ["Unsaved task"]);
  assert.equal(await page.isVisible("#storage-alert"), true);
  assert.match(await page.textContent("#storage-alert"), /may be lost/);
  assert.equal(await page.getAttribute("#storage-alert", "role"), "alert");
  await row(page, "Unsaved task").locator('input[type="checkbox"]').check();
  assert.deepEqual(await counts(page), { total: "1", active: "0", completed: "1" });
  assert.deepEqual(errors, []);
  await context.close();
});

test("keeps working and warns when storage is blocked entirely", async () => {
  const { page, context, errors } = await openApp({
    init: () => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Access denied", "SecurityError");
        },
      });
    },
  });
  assert.equal(await page.isVisible("#storage-alert"), true, "warned on load");
  assert.match(await page.textContent("#storage-alert"), /isn't letting the page save/);
  await add(page, "Session only");
  await page.check('input[name="status"][value="active"]', { force: true });
  assert.deepEqual(await titles(page), ["Session only"]);
  await row(page, "Session only").getByRole("button", { name: /^Delete/ }).click();
  assert.equal(await page.locator("#task-list li").count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});

test("two open tabs stay in step instead of overwriting each other", async () => {
  const { page: first, context, errors } = await openApp();
  const second = await context.newPage();
  second.on("pageerror", (err) => errors.push(err.message));
  await second.goto(APP_URL);
  await second.waitForSelector("html[data-ready]");
  await add(first, "Added in tab one", "high");
  await second.waitForFunction(() => document.querySelectorAll("#task-list li").length === 1);
  assert.deepEqual(await titles(second), ["Added in tab one"]);
  await add(second, "Added in tab two", "low");
  await first.waitForFunction(() => document.querySelectorAll("#task-list li").length === 2);
  assert.deepEqual(await titles(first), ["Added in tab two", "Added in tab one"]);
  assert.equal(await first.textContent("#count-total"), "2");
  assert.equal((await stored(first)).tasks.length, 2);
  assert.deepEqual(errors, []);
  await context.close();
});

test("tasks survive a full browser restart", async () => {
  const profile = mkdtempSync(join(tmpdir(), "tasks-profile-"));
  try {
    let context = await chromium.launchPersistentContext(profile, launchOptions);
    let page = await context.newPage();
    await page.goto(APP_URL);
    await page.waitForSelector("html[data-ready]");
    await add(page, "Survives restart", "high");
    await row(page, "Survives restart").locator('input[type="checkbox"]').check();
    await context.close();

    context = await chromium.launchPersistentContext(profile, launchOptions);
    page = await context.newPage();
    await page.goto(APP_URL);
    await page.waitForSelector("html[data-ready]");
    assert.deepEqual(await titles(page), ["Survives restart"]);
    assert.equal(await row(page, "Survives restart").locator('input[type="checkbox"]').isChecked(), true);
    assert.match(await row(page, "Survives restart").locator(".priority").innerText(), /High/);
    await context.close();
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
});

test("is fully operable from the keyboard", async () => {
  const { page, context, errors } = await openApp();
  await page.keyboard.press("Tab"); // skip link
  assert.equal(await page.evaluate(() => document.activeElement.className), "skip-link");
  await page.focus("#new-task-title");
  await page.keyboard.type("Keyboard task");
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown"); // Medium -> High on most platforms; set explicitly below
  await page.selectOption("#new-task-priority", "high");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Add task");
  await page.keyboard.press("Enter");
  assert.deepEqual(await titles(page), ["Keyboard task"]);

  // Toggle with Space
  await page.focus('#task-list input[type="checkbox"]');
  await page.keyboard.press("Space");
  assert.deepEqual(await counts(page), { total: "1", active: "0", completed: "1" });
  assert.equal(await page.evaluate(() => document.activeElement.dataset.role), "toggle", "focus stays on the checkbox");

  // Tab to Edit, Enter, change, Enter to save
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.dataset.role), "edit");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Renamed by keyboard");
  await page.keyboard.press("Enter");
  assert.deepEqual(await titles(page), ["Renamed by keyboard"]);
  assert.equal((await stored(page)).tasks[0].completed, true, "edit keeps completion");

  // Status filter radios respond to arrow keys
  await page.focus('input[name="status"][value="all"]');
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.isChecked('input[name="status"][value="active"]'), true);
  assert.equal(await page.isVisible("#empty-state"), true);

  // Focus indicator is visible on keyboard focus
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement.nextElementSibling).outlineStyle);
  assert.equal(outline, "solid");

  // Delete moves focus somewhere sensible
  await page.check('input[name="status"][value="all"]', { force: true });
  await page.focus('[data-role="delete"]');
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.id), "task-list-heading");
  assert.deepEqual(errors, []);
  await context.close();
});

test("passes an automated accessibility scan (desktop, phone, dark mode)", async () => {
  for (const [viewport, colorScheme] of [
    [{ width: 1280, height: 860 }, "light"],
    [{ width: 320, height: 640 }, "light"],
    [{ width: 390, height: 844 }, "dark"],
  ]) {
    const { page, context, errors } = await openApp({ viewport, colorScheme });
    await add(page, "Accessible task", "high");
    await add(page, "Finished task", "low");
    await row(page, "Finished task").locator('input[type="checkbox"]').check();
    let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    assert.deepEqual(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`), [], `violations at ${viewport.width}px`);

    // Edit mode and error state
    await row(page, "Accessible task").getByRole("button", { name: /^Edit/ }).click();
    await page.fill('[data-role="edit-title"]', "");
    await page.click("button:has-text('Save')");
    results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    assert.deepEqual(results.violations.map((v) => v.id), [], `edit-mode violations at ${viewport.width}px`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(overflow, false, `no horizontal scroll at ${viewport.width}px`);
    assert.deepEqual(errors, []);
    await context.close();
  }
});
