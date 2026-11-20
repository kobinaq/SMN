import type { Access, CollectionConfig, GlobalConfig } from "payload";
import { describe, expect, it } from "vitest";
import { Cohorts } from "./Cohorts";
import { Courses } from "./Courses";
import { OneOnOne } from "../globals/OneOnOne";

const users = { collection: "users" };
const member = { collection: "members" };

async function allowed(rule: Access | undefined, user: unknown) {
  if (!rule) return false;
  return Boolean(await rule({ req: { user } } as unknown as Parameters<Access>[0]));
}

type Rules = CollectionConfig["access"] | GlobalConfig["access"];

function check(name: string, rules: Rules, operations: string[]) {
  describe(`${name} access`, () => {
    for (const op of operations) {
      const rule = (rules as Record<string, Access | undefined>)[op];
      it(`${op}: staff only`, async () => {
        expect(await allowed(rule, users)).toBe(true);
        expect(await allowed(rule, member)).toBe(false);
        expect(await allowed(rule, null)).toBe(false);
      });
    }
  });
}

check("Courses", Courses.access, ["read", "create", "update", "delete"]);
check("Cohorts", Cohorts.access, ["admin", "read", "create", "update", "delete"]);
check("OneOnOne", OneOnOne.access, ["read", "update"]);

type NumberValidate = (value: number | null | undefined) => true | string;

function validator(fields: unknown[], name: string): NumberValidate {
  const field = (fields as Array<{ name?: string; validate?: unknown }>).find((f) => f.name === name);
  return field?.validate as NumberValidate;
}

describe("whole-number validators keep the minimum", () => {
  it("cohort seats: required, whole, 0 or more", () => {
    const seats = validator(Cohorts.fields, "seats");
    expect(seats(null)).not.toBe(true);
    expect(seats(-1)).not.toBe(true);
    expect(seats(1.5)).not.toBe(true);
    expect(seats(0)).toBe(true);
    expect(seats(25)).toBe(true);
  });

  it("cohort price: optional, whole, 0 or more", () => {
    const price = validator(Cohorts.fields, "price");
    expect(price(undefined)).toBe(true);
    expect(price(-100)).not.toBe(true);
    expect(price(150000)).toBe(true);
  });

  it("one-on-one format values: whole, 1 or more", () => {
    const sessions = validator(OneOnOne.fields, "sessionCount");
    expect(sessions(0)).not.toBe(true);
    expect(sessions(8)).toBe(true);
    expect(validator(OneOnOne.fields, "price")(-1)).not.toBe(true);
  });
});
