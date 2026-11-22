import { describe, expect, it } from "vitest";
import { decideImportTarget, parseImportArgs } from "../../../scripts/import-pages-lib.mjs";
import * as home from "@/lib/pages/home";
import * as about from "@/lib/pages/about";
import * as chrome from "@/lib/pages/chrome";
import { imagePresetKeys } from "@/lib/page-blocks/image-presets";
import { nav } from "@/lib/site";
import { buildFooterGlobal, buildHeaderGlobal } from "./chrome-import";
import { normalize, sameContent } from "./compare";
import { buildAboutPage, buildHomePage } from "./page-import";
import { planImport, summaryLine } from "./plan";
import { runImport, type ImportPayload } from "./run";

/** Every string value in a nested structure, including Lexical text nodes. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const copyStrings = (module: Record<string, unknown>, skip: string[] = []) =>
  Object.entries(module)
    .filter(([key]) => !skip.includes(key))
    .flatMap(([, value]) => strings(value))
    .filter((s) => s.trim().length > 0);

describe("page mapping", () => {
  it("has the right slugs and titles", () => {
    expect(buildHomePage().slug).toBe("home");
    expect(buildHomePage().title).toBe(home.homepageSeo.title);
    expect(buildAboutPage().slug).toBe("about");
    expect(buildAboutPage().title).toBe(about.aboutSeo.title);
    expect(buildHomePage().meta).toEqual({ title: home.homepageSeo.title, description: home.homepageSeo.description });
    expect(buildAboutPage().meta).toEqual({ title: about.aboutSeo.title, description: about.aboutSeo.description });
  });

  it("carries every home copy string word for word (agency copy when enabled)", () => {
    const text = strings(buildHomePage({ agencyEnabled: true }).layout);
    const missing = copyStrings(home as Record<string, unknown>, ["homepageSeo", "homepageTestimonials"]).filter(
      (s) => !text.some((t) => t === s || t.includes(s)),
    );
    expect(missing).toEqual([]);
  });

  it("leaves agency copy out when Agency is off, as the code page does", () => {
    const text = strings(buildHomePage({ agencyEnabled: false }).layout).join("\n");
    expect(text).not.toContain(home.homepagePartner.agencyBody);
    expect(text).not.toContain(home.homepagePartner.agencyCtaLabel);
  });

  it("carries every about copy string word for word", () => {
    const text = strings(buildAboutPage().layout);
    const missing = copyStrings(about as Record<string, unknown>, ["aboutSeo"]).filter((s) => !text.some((t) => t === s));
    expect(missing).toEqual([]);
  });

  it("only uses image presets from the allowlist and never uploads", () => {
    for (const page of [buildHomePage(), buildAboutPage()]) {
      const presets = JSON.stringify(page).match(/"imagePreset":"([^"]+)"/g) ?? [];
      for (const hit of presets) expect(imagePresetKeys).toContain(hit.split(":")[1].replaceAll('"', ""));
      expect(JSON.stringify(page)).not.toContain('"image":');
    }
  });

  it("omits empty optional card fields", () => {
    const grid = buildHomePage().layout.find((b) => b.blockType === "card-grid") as unknown as { cards: Array<Record<string, unknown>> };
    for (const card of grid.cards) {
      expect(card).not.toHaveProperty("meta");
      expect(card).not.toHaveProperty("audience");
    }
  });
});

describe("chrome mapping", () => {
  it("builds the header from the code nav and the Agency flag", () => {
    const header = buildHeaderGlobal({ agencyEnabled: false });
    expect(header.navItems).toEqual(nav.map(({ label, href }) => ({ label, href })));
    expect(header.sections).toEqual({ showAgency: false, showEvents: true });
    const withAgency = buildHeaderGlobal({ agencyEnabled: true, nav: [...nav, { label: "Agency", href: "/agency" }] });
    expect(withAgency.navItems.at(-1)).toEqual({ label: "Agency", href: "/agency" });
    expect(withAgency.sections.showAgency).toBe(true);
  });

  it("builds the footer from chrome.ts with identical labels and hrefs", () => {
    const footer = buildFooterGlobal({ agencyEnabled: false });
    expect(footer.blurb).toBe(chrome.footerBrand);
    expect(footer.columns.map((c) => c.links)).toEqual([[...chrome.footerExplore], [...chrome.footerPrograms], [...chrome.footerMore]]);
    expect(buildFooterGlobal({ agencyEnabled: true }).columns[0].links.at(-1)).toEqual(chrome.footerAgencyLink);
  });
});

describe("compare", () => {
  it("ignores ids, timestamps, status, empties and key order", () => {
    const a = { title: "T", layout: [{ id: "x1", blockType: "hero", headline: "H", text: "", buttons: [] }], createdAt: "1", _status: "draft" };
    const b = { layout: [{ headline: "H", blockType: "hero", id: "zz" }], title: "T", updatedAt: "2", meta: { title: null } };
    expect(sameContent(a, b)).toBe(true);
    expect(normalize(a)).toEqual({ title: "T", layout: [{ blockType: "hero", headline: "H" }] });
  });

  it("detects a real difference", () => {
    expect(sameContent({ layout: [{ headline: "A" }] }, { layout: [{ headline: "B" }] })).toBe(false);
    expect(sameContent({ sections: { showEvents: false } }, { sections: { showEvents: true } })).toBe(false);
  });
});

describe("planImport", () => {
  const f = { publish: false, overwrite: false };
  it("creates when missing", () => expect(planImport({ exists: false, same: false }, f)).toBe("create"));
  it("is unchanged when equal", () => expect(planImport({ exists: true, same: true, status: "draft" }, f)).toBe("unchanged"));
  it("publishes an equal draft only with --publish", () => {
    expect(planImport({ exists: true, same: true, status: "draft" }, { ...f, publish: true })).toBe("publish");
    expect(planImport({ exists: true, same: true, status: "published" }, { ...f, publish: true })).toBe("unchanged");
  });
  it("skips a differing doc unless --overwrite", () => {
    expect(planImport({ exists: true, same: false, status: "published" }, f)).toBe("skip");
    expect(planImport({ exists: true, same: false }, { ...f, overwrite: true })).toBe("update");
  });
  it("formats the summary", () => {
    expect(summaryLine({ created: 1, updated: 2, published: 3, unchanged: 4, skipped: 5 })).toBe(
      "created 1, updated 2, published 3, unchanged 4, skipped 5",
    );
  });
});

/** In-memory Payload stand-in: adds ids and statuses like the real one. */
function fakePayload() {
  const pages: Array<Record<string, unknown>> = [];
  const globals: Record<string, Record<string, unknown>> = { header: { sections: { showAgency: false, showEvents: false } }, footer: {} };
  let seq = 0;
  const addIds = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(addIds);
    if (value && typeof value === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) out[k] = addIds(v);
      if ("blockType" in out || "label" in out || "title" in out) out.id = `id${++seq}`;
      return out;
    }
    return value;
  };
  const writes: string[] = [];
  const payload: ImportPayload = {
    async find({ where }) {
      const slug = (where as { slug: { equals: string } }).slug.equals;
      return { docs: pages.filter((p) => p.slug === slug) };
    },
    async create({ data, draft }) {
      writes.push("create");
      const doc = { id: ++seq, ...(addIds(data) as object), _status: draft ? "draft" : "published", createdAt: "now", updatedAt: "now" };
      pages.push(doc);
      return doc;
    },
    async update({ id, data, draft }) {
      writes.push("update");
      const doc = pages.find((p) => p.id === id)!;
      Object.assign(doc, addIds(data), { _status: draft ? "draft" : "published" });
      return doc;
    },
    async findGlobal({ slug }) {
      return globals[slug as string];
    },
    async updateGlobal({ slug, data, draft }) {
      writes.push("updateGlobal");
      globals[slug as string] = { ...(addIds(data) as object), _status: draft ? "draft" : "published", updatedAt: "now" };
      return globals[slug as string];
    },
  };
  return { payload, pages, globals, writes };
}

const flags = (over: Partial<{ dryRun: boolean; publish: boolean; overwrite: boolean }> = {}) => ({ dryRun: false, publish: false, overwrite: false, ...over });

describe("runImport", () => {
  it("is idempotent: the second identical run writes nothing", async () => {
    const fake = fakePayload();
    const first = await runImport(fake.payload, { flags: flags(), agencyEnabled: false });
    expect(first).toMatchObject({ created: 4, updated: 0, unchanged: 0 });
    const writesAfterFirst = fake.writes.length;
    const second = await runImport(fake.payload, { flags: flags(), agencyEnabled: false });
    expect(second).toEqual({ created: 0, updated: 0, published: 0, unchanged: 4, skipped: 0 });
    expect(fake.writes.length).toBe(writesAfterFirst);
  });

  it("publishes unchanged drafts with --publish, then reports unchanged", async () => {
    const fake = fakePayload();
    await runImport(fake.payload, { flags: flags(), agencyEnabled: false });
    const publish = await runImport(fake.payload, { flags: flags({ publish: true }), agencyEnabled: false });
    expect(publish).toMatchObject({ created: 0, updated: 0, published: 4 });
    expect(fake.pages.every((p) => p._status === "published")).toBe(true);
    const again = await runImport(fake.payload, { flags: flags({ publish: true }), agencyEnabled: false });
    expect(again).toMatchObject({ created: 0, updated: 0, published: 0, unchanged: 4 });
  });

  it("skips edited content unless --overwrite", async () => {
    const fake = fakePayload();
    await runImport(fake.payload, { flags: flags({ publish: true }), agencyEnabled: false });
    (fake.pages[0].layout as Array<Record<string, unknown>>)[0].headline = "Edited by staff";
    const skipped = await runImport(fake.payload, { flags: flags({ publish: true }), agencyEnabled: false });
    expect(skipped).toMatchObject({ skipped: 1, unchanged: 3 });
    expect((fake.pages[0].layout as Array<Record<string, unknown>>)[0].headline).toBe("Edited by staff");
    const over = await runImport(fake.payload, { flags: flags({ publish: true, overwrite: true }), agencyEnabled: false });
    expect(over).toMatchObject({ updated: 1, unchanged: 3, skipped: 0 });
    expect((fake.pages[0].layout as Array<Record<string, unknown>>)[0].headline).toBe(home.homepageHero.headline);
  });

  it("writes nothing on --dry-run but prints the plan", async () => {
    const fake = fakePayload();
    const lines: string[] = [];
    const counts = await runImport(fake.payload, { flags: flags({ dryRun: true }), agencyEnabled: false, log: (l) => lines.push(l) });
    expect(fake.writes).toEqual([]);
    expect(counts.created).toBe(4);
    expect(lines.at(-1)).toBe("[dry-run] created 4, updated 0, published 0, unchanged 0, skipped 0");
  });

  it("creates as draft by default and published with --publish", async () => {
    const draft = fakePayload();
    await runImport(draft.payload, { flags: flags(), agencyEnabled: false });
    expect(draft.pages.map((p) => p._status)).toEqual(["draft", "draft"]);
    expect(draft.globals.header._status).toBe("draft");
    const pub = fakePayload();
    await runImport(pub.payload, { flags: flags({ publish: true }), agencyEnabled: false });
    expect(pub.pages.map((p) => p._status)).toEqual(["published", "published"]);
    expect(pub.globals.footer._status).toBe("published");
  });
});

describe("import guards", () => {
  const dev = "postgresql://u:secret-pw@ep-wispy-rice-abpfeozn-pooler.eu-west-2.aws.neon.tech/db";
  it("allows localhost, 127.0.0.1 and the dev endpoint", () => {
    expect(decideImportTarget({ DATABASE_URL: "postgres://u:p@localhost:5432/db" }).ok).toBe(true);
    expect(decideImportTarget({ DATABASE_URL: "postgres://u:p@127.0.0.1/db" }).ok).toBe(true);
    expect(decideImportTarget({ DATABASE_URL: dev }).ok).toBe(true);
  });
  it("refuses production, other hosts, sqlite and a missing URL", () => {
    const prod = decideImportTarget({ DATABASE_URL: "postgresql://u:secret-pw@ep-holy-bonus-ab5c6fnt.eu-west-2.aws.neon.tech/db" });
    expect(prod.ok).toBe(false);
    expect(decideImportTarget({ DATABASE_URL: "postgresql://u:p@ep-other-123.neon.tech/db" }).ok).toBe(false);
    expect(decideImportTarget({ DATABASE_URL: "file:./payload.db" }).ok).toBe(false);
    expect(decideImportTarget({}).ok).toBe(false);
  });
  it("never includes the connection string or password in a reason", () => {
    for (const url of [dev.replace("wispy-rice-abpfeozn", "x"), "postgresql://u:secret-pw@ep-holy-bonus-ab5c6fnt.neon.tech/db", "nope"]) {
      const result = decideImportTarget({ DATABASE_URL: url });
      expect(JSON.stringify(result)).not.toContain("secret-pw");
      expect(JSON.stringify(result)).not.toContain("postgresql://");
    }
  });
  it("parses flags and rejects unknown ones", () => {
    expect(parseImportArgs(["--publish", "--dry-run"])).toEqual({ ok: true, flags: { dryRun: true, publish: true, overwrite: false } });
    expect(parseImportArgs(["--force"]).ok).toBe(false);
  });
});
