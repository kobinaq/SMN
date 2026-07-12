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

test("staff lands on the workflow-first admin dashboard", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill("staff.demo@smn.example");
  await page.locator('input[name="password"]').fill("DemoStaff123!");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/admin\/?$/);
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What needs action" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Network health" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meaningful changes" })).toBeVisible();
  await expect(page.getByRole("link", { name: /create course/i })).toBeVisible();
  await expect(page.getByText("Total members", { exact: true })).toBeVisible();

  await page.goto("/admin/course-builder");
  await expect(page.getByRole("heading", { name: "Course Builder" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Course Builder sections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Curriculum" })).toBeVisible();
  await expect(page.getByRole("link", { name: "AI Content Studio" })).toBeVisible();
  await page.getByRole("link", { name: "Curriculum" }).click();
  await expect(page.getByRole("heading", { name: "Modules and lessons" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Move module up" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Duplicate" }).first()).toBeVisible();
  await page.getByRole("link", { name: "Learners" }).click();
  await expect(page.getByRole("heading", { name: "Reasoned progress override" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save audited override" })).toBeVisible();
});
