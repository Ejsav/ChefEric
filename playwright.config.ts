import { defineConfig, devices } from "@playwright/test";

// End-to-end checks against the production build. Run `npm run build`
// first; the server starts automatically. Reduced motion keeps runs
// deterministic (no smooth scroll, no entrance timing).
// Four widths: desktop runs everything; a modern phone runs the pages, the
// accessibility scan and the website form; the smallest phone (320px) and a
// tablet in landscape check every page for layout faults.
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
  ],
});
