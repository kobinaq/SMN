/**
 * End-to-end verification of the public marketing site against a running dev
 * server.
 *
 *   npm run seed:demo && npm run dev      # terminal 1
 *   npm run verify:site                   # terminal 2
 *
 * Walks every public page at desktop and mobile widths (status, a single
 * <html>, no horizontal overflow, a real <h1>), checks that every retired URL
 * from the consolidation still resolves, and drives the interactive pieces:
 * the partner request switcher, the resource type filter, the jobs-board type
 * preselect, and both navigation menus. Collects console errors throughout.
 */
import { chromium } from "playwright";
const base = process.env.BASE_URL || "http://localhost:3000";
const paths = [
  "/", "/about", "/programs", "/programs/cohort", "/programs/courses", "/experience",
  "/apply", "/careers", "/careers/jobs", "/careers/jobs?type=Internship",
  "/community", "/events", "/insights", "/resources", "/resources?type=Template",
  "/resources?type=Guide", "/stories", "/mentorship", "/employers",
  "/employers?request=intern", "/employers?request=job", "/contact", "/privacy", "/terms",
  "/login", "/signup", "/this-page-does-not-exist",
];
const redirects = [
  ["/simulations", "/experience"],
  ["/resources/templates", "/resources?type=Template"],
  ["/resources/guides", "/resources?type=Guide"],
  ["/careers/internships", "/careers/jobs?type=Internship"],
  ["/employers/post-a-job", "/employers?request=job"],
  ["/employers/request-intern", "/employers?request=intern"],
  ["/mentorship/become-a-mentor", "/mentorship"],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = [];
const errors = [];
const check = (label, ok, extra = "") => {
  results.push(ok);
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);
};

for (const [width, tag] of [[1440, "desktop"], [390, "mobile"]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("console", (m) => {
    // The 404 route legitimately answers 404; that network log is not a defect.
    if (m.type() === "error" && !m.text().includes("status of 404")) {
      errors.push(`[${tag}] ${m.text().slice(0, 160)}`);
    }
  });
  page.on("pageerror", (e) => errors.push(`[${tag}] ${String(e).slice(0, 160)}`));
  console.log(`\n== ${tag.toUpperCase()} (${width}px) ==`);
  for (const path of paths) {
    const res = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60000 }).catch(() => null);
    const status = res?.status() ?? 0;
    const expect404 = path.includes("does-not-exist");
    const htmlCount = await page.locator("html").count();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const heading = await page.locator("h1").first().textContent().catch(() => null);
    // A 404 page correctly answers 404; everything else must answer 200.
    check(`${path}`, status === (expect404 ? 404 : 200) && htmlCount === 1 && overflow <= 1 && Boolean(heading?.trim()),
      `${status} · h1:${(heading || "").trim().slice(0, 34) || "—"} · overflow:${overflow}`);
  }
  await page.close();
}

console.log("\n== REDIRECTS ==");
const page = await browser.newPage();
for (const [from, expected] of redirects) {
  const res = await page.goto(`${base}${from}`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => null);
  const url = page.url().replace(base, "");
  check(`${from} -> ${expected}`, res?.status() === 200 && url.startsWith(expected.split("?")[0]), url);
}

console.log("\n== INTERACTIONS ==");
await page.setViewportSize({ width: 1440, height: 900 });
// employers request switcher
await page.goto(`${base}/employers?request=job`, { waitUntil: "networkidle" });
check("employers opens on the requested form", (await page.locator('h3:has-text("Post a job")').count()) > 0);
await page.getByRole("tab", { name: "Request an intern" }).click();
await page.waitForTimeout(400);
check("switching request type swaps the form", (await page.locator('h3:has-text("Request an intern")').count()) > 0);
const selected = await page.locator("select").first().inputValue().catch(() => "");
check("form default type follows the switch", selected === "Intern request", selected);

// resources filter
await page.goto(`${base}/resources`, { waitUntil: "networkidle" });
const navLinks = await page.locator('nav[aria-label="Resource types"] a').count();
check("resource type filter renders", navLinks > 0, `${navLinks} types`);

// jobs board type preselect
await page.goto(`${base}/careers/jobs?type=Internship`, { waitUntil: "networkidle" });
check("jobs masthead reflects the internship filter",
  ((await page.locator("h1").first().textContent()) || "").includes("Internships"));

// header dropdown
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Academy" }).first().click();
await page.waitForTimeout(300);
check("header dropdown opens", await page.getByRole("menuitem", { name: "Training cohort" }).isVisible());

// mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open menu" }).click();
await page.waitForTimeout(400);
check("mobile menu opens", await page.getByRole("link", { name: "Partners" }).first().isVisible());

console.log(`\n${results.filter(Boolean).length}/${results.length} checks passed`);
console.log(`console errors: ${errors.length}`);
for (const e of [...new Set(errors)].slice(0, 10)) console.log("   " + e);
await browser.close();
process.exit(results.every(Boolean) && errors.length === 0 ? 0 : 1);
