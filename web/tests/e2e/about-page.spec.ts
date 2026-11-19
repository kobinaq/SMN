import { expect, test } from "@playwright/test";

test.describe("About page", () => {
  test("renders the document sections", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Building stronger social media marketing capabilities.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Founded by someone who learned this through practice." }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "What guides our approach" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Supporting people and teams at different stages." }),
    ).toBeVisible();
    await expect(page.getByText("Founder, Think Social Academy")).toBeVisible();
    await expect(page.getByText("social media strategist")).toBeVisible();
  });

  test("CTA goes to programs", async ({ page }) => {
    await page.goto("/about");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Explore our programmes" }).first()).toHaveAttribute(
      "href",
      "/programs",
    );
  });

  test("has no em dash, SMN, hire, intern or job copy", async ({ page }) => {
    await page.goto("/about");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\u2014/);
    expect(text).not.toMatch(/\bSMN\b|Social Marketers/i);
    expect(text).not.toMatch(/\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|\bjobs?\b/i);
  });
});
