import { expect, test } from "@playwright/test";

const banned = /\bSMN\b|Social Marketers|\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|\bjobs?\b/i;

test.describe("Resources", () => {
  test("renders the document hero, categories, and subscribe module", async ({ page }) => {
    await page.goto("/resources");
    await expect(
      page.getByRole("heading", { level: 1, name: "Knowledge to help you think smarter and market better." }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Explore the knowledge hub." })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Perspectives on a changing marketing landscape." }),
    ).toBeVisible();
    await expect(page.getByText("Social Media Strategy")).toBeVisible();
    await expect(page.getByText("Content Marketing & Planning")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resources you can put to work." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stay curious. Stay connected. Keep growing." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Join the TSA community" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy policy" }).first()).toHaveAttribute("href", "/privacy");
  });

  test("old Grow and Insights URLs redirect once", async ({ request }) => {
    for (const [from, to] of [
      ["/grow", "/resources"],
      ["/insights", "/resources"],
    ] as const) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers().location ?? "").toContain(to);
    }
  });

  test("has no em dash, SMN, hire, intern or job copy", async ({ page }) => {
    await page.goto("/resources");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\u2014/);
    expect(text).not.toMatch(banned);
  });
});
