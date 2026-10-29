import { expect, test } from "@playwright/test";

const permanentRedirects: Array<[string, string]> = [
  ["/programs", "/academy"],
  ["/programs/cohort", "/academy/cohort"],
  ["/programs/courses", "/academy/courses"],
  ["/employers", "/partner"],
  ["/employers/post-a-job", "/community"],
  ["/employers/request-intern", "/community"],
  ["/experience", "/academy#practical-work"],
  ["/simulations", "/academy#practical-work"],
  ["/careers", "/community"],
  ["/careers/jobs", "/community"],
  ["/careers/jobs/example-role", "/community"],
  ["/careers/internships", "/community"],
  ["/mentorship", "/community/mentors"],
  ["/mentorship/become-a-mentor", "/community/mentors#become-a-mentor"],
  ["/stories", "/community#stories"],
];

test.describe("marketing navigation and CTAs", () => {
  test("header primary CTA goes to Join TSA signup", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    const join = page.getByRole("link", { name: /^Join TSA$/i }).first();
    await expect(join).toHaveAttribute("href", "/signup");
    await expect(page.getByRole("link", { name: /member sign in/i }).first()).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("nav shows the T3 labels", async ({ page }) => {
    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Home", "Academy", "Community", "Partner With Us", "Resources", "About"]) {
      await expect(primary.getByRole("link", { name: label, exact: true }).or(primary.getByRole("button", { name: label, exact: true }))).toBeVisible();
    }
  });

  test("footer includes legal, mentors, and section links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Academy", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Mentors", exact: true }),
    ).toHaveAttribute("href", "/community/mentors");
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Events", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Contact", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Apply", exact: true }),
    ).toBeVisible();
  });

  test("does not display withheld placeholder prices", async ({ page }) => {
    await page.goto("/academy/cohort");
    await expect(page.getByText(/250,?000/)).toHaveCount(0);
    await expect(page.getByText(/Contact TSA for current fees/i).first()).toBeVisible();
  });

  test("application page explains next steps before payment", async ({ page }) => {
    await page.goto("/apply");
    await expect(page.getByRole("heading", { name: /apply to the/i })).toBeVisible();
    await expect(page.getByText(/What happens next/i)).toBeVisible();
    await expect(page.getByText(/after acceptance/i).first()).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /submit application/i })).toBeVisible();
  });

  test("partner page has no public hire or job CTAs", async ({ page }) => {
    await page.goto("/partner");
    await expect(page.getByRole("link", { name: /hire tsa talent/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /^post a job$/i })).toHaveCount(0);
    await expect(page.getByRole("tab", { name: /request an intern/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /partner with us/i }).first()).toBeVisible();
  });

  test("community mentors page keeps become-a-mentor", async ({ page }) => {
    await page.goto("/community/mentors");
    await expect(page.getByRole("heading", { name: /learn from people already doing the work/i })).toBeVisible();
    await expect(page.locator("#become-a-mentor")).toBeVisible();
    await expect(page.getByRole("heading", { name: /become a mentor/i }).first()).toBeVisible();
  });

  test("community stories do not render fictional seed names", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByText("Ada Okonkwo")).toHaveCount(0);
    await expect(page.getByText("Kwame Mensah")).toHaveCount(0);
    await expect(page.getByText("Efua Demo")).toHaveCount(0);
  });

  test("old public URLs return 308 to final targets in one hop", async ({ request }) => {
    for (const [from, to] of permanentRedirects) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      const location = res.headers().location ?? "";
      const expectedPath = to.split("#")[0];
      expect(location.startsWith(expectedPath) || location.endsWith(expectedPath), `${from} -> ${location}`).toBe(
        true,
      );
      if (to.includes("#")) {
        const hash = to.slice(to.indexOf("#"));
        expect(location.includes(hash) || location.includes(encodeURIComponent(hash)), `${from} hash`).toBe(
          true,
        );
      }
    }
  });

  test("seo routes respond", async ({ page, request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("/academy");
    expect(sitemapBody).toContain("/partner");
    expect(sitemapBody).toContain("/community/mentors");
    expect(sitemapBody).not.toContain("/programs");
    expect(sitemapBody).not.toContain("/employers");
    expect(sitemapBody).not.toContain("/careers");
    expect(sitemapBody).not.toContain("/mentorship");
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const body = await robots.text();
    expect(body).toContain("sitemap");
    expect(body).toMatch(/disallow: \/staff/i);
    await page.goto("/");
    await expect(page.locator('script[type="application/ld+json"]').first()).toHaveCount(1);
  });

  test("job and event pages inherit a working default share image", async ({ request }) => {
    async function assertShareImage(path: string) {
      const res = await request.get(path);
      // Detail pages may 404 when the demo slug is unpublished; metadata and
      // inherited opengraph-image still render on the response HTML.
      expect(res.status(), `${path} should not 5xx`).toBeLessThan(500);
      const html = await res.text();
      expect(html, `${path} must not hardcode unhashed /opengraph-image`).not.toMatch(
        /(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*content=["'][^"']*\/opengraph-image(?:\?|["'])/i,
      );

      const ogMatch =
        html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      expect(ogMatch?.[1], `${path} should expose og:image`).toBeTruthy();
      const ogUrl = ogMatch![1];
      // Default share art is the hashed opengraph-image route, not a CMS upload.
      expect(ogUrl).toMatch(/opengraph-image-/);
      // Absolute og:image uses the site metadataBase (e.g. 127.0.0.1:3000), which
      // is not the Playwright test server. Request pathname+search on baseURL.
      const ogPath = (() => {
        try {
          const parsed = new URL(ogUrl);
          return `${parsed.pathname}${parsed.search}`;
        } catch {
          return ogUrl.startsWith("/") ? ogUrl : `/${ogUrl}`;
        }
      })();

      const widthMatch =
        html.match(/property=["']og:image:width["'][^>]*content=["'](\d+)["']/i) ||
        html.match(/content=["'](\d+)["'][^>]*property=["']og:image:width["']/i);
      const heightMatch =
        html.match(/property=["']og:image:height["'][^>]*content=["'](\d+)["']/i) ||
        html.match(/content=["'](\d+)["'][^>]*property=["']og:image:height["']/i);
      expect(widthMatch?.[1]).toBe("1200");
      expect(heightMatch?.[1]).toBe("630");

      const imageRes = await request.get(ogPath);
      expect(imageRes.ok(), `og:image for ${path} should be 200 (${ogPath})`).toBeTruthy();
      expect(imageRes.headers()["content-type"] || "").toMatch(/image\/png/i);
      const buf = Buffer.from(await imageRes.body());
      expect(buf.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBeTruthy();
      // IHDR width/height are big-endian at bytes 16-23 of a PNG.
      expect(buf.readUInt32BE(16)).toBe(1200);
      expect(buf.readUInt32BE(20)).toBe(630);
    }

    // Job detail URLs 308 to /community (T3). Community forwards parent hashed
    // OG images so the redirect destination still satisfies this check. The job
    // page itself keeps itemShareImages for when that route is served.
    await assertShareImage("/careers/jobs/demo-social-media-associate");
    await assertShareImage("/events/demo-marketing-meetup");
  });
});
