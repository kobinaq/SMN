import { expect, test } from "@playwright/test";

test.describe("/community (T7)", () => {
  test("hero uses the Tab 4 heading and joins through signup", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /keep learning\. keep growing\. stay connected\./i,
    );
    const join = page.getByRole("link", { name: /join the community/i }).first();
    await expect(join).toHaveAttribute("href", "/signup");
    await expect(page.getByRole("link", { name: /^join tsa$/i }).last()).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  test("WhatsApp is only a secondary updates link", async ({ page }) => {
    await page.goto("/community");
    const main = page.locator("main");
    const wa = main.getByRole("link", { name: /whatsapp/i });
    const count = await wa.count();
    for (let i = 0; i < count; i += 1) {
      await expect(wa.nth(i)).toHaveText("Also get TSA updates on WhatsApp");
    }
    await expect(main.getByText(/whatsapp group/i)).toHaveCount(0);
  });

  test("lists what members can access and links to the mentor directory", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByRole("heading", { name: /what members can access/i })).toBeVisible();
    await expect(
      page.getByText(
        "Members get discussions, peer learning and community sessions inside their TSA account.",
        { exact: false },
      ),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /hear about selected activities first/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /meet the mentors/i })).toHaveAttribute(
      "href",
      "/community/mentors",
    );
  });

  test("does not promise jobs, internships or income, or call TSA a network", async ({ page }) => {
    for (const path of ["/community", "/community/mentors"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text, path).not.toMatch(/\u2014/);
      expect(text, path).not.toMatch(/\b(jobs?|internships?|placements?|hire|hiring|income)\b/i);
      expect(text, path).not.toMatch(/professional network|the network\b|\bSMN\b|social marketers/i);
    }
  });

  test("hides the stories band when there are no published stories", async ({ page }) => {
    await page.goto("/community");
    const stories = page.locator("#stories");
    if ((await stories.count()) > 0) {
      await expect(stories.getByRole("heading", { name: /^what members say$/i })).toBeVisible();
      await expect(stories.locator("figure").first()).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: /what members say/i })).toHaveCount(0);
    }
  });
});
