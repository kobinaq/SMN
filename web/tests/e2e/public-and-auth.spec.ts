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

test("staff lands on the workflow-first staff dashboard", async ({ page }) => {
  await page.goto("/staff/login");
  await page.locator('input[name="email"]').fill("staff.demo@smn.example");
  await page.locator('input[name="password"]').fill("DemoStaff123!");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/staff\/?$/);
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What needs action" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Network health" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meaningful changes" })).toBeVisible();
  await expect(page.getByLabel("Platform health")).toBeVisible();
  await expect(page.getByRole("link", { name: /create course|open course builder/i }).first()).toBeVisible();
  await expect(page.getByText("Total members", { exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Operational workspaces" })).toBeVisible();

  await page.goto("/admin/login");
  await expect(page).toHaveURL(/\/staff\/?$/);

  await page.goto("/staff/learning");
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
  await page.getByRole("link", { name: "Analytics" }).click();
  await expect(page.getByText("Completion rate", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Module drop-off" })).toBeVisible();

  await page.goto("/staff/members");
  await expect(page.getByRole("heading", { name: "Member 360" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Private staff notes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add private note" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Opportunity activity" })).toBeVisible();

  await page.goto("/staff/mentorship");
  await expect(page.getByRole("heading", { name: "Mentorship Operations" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mentor applications" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Request queue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mentor capacity" })).toBeVisible();

  await page.goto("/staff/opportunities");
  await expect(page.getByRole("heading", { name: "Opportunity Operations" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Moderation queue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Duplicate candidates" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Source health" })).toBeVisible();
});
