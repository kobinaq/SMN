import { expect, test } from "@playwright/test";

// A malformed percent-escape used to make Next throw while decoding route
// params, which returned a bare 500. src/proxy.ts now answers with the 404.
const undecodablePaths = ["/verify/%E0%A4%A", "/verify/%E0%A4", "/events/%E0%A4%A"];

for (const path of undecodablePaths) {
  test(`undecodable path ${path} returns 404`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("Page not found");
  });
}

test("a valid certificate code still verifies", async ({ request }) => {
  // The seed issues SMN-DEMO-001, but the staff workflow spec reissues it, which
  // revokes that code. Use it while it is valid, otherwise its live replacement.
  const lookup = await request.get(
    "/api/certificates?where[status][equals]=valid&where[visibility][equals]=public&limit=50&depth=0",
  );
  expect(lookup.ok()).toBe(true);
  const { docs } = (await lookup.json()) as { docs: Array<{ credentialCode: string }> };
  const codes = docs.map((doc) => doc.credentialCode);
  const code = codes.includes("SMN-DEMO-001") ? "SMN-DEMO-001" : codes[0];
  expect(code, "seeded demo certificate or its reissue").toBeTruthy();

  const response = await request.get(`/verify/${code}`, { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain(code);
});
