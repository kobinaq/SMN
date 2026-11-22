import { describe, expect, it } from "vitest";
import {
  canUsePageEditor,
  isPageEditorAdminPath,
  isPageEditorEnabled,
  pageEditorAccess,
} from "./page-editor";

const call = (fn: (a: never) => unknown, user: unknown) => fn({ req: { user } } as never);
const superAdmin = { collection: "users", role: "super-admin" };
const content = { collection: "users", role: "content" };
const support = { collection: "users", role: "support" };
const member = { collection: "members" };

describe("isPageEditorEnabled", () => {
  it("is off only in production", () => {
    expect(isPageEditorEnabled({ VERCEL_ENV: "production" })).toBe(false);
    expect(isPageEditorEnabled({ VERCEL_ENV: "preview" })).toBe(true);
    expect(isPageEditorEnabled({ VERCEL_ENV: "development" })).toBe(true);
    expect(isPageEditorEnabled({})).toBe(true);
  });

  it("reads process.env at call time", () => {
    const before = process.env.VERCEL_ENV;
    try {
      process.env.VERCEL_ENV = "production";
      expect(isPageEditorEnabled()).toBe(false);
      process.env.VERCEL_ENV = "preview";
      expect(isPageEditorEnabled()).toBe(true);
    } finally {
      if (before === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = before;
    }
  });
});

describe("pageEditorAccess", () => {
  const ops = ["admin", "read", "create", "update", "delete", "readVersions"] as const;
  const withEnv = (value: string | undefined, fn: () => void) => {
    const before = process.env.VERCEL_ENV;
    try {
      if (value === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = value;
      fn();
    } finally {
      if (before === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = before;
    }
  };

  it("denies every operation in production, even for super-admin", () => {
    withEnv("production", () => {
      for (const op of ops) {
        expect(call(pageEditorAccess[op], superAdmin)).toBe(false);
        expect(call(pageEditorAccess[op], content)).toBe(false);
        expect(call(pageEditorAccess[op], null)).toBe(false);
      }
    });
  });

  it("allows content staff and super-admin on preview", () => {
    withEnv("preview", () => {
      for (const op of ops) {
        expect(call(pageEditorAccess[op], content)).toBe(true);
        expect(call(pageEditorAccess[op], superAdmin)).toBe(true);
      }
    });
  });

  it("denies other staff roles, members and anonymous on preview", () => {
    withEnv("preview", () => {
      for (const op of ops) {
        expect(call(pageEditorAccess[op], support)).toBe(false);
        expect(call(pageEditorAccess[op], member)).toBe(false);
        expect(call(pageEditorAccess[op], null)).toBe(false);
        expect(call(pageEditorAccess[op], undefined)).toBe(false);
      }
    });
  });

  it("canUsePageEditor takes an explicit env", () => {
    expect(canUsePageEditor(content, { VERCEL_ENV: "production" })).toBe(false);
    expect(canUsePageEditor(content, {})).toBe(true);
  });
});

describe("isPageEditorAdminPath", () => {
  it("allows only pages and header/footer", () => {
    expect(isPageEditorAdminPath(["collections", "pages"])).toBe(true);
    expect(isPageEditorAdminPath(["collections", "pages", "12", "versions"])).toBe(true);
    expect(isPageEditorAdminPath(["globals", "header"])).toBe(true);
    expect(isPageEditorAdminPath(["globals", "footer", "versions"])).toBe(true);
  });

  it("rejects everything else", () => {
    expect(isPageEditorAdminPath([])).toBe(false);
    expect(isPageEditorAdminPath(["collections"])).toBe(false);
    expect(isPageEditorAdminPath(["collections", "users"])).toBe(false);
    expect(isPageEditorAdminPath(["collections", "pages-extra"])).toBe(false);
    expect(isPageEditorAdminPath(["globals", "site-settings"])).toBe(false);
    expect(isPageEditorAdminPath(["globals"])).toBe(false);
    expect(isPageEditorAdminPath(["account"])).toBe(false);
    expect(isPageEditorAdminPath(["login"])).toBe(false);
    expect(isPageEditorAdminPath(["pages", "collections"])).toBe(false);
  });
});
