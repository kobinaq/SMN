import { expect, test } from "@playwright/test";

test.describe("Partnerships page", () => {
  test("old /partner URL lands on the partnerships page", async ({ page }) => {
    await page.goto("/partner");
    await expect(page).toHaveURL(/\/partnerships$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Building opportunities through collaboration." }),
    ).toBeVisible();
  });

  test("has no public hire or job CTAs", async ({ page }) => {
    await page.goto("/partnerships");
    await expect(page.getByRole("link", { name: /hire tsa talent/i })).toHaveCount(0);
    await expect(page.getByRole("tab", { name: /request an intern|hire talent|post a job/i })).toHaveCount(0);
  });

  test("has no em dash or SMN name", async ({ page }) => {
    await page.goto("/partnerships");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\u2014/);
    expect(text).not.toMatch(/\bSMN\b|Social Marketers/i);
  });
});
