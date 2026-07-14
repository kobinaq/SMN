import { expect, test } from "@playwright/test";

test.describe("marketing navigation and CTAs", () => {
  test("header primary CTA goes to apply", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    const apply = page.getByRole("link", { name: /^Apply now$/i }).first();
    await expect(apply).toHaveAttribute("href", "/apply");
    await expect(page.getByRole("link", { name: /member sign in/i }).first()).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("footer includes legal and programme links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: /Flagship cohort/i }),
    ).toBeVisible();
  });

  test("does not display withheld placeholder prices", async ({ page }) => {
    await page.goto("/programs/cohort");
    await expect(page.getByText(/250,?000/)).toHaveCount(0);
    await expect(page.getByText(/Contact SMN for current fees/i).first()).toBeVisible();
  });

  test("application page explains next steps before payment", async ({ page }) => {
    await page.goto("/apply");
    await expect(page.getByRole("heading", { name: /apply to the/i })).toBeVisible();
    await expect(page.getByText(/What happens next/i)).toBeVisible();
    await expect(page.getByText(/after acceptance/i).first()).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /submit application/i })).toBeVisible();
  });

  test("employer page keeps hire CTAs separate from apply", async ({ page }) => {
    await page.goto("/employers");
    await expect(page.getByRole("heading", { name: /hire smn talent/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /hire smn talent/i }).first()).toBeVisible();
    await expect(page.getByText(/not a member application/i)).toBeVisible();
  });

  test("stories page does not render fictional seed names", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.getByText("Ada Okonkwo")).toHaveCount(0);
    await expect(page.getByText("Kwame Mensah")).toHaveCount(0);
    await expect(page.getByText("Efua Demo")).toHaveCount(0);
  });

  test("seo routes respond", async ({ page, request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const body = await robots.text();
    expect(body).toContain("sitemap");
    await page.goto("/");
    await expect(page.locator('script[type="application/ld+json"]').first()).toHaveCount(1);
  });
});
