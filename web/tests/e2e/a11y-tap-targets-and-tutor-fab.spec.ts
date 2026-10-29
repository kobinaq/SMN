import { expect, type Locator, type Page, test } from "@playwright/test";

const LESSON_PATH =
  "/app/learning/courses/demo-content-strategy/lessons/demo-strategy-before-calendar";

const LESSON_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
] as const;

async function loginMember(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("ama.demo@smn.example");
  await page.getByPlaceholder("Password").fill("DemoMember123!");
  await Promise.all([
    page.waitForURL(/\/app/),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);
}

async function loginStaff(page: Page) {
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
}

function boxesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

async function expectMinTapHeight(locator: Locator, label: string) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label} should have a bounding box`).not.toBeNull();
  expect(box!.height, `${label} height`).toBeGreaterThanOrEqual(44);
}

async function scrollPortalMain(page: Page, to: "top" | "bottom") {
  await page.evaluate((position) => {
    const main = document.getElementById("main");
    const scroller = main?.parentElement;
    if (!scroller) return;
    scroller.scrollTop = position === "top" ? 0 : scroller.scrollHeight;
  }, to);
}

async function assertTutorDoesNotCoverLessonActions(page: Page) {
  const tutor = page.locator("[data-tutor-fab]");
  await expect(tutor).toBeVisible();

  const actions = [
    page.getByRole("link", { name: /^Previous$/i }),
    page.getByRole("link", { name: /^Back to course$/i }),
    page.getByRole("link", { name: /^Next$/i }),
  ];

  for (const position of ["top", "bottom"] as const) {
    await scrollPortalMain(page, position);
    await page.waitForTimeout(200);

    const tutorBox = await tutor.boundingBox();
    expect(tutorBox, `tutor FAB box at ${position}`).not.toBeNull();

    for (const action of actions) {
      if ((await action.count()) === 0) continue;
      const actionBox = await action.boundingBox();
      if (!actionBox) continue;
      // Only assert for actions that intersect the viewport vertically.
      const viewport = page.viewportSize();
      if (!viewport) continue;
      const inView =
        actionBox.y + actionBox.height > 0 && actionBox.y < viewport.height;
      if (!inView) continue;
      expect(
        boxesOverlap(tutorBox!, actionBox),
        `tutor FAB must not overlap ${await action.innerText()} at ${position}`,
      ).toBe(false);
    }
  }
}

for (const viewport of LESSON_VIEWPORTS) {
  test(`tutor FAB clears lesson actions at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize(viewport);
    await loginMember(page);
    await page.goto(LESSON_PATH);
    await expect(page.locator("[data-tutor-fab]")).toBeVisible({ timeout: 20_000 });
    await assertTutorDoesNotCoverLessonActions(page);
  });
}

test("listed controls keep at least 44px tap height", async ({ page }) => {
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await expectMinTapHeight(
    page.getByRole("link", { name: /Think Social Academy home/i }),
    "auth logo link",
  );
  await expectMinTapHeight(
    page.getByRole("link", { name: /Forgot password/i }),
    "Forgot password link",
  );

  await loginMember(page);
  await page.goto("/app/learning");
  await expectMinTapHeight(page.getByRole("link", { name: /^View all$/i }), "Learning View all");

  await page.goto("/app/certificates");
  await page.setViewportSize({ width: 480, height: 900 });
  const certificateAction = page
    .locator(".btn-row-mobile a, .btn-row-mobile button")
    .first();
  await expectMinTapHeight(certificateAction, "Certificates action at 480px");

  await page.setViewportSize({ width: 390, height: 844 });
  await loginStaff(page);
  await expectMinTapHeight(
    page.getByRole("button", { name: /Show more today/i }),
    "Show more today",
  );
});
