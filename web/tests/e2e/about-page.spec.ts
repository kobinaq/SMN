import { expect, test } from "@playwright/test";

test.describe("About page (T10)", () => {
  test("renders the Tab 4 sections", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "We believe people should learn how to think, not just what to post.",
      }),
    ).toBeVisible();
    for (const name of [
      "Closing the gap between knowing and doing.",
      "Thoughtful learning. Practical application.",
      "Arielle Adodo",
      "Two arms, one way of thinking.",
    ]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText("Our mission", { exact: true })).toBeVisible();
    await expect(page.getByText("Our vision", { exact: true })).toBeVisible();
    for (const stage of ["Learn", "Apply", "Grow", "Connect"]) {
      await expect(page.locator("#philosophy").getByRole("heading", { name: stage, exact: true })).toBeVisible();
    }
    await expect(page.getByText("Founder, Think Social Academy")).toBeVisible();
  });

  test("CTAs go to Learn, Connect and the Agency section", async ({ page }) => {
    await page.goto("/about");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Explore our programmes" }).first()).toHaveAttribute("href", "/learn");
    await expect(main.getByRole("link", { name: "Join the community" }).first()).toHaveAttribute("href", "/connect");
    await expect(main.getByRole("link", { name: /About the agency/ })).toHaveAttribute("href", "/partner#agency");
  });

  test("has no em dash, SMN, hire, intern or job copy", async ({ page }) => {
    await page.goto("/about");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\u2014/);
    expect(text).not.toMatch(/\bSMN\b|Social Marketers/i);
    expect(text).not.toMatch(/\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|\bjobs?\b/i);
  });
});
