import { expect, type Locator, type Page, test } from "@playwright/test";

const LESSON_L1 =
  "/app/learning/courses/demo-content-strategy/lessons/demo-strategy-before-calendar";
const LESSON_L2 =
  "/app/learning/courses/demo-content-strategy/lessons/demo-build-the-calendar";

const LESSON_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 640, height: 900 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 844, height: 390 },
  { width: 667, height: 375 },
] as const;

const LESSON_PATHS = [
  { label: "L1", path: LESSON_L1 },
  { label: "L2", path: LESSON_L2 },
] as const;

async function loginMember(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("ama.demo@smn.example");
  await page.getByPlaceholder("Password").fill("DemoMember123!");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/member-auth/login") &&
        response.request().method() === "POST" &&
        response.ok(),
      { timeout: 30_000 },
    ),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);
  await expect(page).toHaveURL(/\/app/, { timeout: 20_000 });
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
  // Round for subpixel layout (e.g. 43.9999 from min-h-11 / 2.75rem).
  expect(Math.round(box!.height), `${label} height`).toBeGreaterThanOrEqual(44);
}

async function scrollPortalMain(page: Page, to: "top" | "middle" | "bottom") {
  await page.evaluate((position) => {
    const main = document.getElementById("main");
    const scroller = main?.parentElement;
    if (!scroller) return;
    if (position === "top") {
      scroller.scrollTop = 0;
      return;
    }
    if (position === "bottom") {
      scroller.scrollTop = scroller.scrollHeight;
      return;
    }
    const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    scroller.scrollTop = max / 2;
  }, to);
}

async function assertTutorDoesNotCoverLessonActions(page: Page, label: string) {
  const tutor = page.locator("[data-tutor-fab]");
  await expect(tutor, `${label}: tutor FAB`).toBeVisible();

  const actions = [
    page.getByRole("link", { name: /^Previous$/i }),
    page.getByRole("link", { name: /^Back to course$/i }),
    page.getByRole("link", { name: /^Next$/i }),
  ];

  for (const position of ["top", "middle", "bottom"] as const) {
    await scrollPortalMain(page, position);
    await page.waitForTimeout(100);

    const tutorBox = await tutor.boundingBox();
    expect(tutorBox, `${label}: tutor FAB box at ${position}`).not.toBeNull();

    for (const action of actions) {
      if ((await action.count()) === 0) continue;
      const actionBox = await action.boundingBox();
      if (!actionBox) continue;
      const viewport = page.viewportSize();
      if (!viewport) continue;
      const inView =
        actionBox.y + actionBox.height > 0 && actionBox.y < viewport.height;
      if (!inView) continue;
      expect(
        boxesOverlap(tutorBox!, actionBox),
        `${label}: tutor FAB must not overlap ${await action.innerText()} at ${position}`,
      ).toBe(false);
    }
  }
}

test("tutor FAB clears lesson actions across phone, tablet, desktop and landscape", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await loginMember(page);

  for (const viewport of LESSON_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const lesson of LESSON_PATHS) {
      await page.goto(lesson.path);
      await expect(page.locator("[data-tutor-fab]")).toBeVisible({ timeout: 20_000 });
      await assertTutorDoesNotCoverLessonActions(
        page,
        `${lesson.label} ${viewport.width}x${viewport.height}`,
      );
    }
  }
});

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
    "member Forgot password link",
  );

  await page.goto("/staff/login");
  await expectMinTapHeight(
    page.getByRole("link", { name: /Forgot password/i }),
    "staff Forgot password link",
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

test("tutor panel moves focus in on open and back to the FAB on close", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await loginMember(page);
  await page.goto(LESSON_L1);

  const fab = page.getByRole("button", { name: "Ask TSA Tutor" });
  await expect(fab).toBeVisible({ timeout: 20_000 });
  await fab.focus();
  await fab.click();

  const heading = page.getByRole("heading", { name: "TSA Tutor" });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  // Programmatic focus on tabindex=-1 must not pick up the sitewide focus ring.
  // outline-style:none means nothing is drawn even if width still reports a used value.
  await expect
    .poll(async () =>
      heading.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.outlineStyle === "none" || style.outlineWidth === "0px";
      }),
    )
    .toBe(true);

  const close = page.getByRole("button", { name: "Close Tutor" });
  await close.focus();
  await expect(close).toBeFocused();
  await expect
    .poll(async () =>
      close.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.outlineStyle !== "none" && style.outlineWidth !== "0px";
      }),
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Ask TSA Tutor" })).toBeFocused();

  await page.getByRole("button", { name: "Ask TSA Tutor" }).click();
  await expect(page.getByRole("heading", { name: "TSA Tutor" })).toBeFocused();
  await page.getByRole("button", { name: "Close Tutor" }).click();
  await expect(page.getByRole("button", { name: "Ask TSA Tutor" })).toBeFocused();
});
