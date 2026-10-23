import { defineConfig, devices } from "@playwright/test";

// End-to-end checks against the production build. Run `npm run build`
// first; the server starts automatically. Reduced motion keeps runs
// deterministic (no smooth scroll, no entrance timing).
// Six shapes: desktop runs everything; a modern phone runs the pages, the
// accessibility scan and the website form; the smallest phone (320px), a
// tablet in landscape, a phone in landscape and a desktop window zoomed to
// 200% (1440×900 seen as 720×450) check every page for layout faults.
const PORT = 3200;
export const INVITE_SECRET = "e2e-invite-secret";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, contextOptions: { reducedMotion: "reduce" }, trace: "retain-on-failure" },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { INVITE_SECRET },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] }, testMatch: /(pages|sales)\.spec/ },
    { name: "small-phone", use: { ...devices["Pixel 7"], viewport: { width: 320, height: 640 } }, testMatch: /pages\.spec/, grep: /renders cleanly/ },
    { name: "tablet-landscape", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 }, hasTouch: true }, testMatch: /pages\.spec/, grep: /renders cleanly/ },
    { name: "phone-landscape", use: { ...devices["Pixel 7 landscape"] }, testMatch: /pages\.spec/, grep: /renders cleanly/ },
    { name: "zoom-200", use: { ...devices["Desktop Chrome"], viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 }, testMatch: /pages\.spec/, grep: /renders cleanly/ },
  ],
});
