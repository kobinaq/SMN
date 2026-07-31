import { expect, test } from "@playwright/test";

test("public home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: /member sign in/i })).toBeVisible();
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
  test.setTimeout(90_000);
  await page.goto("/staff/login");
  await page.locator('input[name="email"]').fill("staff.demo@smn.example");
  await page.locator('input[name="password"]').fill("DemoStaff123!");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/staff-auth/login") &&
        response.request().method() === "POST",
      { timeout: 30_000 },
    ),
    page.locator('button[type="submit"]').click(),
  ]);

  await expect(page).toHaveURL(/\/staff\/?$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /Today,/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do next" })).toBeVisible();
  await page.getByRole("button", { name: /Show more today/i }).click();
  await expect(page.getByRole("heading", { name: "Network health" })).toBeVisible();
  await expect(page.getByLabel("Platform health")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent activity" })).toBeVisible();
  await expect(page.getByRole("complementary").getByRole("link", { name: /^Learning/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Total members" })).toBeVisible();

  await page.goto("/admin/login");
  await expect(page).toHaveURL(/\/staff\/?$/);

  await page.goto("/staff/learning");
  await expect(page.getByRole("heading", { name: "Learning" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Learning sections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Curriculum" })).toBeVisible();
  await page.getByRole("navigation", { name: "Learning sections" }).getByRole("link", { name: "Curriculum" }).click();
  await expect(page.getByRole("heading", { name: "Modules and lessons" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Move module up" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Duplicate" }).first()).toBeVisible();

  const more = page.getByRole("button", { name: "More", exact: true });
  if ((await more.getAttribute("aria-expanded")) !== "true") await more.click();
  await page.getByRole("navigation", { name: "More learning tools" }).getByRole("link", { name: "Learners" }).click();
  await expect(page).toHaveURL(/tab=learners/);
  await expect(page.getByRole("heading", { name: "Learners" })).toBeVisible();
  await page.getByText("Progress override", { exact: true }).click();
  await expect(page.getByRole("button", { name: "Save audited override" })).toBeVisible();

  if ((await more.getAttribute("aria-expanded")) !== "true") await more.click();
  await page.getByRole("navigation", { name: "More learning tools" }).getByRole("link", { name: "Analytics" }).click();
  await expect(page).toHaveURL(/tab=analytics/);
  await expect(page.getByText("Completion rate", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Module drop-off" })).toBeVisible();

  await page.goto("/staff/members");
  await expect(page.getByRole("heading", { name: "People" })).toBeVisible();
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("heading", { name: "Private notes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add private note" })).toBeVisible();
  await page.getByRole("tablist", { name: "Filter" }).getByRole("tab", { name: /Jobs/ }).click();
  await expect(page.getByRole("heading", { name: "Job activity" })).toBeVisible();

  await page.goto("/staff/mentorship");
  await expect(page.getByRole("heading", { name: "Mentorship" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mentor applications" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Request queue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capacity" })).toBeVisible();

  await page.goto("/staff/opportunities");
  await expect(page.getByRole("heading", { name: "Jobs", exact: true })).toBeVisible();
  // Earlier workflow tests may have cleared the pending queue on the shared E2E DB.
  await expect(
    page.getByRole("heading", { name: /Triage|No jobs to review|Possible duplicates|Sources/ }),
  ).toBeVisible();
});
