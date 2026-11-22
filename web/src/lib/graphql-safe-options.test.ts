import { describe, expect, it } from "vitest";
import { categoryLabel, categoryValue, postCategories, resourceCategories, selectOptions } from "@/lib/catalogue";

/** Identical to formatName in @payloadcms/graphql/dist/utilities/formatName.js (UTC-offset branch omitted). */
function formatName(input: string): string {
  let s = String(input);
  if (/^[0-9]/.test(s)) s = `_${s}`;
  const formatted = s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\./g, "_")
    .replace(/-|\//g, "_")
    .replace(/\+/g, "_")
    .replace(/,/g, "_")
    .replace(/\(/g, "_")
    .replace(/\)/g, "_")
    .replace(/'/g, "_")
    .replace(/ /g, "")
    .replace(/\[|\]/g, "_");
  return formatted || "_";
}

const GRAPHQL_NAME = /^[_A-Za-z][_A-Za-z0-9]*$/;

type AnyField = Record<string, unknown>;

function collectOptions(fields: unknown, path: string, out: { path: string; value: string }[]) {
  if (!Array.isArray(fields)) return;
  for (const raw of fields as AnyField[]) {
    const field = raw;
    const here = `${path}.${String(field.name ?? field.type)}`;
    if ((field.type === "select" || field.type === "radio") && Array.isArray(field.options)) {
      for (const option of field.options as Array<string | { value: string }>) {
        out.push({ path: here, value: typeof option === "string" ? option : option.value });
      }
    }
    collectOptions(field.fields, here, out);
    if (Array.isArray(field.tabs)) {
      for (const tab of field.tabs as AnyField[]) collectOptions(tab.fields, `${here}.${String(tab.name ?? tab.label ?? "tab")}`, out);
    }
    if (Array.isArray(field.blocks)) {
      for (const block of field.blocks as AnyField[]) collectOptions(block.fields, `${here}.${String(block.slug)}`, out);
    }
  }
}

describe("GraphQL-safe select options", () => {
  it("every select and radio option value in the Payload config is a valid GraphQL name", async () => {
    const config = await (await import("@/payload.config")).default;
    const found: { path: string; value: string }[] = [];
    for (const collection of config.collections) collectOptions(collection.fields, `collection:${collection.slug}`, found);
    for (const global of config.globals) collectOptions(global.fields, `global:${global.slug}`, found);
    for (const block of config.blocks ?? []) collectOptions(block.fields, `block:${block.slug}`, found);
    expect(found.length).toBeGreaterThan(20);
    const bad = found.filter((o) => !GRAPHQL_NAME.test(formatName(o.value)));
    expect(bad).toEqual([]);
  });

  it("the sanitized config generates a GraphQL schema without a database", async () => {
    const config = await (await import("@/payload.config")).default;
    const { configToSchema } = await import("@payloadcms/graphql");
    const { schema } = configToSchema(config);
    expect(schema.getQueryType()).toBeTruthy();
  });
});

describe("categoryLabel", () => {
  it("shows the same visible label for the new value, the legacy value, and the label", () => {
    expect(categoryLabel("Content Marketing and Planning")).toBe("Content Marketing & Planning");
    expect(categoryLabel("Content Marketing & Planning")).toBe("Content Marketing & Planning");
  });

  it("returns unknown values unchanged", () => {
    expect(categoryLabel("AI")).toBe("AI");
    expect(categoryLabel("Something else")).toBe("Something else");
    expect(categoryLabel("")).toBe("");
  });

  it("maps the legacy stored value to the new one", () => {
    expect(categoryValue("Content Marketing & Planning")).toBe("Content Marketing and Planning");
    expect(categoryValue("AI")).toBe("AI");
  });

  it("selectOptions emits a safe value with the original label", () => {
    const options = selectOptions(postCategories);
    expect(options).toContainEqual({ label: "Content Marketing & Planning", value: "Content Marketing and Planning" });
    expect(options).toContainEqual({ label: "AI", value: "AI" });
    for (const o of [...options, ...selectOptions(resourceCategories)]) expect(formatName(o.value)).toMatch(GRAPHQL_NAME);
  });
});
