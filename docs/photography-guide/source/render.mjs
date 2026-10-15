import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const dir = new URL("./site/", import.meta.url).pathname;
const b = await chromium.launch();
for (const [name, vp, scheme] of [["desk", { width: 1280, height: 900 }, "light"], ["phone", { width: 390, height: 844 }, "light"], ["dark", { width: 1280, height: 900 }, "dark"]]) {
  const p = await b.newPage({ viewport: vp, colorScheme: scheme });
  await p.goto("file://" + dir + "print.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(name, "overflow:", ov);
  await p.screenshot({ path: `../check-${name}-top.png` });
  await p.evaluate(() => document.getElementById("p09").scrollIntoView());
  await p.waitForTimeout(300);
  await p.screenshot({ path: `../check-${name}-card.png` });
  await p.close();
}
const p = await b.newPage();
await p.goto("file://" + dir + "print.html", { waitUntil: "networkidle" });
await p.emulateMedia({ media: "print" });
await p.pdf({ path: "../Ray-Gennaro-Photography-Guide.pdf", format: "Letter", printBackground: true, margin: { top: "0.5in", bottom: "0.55in", left: "0.5in", right: "0.5in" }, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#777;font-family:Helvetica">Chef Ray Gennaro · Website photography guide · <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
await b.close();
