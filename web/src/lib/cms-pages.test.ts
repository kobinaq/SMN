import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const find = vi.fn();
const findGlobal = vi.fn();
const getPayloadClient = vi.fn(async () => ({ find, findGlobal }));
vi.mock("@/lib/payload", () => ({ getPayloadClient, shouldUseCms: () => true }));

const { chooseSource, chromeProps, cmsMetadata, getPublishedChrome, getPublishedCmsPage } = await import("./cms-pages");

const page = { slug: "home", title: "Home", layout: [{ blockType: "hero", headline: "Hi" }] };

beforeEach(() => {
  find.mockReset();
  findGlobal.mockReset();
  getPayloadClient.mockClear();
});
afterEach(() => vi.unstubAllEnvs());

describe("production never reads the CMS", () => {
  it("returns null without importing or calling Payload", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(await getPublishedCmsPage("home")).toBeNull();
    expect(await getPublishedChrome()).toBeNull();
    expect(getPayloadClient).not.toHaveBeenCalled();
    expect(find).not.toHaveBeenCalled();
    expect(findGlobal).not.toHaveBeenCalled();
  });
});

describe("getPublishedCmsPage", () => {
  beforeEach(() => vi.stubEnv("VERCEL_ENV", "preview"));

  it("returns the published page, asking only for published, non-draft docs", async () => {
    find.mockResolvedValue({ docs: [page] });
    expect(await getPublishedCmsPage("home")).toEqual(page);
    const args = find.mock.calls[0][0];
    expect(args).toMatchObject({ collection: "pages", draft: false, overrideAccess: true, depth: 1 });
    expect(JSON.stringify(args.where)).toContain('"_status":{"equals":"published"}');
    expect(JSON.stringify(args.where)).toContain('"slug":{"equals":"home"}');
  });

  it("returns null when nothing is published (a draft-only page is not returned by the query)", async () => {
    find.mockResolvedValue({ docs: [] });
    expect(await getPublishedCmsPage("about")).toBeNull();
  });

  it("returns null on any error", async () => {
    find.mockRejectedValue(new Error("db down"));
    expect(await getPublishedCmsPage("home")).toBeNull();
    getPayloadClient.mockRejectedValueOnce(new Error("no config"));
    expect(await getPublishedCmsPage("home")).toBeNull();
  });
});

describe("getPublishedChrome", () => {
  beforeEach(() => vi.stubEnv("VERCEL_ENV", "preview"));

  it("includes only globals whose status is published", async () => {
    findGlobal.mockImplementation(async ({ slug }: { slug: string }) =>
      slug === "header" ? { _status: "published", navItems: [] } : { _status: "draft", blurb: "x" },
    );
    const chrome = await getPublishedChrome();
    expect(chrome?.header).toMatchObject({ _status: "published" });
    expect(chrome?.footer).toBeNull();
    expect(findGlobal.mock.calls[0][0]).toMatchObject({ draft: false, overrideAccess: true });
  });

  it("is null when neither is published, or on error", async () => {
    findGlobal.mockResolvedValue({ _status: "draft" });
    expect(await getPublishedChrome()).toBeNull();
    findGlobal.mockRejectedValue(new Error("x"));
    expect(await getPublishedChrome()).toBeNull();
  });
});

describe("chooseSource", () => {
  it("uses the CMS only for a published page with blocks", () => {
    expect(chooseSource(page)).toBe("cms");
    expect(chooseSource(null)).toBe("code");
    expect(chooseSource({ ...page, layout: [] })).toBe("code");
    expect(chooseSource({ ...page, layout: null })).toBe("code");
  });
});

describe("cmsMetadata", () => {
  const fallback = { title: { absolute: "Code" }, description: "Code description", openGraph: { url: "/" } };
  it("falls back to the code metadata when the page has no share settings", () => {
    expect(cmsMetadata(page, fallback)).toBe(fallback);
  });
  it("overrides title and description from page.meta", () => {
    const out = cmsMetadata({ ...page, meta: { title: "CMS", description: "CMS d" } }, fallback);
    expect(out.title).toEqual({ absolute: "CMS" });
    expect(out.description).toBe("CMS d");
    expect(out.openGraph).toMatchObject({ url: "/", title: "CMS" });
  });
});

describe("chromeProps", () => {
  it("is code defaults when nothing is published", () => {
    expect(chromeProps(null, false)).toEqual({ darkHomeHero: true });
    expect(chromeProps(null, true).darkHomeHero).toBe(false);
  });

  it("filters Agency and Events by the header toggles", () => {
    const header = {
      navItems: [
        { label: "About", href: "/about" },
        { label: "Agency", href: "/agency" },
      ],
      sections: { showAgency: false, showEvents: true },
    };
    const footer = {
      blurb: "Blurb",
      columns: [{ heading: "More", links: [{ label: "Events", href: "/events" }, { label: "Agency", href: "/agency" }] }],
    };
    const props = chromeProps({ header, footer }, false);
    expect(props.navItems).toEqual([{ label: "About", href: "/about" }]);
    expect(props.footer?.columns[0].links).toEqual([{ label: "Events", href: "/events" }]);
    const off = chromeProps({ header: { ...header, sections: { showAgency: true, showEvents: false } }, footer }, false);
    expect(off.footer?.columns[0].links).toEqual([{ label: "Agency", href: "/agency" }]);
  });

  it("uses code chrome for a global that is not published", () => {
    const props = chromeProps({ header: null, footer: { blurb: "B", columns: [] } }, false);
    expect(props.navItems).toBeUndefined();
    expect(props.footer?.blurb).toBe("B");
  });
});
