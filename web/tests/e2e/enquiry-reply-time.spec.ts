import { expect, test, type Page } from "@playwright/test";
import { ENQUIRY_REPLY_TIME_COPY } from "../../src/lib/enquiry-copy";

const pages = [
  "/contact?type=General%20enquiry",
  "/partnerships",
  "/agency",
  "/programs/social-media-marketing",
  "/programs/one-on-one-training",
  "/programs/organisational-training",
];

async function fillRequired(page: Page) {
  const form = page.locator("main form").filter({ has: page.locator('button[type="submit"]') }).first();
  for (const el of await form.locator("input[required], textarea[required]").all()) {
    const type = await el.getAttribute("type");
    await el.fill(type === "email" ? "tester@example.com" : "Test enquiry for reply-time copy check.");
  }
  return form;
}

for (const path of pages) {
  for (const viewport of [{ width: 375, height: 800 }, { width: 1280, height: 800 }]) {
    test(`reply time near submit and in success state: ${path} @${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.route("**/api/enquiries", (route) =>
        route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, id: "x" }) }),
      );
      await page.goto(path);
      const form = page.locator("main form").filter({ has: page.locator('button[type="submit"]') }).first();
      const hint = form.getByTestId("enquiry-reply-time");
      await expect(hint).toHaveText(ENQUIRY_REPLY_TIME_COPY);
      await hint.scrollIntoViewIfNeeded();
      await expect(hint).toBeVisible();
      const submit = await form.locator('button[type="submit"]').boundingBox();
      const hintBox = await hint.boundingBox();
      expect(hintBox!.y - (submit!.y + submit!.height)).toBeLessThan(48);
      expect(hintBox!.x + hintBox!.width).toBeLessThanOrEqual(viewport.width);

      await fillRequired(page);
      await form.locator('button[type="submit"]').click();
      const status = form.getByRole("status");
      await expect(status).toContainText(ENQUIRY_REPLY_TIME_COPY);
      await expect(form.getByTestId("enquiry-reply-time")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    });
  }
}
