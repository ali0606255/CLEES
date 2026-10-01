// Takes full-page screenshots of key pages (ar/en, mobile/desktop).
// Usage: BASE_URL=http://localhost:3000 node scripts/screenshots.mjs [outDir]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "screenshots";
const pages = (process.env.PAGES ?? "/,/owners").split(",");
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const locale of ["ar", "en"]) {
    for (const p of pages) {
      const url = `${base}/${locale}${p === "/" ? "" : p}`;
      await page.goto(url, { waitUntil: "networkidle" });
      // scroll to trigger in-view content, then back to top
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const name = `${out}/${locale}-${p === "/" ? "home" : p.slice(1).replaceAll("/", "-")}-${vp.name}.png`;
      await page.screenshot({ path: name, fullPage: true });
      console.log(`${name}${overflow > 0 ? `  ⚠️ horizontal overflow ${overflow}px` : ""}`);
    }
  }
  await ctx.close();
}
await browser.close();
