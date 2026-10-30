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
 * the partner request form, the resource type filter, and both navigation
 * menus. Collects console errors throughout.
 */
import { chromium } from "playwright";
const base = process.env.BASE_URL || "http://localhost:3000";
const paths = [
  "/", "/about", "/learn", "/learn/social-media-marketing-ai-programme", "/learn/courses",
  "/apply", "/connect", "/connect/mentors", "/events", "/insights", "/grow",
  "/grow?type=Template", "/grow?type=Guide", "/partner",
  "/contact", "/privacy", "/terms",
  "/login", "/signup", "/this-page-does-not-exist",
];
const redirects = [
  ["/programs", "/learn"],
  ["/academy", "/learn"],
  ["/resources", "/grow"],
  ["/community", "/connect"],
  ["/employers", "/partner"],
  ["/employers/post-a-job", "/connect"],
  ["/employers/request-intern", "/connect"],
  ["/experience", "/learn"],
  ["/simulations", "/learn"],
  ["/careers", "/connect"],
  ["/careers/jobs", "/connect"],
  ["/careers/internships", "/connect"],
  ["/mentorship", "/connect/mentors"],
  ["/mentorship/become-a-mentor", "/connect/mentors"],
  ["/stories", "/connect"],
  ["/learn/cohort", "/learn/social-media-marketing-ai-programme"],
  ["/grow/templates", "/grow?type=Template"],
  ["/grow/guides", "/grow?type=Guide"],
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
  check(`${from} -> ${expected}`, res?.status() === 200 && url.startsWith(expected.split("?")[0].split("#")[0]), url);
}

console.log("\n== INTERACTIONS ==");
await page.setViewportSize({ width: 1440, height: 900 });
// partner form defaults to training (hire/job/intern public entry points are retired)
await page.goto(`${base}/partner`, { waitUntil: "networkidle" });
check("partner form shows training", (await page.locator('h3:has-text("Train a team")').count()) > 0);
check("partner has no hire talent CTA", (await page.getByRole("link", { name: /hire tsa talent/i }).count()) === 0);

// Grow library filter
await page.goto(`${base}/grow`, { waitUntil: "networkidle" });
const navLinks = await page.locator('nav[aria-label="Resource types"] a').count();
check("resource type filter renders", navLinks > 0, `${navLinks} types`);

// header nav labels (Learn / Grow / Connect IA)
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const primary = page.getByRole("navigation", { name: "Primary" });
check("header shows Learn", await primary.getByRole("link", { name: "Learn", exact: true }).isVisible());
check("header shows Grow", await primary.getByRole("link", { name: "Grow", exact: true }).isVisible());
check("header shows Partner With Us", await primary.getByRole("link", { name: "Partner With Us" }).isVisible());
await page.getByRole("button", { name: "Connect" }).first().click();
await page.waitForTimeout(300);
check("Connect dropdown lists Mentors", await page.getByRole("menuitem", { name: "Mentors" }).isVisible());

// mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open menu" }).click();
await page.waitForTimeout(400);
check("mobile menu opens", await page.getByRole("link", { name: "Partner With Us" }).first().isVisible());
check("mobile menu lists Mentors", await page.getByRole("link", { name: "Mentors" }).first().isVisible());

console.log(`\n${results.filter(Boolean).length}/${results.length} checks passed`);
console.log(`console errors: ${errors.length}`);
for (const e of [...new Set(errors)].slice(0, 10)) console.log("   " + e);
await browser.close();
process.exit(results.every(Boolean) && errors.length === 0 ? 0 : 1);
