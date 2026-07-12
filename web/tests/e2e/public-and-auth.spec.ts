import { expect, test } from "@playwright/test";

test("public home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /member/i })).toBeVisible();
  await expect(page.getByText(/Social Marketers Network/i).first()).toBeVisible();
});

test("member login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toBeVisible();
});

test("protected portal redirects anonymous users to login", async ({ page }) => {
  await page.goto("/app/profile");
  await expect(page).toHaveURL(/\/login/);
});
