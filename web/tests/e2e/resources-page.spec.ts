import { expect, test } from "@playwright/test";

const banned = /\bSMN\b|Social Marketers|\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|\bjobs?\b/i;

test.describe("Resources and Insights (T9)", () => {
  test("Resources renders the Tab 4 hero, categories and access split", async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByRole("heading", { level: 1, name: "Keep learning." })).toBeVisible();
    const categories = page.locator("#categories");
    for (const name of ["Articles", "Guides", "Templates", "Tools", "Case Studies", "Webinars & Insights"]) {
      await expect(categories.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Public resources" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Member resources" })).toBeVisible();
  });

  test("Resources category and access links go to the right routes", async ({ page }) => {
    await page.goto("/resources");
    const categories = page.locator("#categories");
    const expected: Array<[string, string]> = [
      ["Articles", "/insights"],
      ["Guides", "/resources?type=Guide"],
      ["Templates", "/resources?type=Template"],
      ["Tools", "/resources?type=Toolkit"],
      ["Case Studies", "/insights?category=Case%20Studies"],
      ["Webinars & Insights", "/events"],
    ];
    for (const [title, href] of expected) {
      await expect(categories.getByRole("link", { name: new RegExp(`^${title}`) })).toHaveAttribute("href", href);
    }
    const access = page.locator("#access");
    await expect(access.getByRole("link", { name: "Join TSA", exact: true })).toHaveAttribute("href", "/signup");
    await expect(access.getByRole("link", { name: "Member sign in", exact: true })).toHaveAttribute("href", "/login");
    await expect(access.getByRole("link", { name: "Browse the library", exact: true })).toHaveAttribute("href", "#library");
  });

  test("filtered Resources views keep the library and hide the category grid", async ({ page }) => {
    await page.goto("/resources?type=Template");
    await expect(page.locator("#library")).toBeVisible();
    await expect(page.locator("#categories")).toHaveCount(0);
  });

  test("Insights uses TSA copy and links", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("heading", { level: 1, name: "Ideas for thinking beyond posting." })).toBeVisible();
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Explore the Academy", exact: true })).toHaveAttribute("href", "/academy");
    await expect(main.getByRole("link", { name: "Join the Community", exact: true })).toHaveAttribute("href", "/signup");
  });

  test("Resources and Insights have no em dash, SMN, hire, intern or job copy", async ({ page }) => {
    for (const path of ["/resources", "/insights"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text, path).not.toMatch(/\u2014/);
      expect(text, path).not.toMatch(banned);
    }
  });
});
