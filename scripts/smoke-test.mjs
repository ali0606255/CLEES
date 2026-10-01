// End-to-end smoke test: calculator → prefilled form → submit → WhatsApp CTA, language switch,
// stays filter, validation errors and horizontal overflow at 360px.
// Usage: BASE_URL=http://localhost:3000 node scripts/smoke-test.mjs
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const results = [];
const check = (name, ok, extra = "") => {
  results.push(ok);
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? ` — ${extra}` : ""}`);
};

// 1. Root redirects to Arabic
await page.goto(base + "/");
check("/ redirects to /ar", page.url().endsWith("/ar"));
check("Arabic is RTL", (await page.getAttribute("html", "dir")) === "rtl");

// 2. Calculator changes the estimate
const est = page.locator("#calculator [aria-live] p.text-2xl").first();
const before = await est.innerText();
await page.locator("#calculator label", { hasText: "فاخر" }).click();
await page.locator("#calculator select").selectOption("alsoudah");
await page.waitForTimeout(400);
const after = await est.innerText();
check("Calculator updates estimate", before !== after, `${before} → ${after}`);

// 3. Calculator CTA pre-fills the evaluation form
await page.locator("#calculator a", { hasText: "احصل على تقييم" }).click();
await page.waitForURL(/\/ar\/owners/);
await page.waitForSelector("#evaluate form");
await page.waitForTimeout(500);
const hood = await page.locator('#evaluate select[name="neighborhood"]').inputValue();
const beds = await page.locator('#evaluate select[name="bedrooms"]').inputValue();
const furnished = await page.locator('#evaluate input[name="furnished"]:checked').inputValue().catch(() => "");
check("Form prefilled from calculator", hood === "alsoudah" && beds === "2" && furnished === "yes", `${hood}/${beds}/${furnished}`);

// 4. Validation errors
await page.locator("#evaluate button[type=submit]").click();
await page.waitForTimeout(300);
const errCount = await page.locator("#evaluate [role=alert]").count();
check("Validation errors shown on empty submit", errCount >= 3, `${errCount} errors`);
await page.fill('#evaluate input[name="phone"]', "12345");
await page.locator("#evaluate button[type=submit]").click();
await page.waitForTimeout(200);
check("Invalid phone rejected", (await page.locator("#evaluate").innerText()).includes("05xxxxxxxx"));

// 5. Successful submission (Arabic digits + spaces are normalized)
await page.fill('#evaluate input[name="name"]', "تجربة");
await page.fill('#evaluate input[name="phone"]', "٠٥٥ ١٢٣ ٤٥٦٧");
await page.selectOption('#evaluate select[name="service"]', "management");
await page.locator("#evaluate button[type=submit]").click();
await page.waitForSelector("#evaluate [role=status]", { timeout: 10000 });
const wa = await page.locator('#evaluate a[href*="wa.me"]').getAttribute("href");
const waText = decodeURIComponent(wa.split("text=")[1] ?? "");
check("Success message + WhatsApp CTA", waText.includes("تجربة") && waText.includes("السودة") && waText.includes("0551234567"));

// 6. Language switch keeps the page
await page.goto(base + "/ar/services");
await page.locator("button[aria-controls=mobile-menu]").click();
await page.locator("#mobile-menu a[hreflang=en]").click();
await page.waitForURL(/\/en\/services/);
check("Language switch → /en/services, LTR", (await page.getAttribute("html", "dir")) === "ltr");

// 7. Stays filter
await page.goto(base + "/en/stays");
const all = await page.locator("main ul li article").count();
await page.locator("button", { hasText: /^1 bedroom$/ }).click();
await page.waitForTimeout(500);
const one = await page.locator("main ul li article").count();
check("Stays filter narrows results", one > 0 && one < all, `${all} → ${one}`);

// 8. Honeypot: bots get a silent OK
const hp = await page.evaluate(async () =>
  (await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contact", company_website: "spam" }) })).status,
);
check("Honeypot returns silent 200", hp === 200);

// 9. No horizontal overflow at 360px
await page.setViewportSize({ width: 360, height: 780 });
for (const l of ["ar", "en"]) {
  for (const p of ["", "/owners", "/services", "/stays", "/about", "/contact", "/privacy", "/terms"]) {
    await page.goto(`${base}/${l}${p}`);
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 0) check(`No overflow at 360px /${l}${p}`, false, `${o}px`);
  }
}
check("No horizontal overflow at 360px on any page", true);

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
