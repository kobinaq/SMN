import { expect, test } from "@playwright/test";

test.describe("Partner page (T8)", () => {
  test("renders the Tab 4 sections and the Agency", async ({ page }) => {
    await page.goto("/partner");
    await expect(
      page.getByRole("heading", { level: 1, name: "Build with the next generation of marketers." }),
    ).toBeVisible();
    for (const name of ["Sponsorship", "Events", "Simulations", "Social Media, Storytelling & Content"]) {
      await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
    const agency = page.locator("#agency");
    for (const name of ["Social Media", "Storytelling", "Content"]) {
      await expect(agency.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
    }
    await expect(page.getByText(/clearly labelled simulations/)).toBeVisible();
  });

  test("CTAs go to the contact form with the right type", async ({ page }) => {
    await page.goto("/partner");
    const main = page.locator("main");
    const expected: Array<[string, string]> = [
      ["Discuss Sponsorship", "/contact?type=Sponsorship"],
      ["Partner on an Event", "/contact?type=Collaboration"],
      ["Create a Simulation", "/contact?type=Simulation%20waitlist"],
      ["Work With Think Social Agency", "/contact?type=Partnership"],
      ["Enquire about team training", "/contact?type=Training%20request"],
    ];
    for (const [name, href] of expected) {
      await expect(main.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
    }
  });

  test("Discuss Sponsorship preselects the contact form type", async ({ page }) => {
    await page.goto("/partner");
    await page.locator("main").getByRole("link", { name: "Discuss Sponsorship", exact: true }).click();
    await expect(page).toHaveURL(/\/contact\?type=Sponsorship/);
    await expect(page.locator("select[name='type']")).toHaveValue("Sponsorship");
  });

  test("old ?request= links still land on the partner page without hire forms", async ({ page }) => {
    for (const request of ["job", "intern", "talent", "training"]) {
      const response = await page.goto(`/partner?request=${request}`);
      expect(response?.status(), request).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(/next generation of marketers/);
    }
    await expect(page.getByRole("tab", { name: /request an intern|hire talent|post a job/i })).toHaveCount(0);
  });

  test("has no em dash, SMN, hire, intern or job copy", async ({ page }) => {
    await page.goto("/partner");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\u2014/);
    expect(text).not.toMatch(/\bSMN\b|Social Marketers/i);
    expect(text).not.toMatch(/\bhir(e|ing)\b|\bintern(s|ship|ships)?\b|\bjobs?\b/i);
  });
});
