import { expect, type Page, test } from "@playwright/test";

const PASSWORD = "JoinTsa-e2e-123";

function uniqueEmail() {
  return `join.e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
}

async function expectNoEmDash(page: Page) {
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/\u2014|&mdash;/);
  expect(text).not.toMatch(/\bSMN\b|Social Marketers/);
  expect(text).not.toMatch(/\bjobs?\b|\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|guarantee/i);
}

test.describe("Join TSA flow", () => {
  test("signup page leads with the free TSA account", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveTitle(/Create account \| Think Social Academy/);
    await expect(page.getByRole("heading", { level: 1, name: "Join TSA" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create free account" })).toBeVisible();

    for (const label of ["Full name", "Email", "Password", "Confirm password"]) {
      await expect(page.getByRole("textbox", { name: label, exact: true })).toBeVisible();
    }
    // Required asterisks are decorative; `required` carries the meaning.
    const stars = page.locator('label span[aria-hidden="true"]');
    await expect(stars).toHaveCount(4);
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveAttribute("required", "");

    const wa = page.getByRole("link", { name: /Also get TSA updates on WhatsApp/ });
    await expect(wa).toHaveCount(1);
    await expect(wa).toHaveAttribute("href", /whatsapp/i);
    await expect(page.getByText(/whatsapp group/i)).toHaveCount(0);

    await expect(page.getByText(/runs for 4 weeks/)).toBeVisible();
    await expectNoEmDash(page);
  });

  test("shows inline errors linked to each field and focuses the first", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "Create free account" }).click();

    const name = page.getByRole("textbox", { name: "Full name", exact: true });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", /signup-name-error/);
    await expect(page.locator("#signup-name-error")).toHaveText("Enter your full name.");

    const email = page.getByRole("textbox", { name: "Email", exact: true });
    await expect(email).toHaveAttribute("aria-describedby", /signup-email-hint/);
    await expect(email).toHaveAttribute("aria-describedby", /signup-email-error/);

    await name.fill("Ama Join");
    await email.fill(uniqueEmail());
    await page.getByRole("textbox", { name: "Password", exact: true }).fill(PASSWORD);
    await page.getByRole("textbox", { name: "Confirm password", exact: true }).fill("Different-123");
    await page.getByRole("button", { name: "Create free account" }).click();

    const confirm = page.getByRole("textbox", { name: "Confirm password", exact: true });
    await expect(confirm).toBeFocused();
    await expect(page.locator("#signup-confirm-error")).toHaveText("The passwords do not match.");
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("creates an account, confirms it and runs first-run screens", async ({ page }) => {
    test.setTimeout(90_000);
    const email = uniqueEmail();
    await page.goto("/signup");
    await page.getByRole("textbox", { name: "Full name", exact: true }).fill("Ama Join");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    await page.getByRole("textbox", { name: "Password", exact: true }).fill(PASSWORD);
    await page.getByRole("textbox", { name: "Confirm password", exact: true }).fill(PASSWORD);
    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/member-auth/signup") && res.request().method() === "POST",
        { timeout: 30_000 },
      ),
      page.getByRole("button", { name: "Create free account" }).click(),
    ]);

    await expect(page).toHaveURL(/\/signup\/confirmed$/, { timeout: 20_000 });
    await expect(page).toHaveTitle(/Account created \| Think Social Academy/);
    await expect(page.getByRole("heading", { level: 1, name: "Your TSA account is ready" })).toBeVisible();
    await expect(page.getByText(`You are signed in as ${email}.`)).toBeVisible();
    await expect(page.getByText(/apply for the .*\(4 weeks\)/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Also get TSA updates on WhatsApp/ })).toHaveCount(1);
    await expectNoEmDash(page);

    await page.getByRole("link", { name: "Start your first steps" }).click();
    await expect(page).toHaveURL(/\/app\/welcome$/);
    await expect(page).toHaveTitle(/^Welcome \| TSA$/);
    await expect(page.getByRole("heading", { level: 1, name: "Welcome to TSA, Ama Join." })).toBeVisible();
    for (const area of ["Learn", "Apply", "Grow", "Connect"]) {
      await expect(page.getByRole("heading", { level: 3, name: area })).toBeVisible();
    }
    await expect(page.getByText(/: 4 weeks$/)).toBeVisible();
    await expectNoEmDash(page);

    await page.getByRole("main").getByRole("link", { name: "Go to member home" }).click();
    await expect(page).toHaveURL(/\/app\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Welcome, Ama Join." })).toBeVisible();
    await expect(page.getByRole("link", { name: /See what you can do as a member/ })).toHaveAttribute(
      "href",
      "/app/welcome",
    );

    // Signed-in members skip the signup form.
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/app\/?$/);
  });

  test("confirmation screen needs a signed-in member", async ({ page }) => {
    await page.goto("/signup/confirmed");
    await expect(page).toHaveURL(/\/signup$/);
    await page.goto("/app/welcome");
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  });

  test("signup controls meet 44px tap targets on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/signup");
    const targets = [
      page.getByRole("textbox", { name: "Full name", exact: true }),
      page.getByRole("textbox", { name: "Email", exact: true }),
      page.getByRole("textbox", { name: "Password", exact: true }),
      page.getByRole("textbox", { name: "Confirm password", exact: true }),
      page.getByRole("button", { name: "Create free account" }),
      page.getByRole("main").getByRole("link", { name: "Sign in" }),
      page.getByRole("link", { name: /Also get TSA updates on WhatsApp/ }),
    ];
    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box, await target.evaluate((el) => el.outerHTML.slice(0, 80))).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
  });
});
