import { expect, test, type Page } from "@playwright/test";

async function loginStaff(page: Page) {
  await page.goto("/staff/login");
  await page.locator('input[name="email"]').fill("staff.demo@smn.example");
  await page.locator('input[name="password"]').fill("DemoStaff123!");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/staff\/?$/);
}

async function loginMember(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("ama.demo@smn.example");
  await page.getByPlaceholder("Password").fill("DemoMember123!");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/app/);
}

async function confirmDialog(page: Page, confirmName: string | RegExp, reason?: string) {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  if (reason) {
    const box = dialog.getByLabel("Reason");
    await box.fill(reason);
    await expect(box).toHaveValue(reason);
  }
  const confirmButton = dialog.getByRole("button", { name: confirmName });
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        /\/api\/admin\//.test(response.url()) &&
        response.status() < 500,
      { timeout: 20_000 },
    ),
    confirmButton.click(),
  ]);
  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

test("staff completes the audited admin operations workflows", async ({ page }) => {
  // Remaining native dialogs (e.g. Career Coach) still use window.confirm/prompt.
  page.on("dialog", async (dialog) => {
    await dialog.accept(dialog.type() === "prompt" ? "Verified during the disposable E2E workflow." : undefined);
  });
  await loginStaff(page);

  await page.goto("/staff/learning?tab=curriculum");
  const duplicateButtons = page.getByRole("button", { name: "Duplicate" });
  const before = await duplicateButtons.count();
  await duplicateButtons.last().click();
  await expect(duplicateButtons).toHaveCount(before + 1);

  await page.getByRole("link", { name: "Learners" }).click();
  await page.getByLabel("Learner").selectOption({ index: 1 });
  await page.getByLabel("Lesson").selectOption({ index: 1 });
  await page.getByLabel("Reason").fill("Verified completion correction for the isolated E2E workflow.");
  await page.getByRole("button", { name: "Save audited override" }).click();
  await expect(page.getByText("Audited override saved.")).toBeVisible();

  await page.getByRole("link", { name: "AI Content Studio" }).click();
  await page.getByLabel("Instruction").fill("Create a concise outline grounded in this course.");
  await page.getByRole("button", { name: "Generate candidate" }).click();
  await expect(page.getByRole("heading", { name: "Compare candidates" })).toBeVisible();
  await page.getByRole("button", { name: "Select" }).click();
  await page.getByRole("button", { name: "Save reviewed draft" }).click();
  await expect(page.getByText(/Draft .* saved/i)).toBeVisible();

  await page.goto("/staff/members");
  await page.getByLabel("Private staff note").fill("Disposable E2E support context; never production member data.");
  await page.getByRole("button", { name: "Add private note" }).click();
  await expect(page.getByText("Private note saved.")).toBeVisible();

  await page.goto("/staff/mentorship");
  await page.getByRole("button", { name: "Approve" }).first().click();
  await confirmDialog(page, "Approve");
  await expect(page.getByText("No mentor applications need review.")).toBeVisible();
  await page.getByRole("button", { name: "Introduce" }).first().click();
  await confirmDialog(page, "Update status");
  await expect(page.getByText(/introduced/i).first()).toBeVisible();

  await page.goto("/staff/opportunities");
  await page.getByRole("button", { name: "Publish" }).first().click();
  await confirmDialog(page, "Confirm", "Verified during the disposable E2E workflow.");
  await expect(page.getByText("No listings await moderation.")).toBeVisible();

  await page.goto("/staff/certificates");
  await page.getByRole("button", { name: "Reissue" }).first().click();
  await confirmDialog(page, "Reissue", "Verified during the disposable E2E workflow.");
  await expect(page.getByText(/notification/i).first()).toBeVisible();
});

test("staff can create and publish a CMS post", async ({ page }) => {
  await loginStaff(page);
  const stamp = Date.now();
  await page.goto("/staff/content/posts/new");
  await page.getByLabel("Title").fill(`E2E Post ${stamp}`);
  await page.getByLabel("Category").selectOption("AI");
  await page.getByLabel("Summary").fill("Disposable E2E article summary for staff CMS cutover.");
  await page.getByLabel("Body").fill("First paragraph.\n\nSecond paragraph for the staff CMS publish path.");
  await page.getByLabel("Publish at").fill("2030-01-15T10:00");
  await page.getByRole("button", { name: "Create post" }).click();
  await expect(page).toHaveURL(/\/staff\/content\/posts\/\d+/);
  await expect(page.getByRole("heading", { name: `E2E Post ${stamp}` })).toBeVisible();
});

test("member uses grounded Tutor and confirmed Career Coach controls with mock AI", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });
  await loginMember(page);

  await page.goto("/app/learning/courses/demo-content-strategy/lessons/demo-strategy-before-calendar");
  await page.getByRole("button", { name: "Ask SMN Tutor" }).click();
  await page.getByLabel("Your question").fill("Explain why strategy comes before a content calendar.");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutor response" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();

  await page.goto("/app/career-coach");
  await expect(page.getByRole("heading", { name: "Career Coach" })).toBeVisible();
  await page
    .getByPlaceholder(/What kind of work/i)
    .fill("Build toward a content strategy role with measurable portfolio evidence.");
  await page.getByRole("button", { name: "Confirm and save goal" }).click();
  await expect(page.getByText("Career goal saved.")).toBeVisible();
  await page.getByPlaceholder(/Ask about a role/i).fill("Give me one practical next step.");
  await page.getByRole("button", { name: "Ask Coach" }).click();
  await expect(page.getByText(/Mock AI response grounded/i)).toBeVisible();
});

test("anonymous callers cannot use staff or member AI mutation routes", async ({ request }) => {
  const staff = await request.post("/api/admin/certificate-operations", {
    data: { action: "issue", enrollmentIds: [1] },
  });
  expect(staff.status()).toBe(401);
  const tutor = await request.post("/api/ai/tutor", {
    data: { courseId: 1, mode: "explain", question: "hello", history: [] },
  });
  expect(tutor.status()).toBe(401);
});
