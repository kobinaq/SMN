import type { Field, FieldHook, TextField } from "payload";
import { describe, expect, it } from "vitest";
import { Certificates, normalizeCredentialCode } from "@/collections/Certificates";

type HookArgs = Parameters<FieldHook>[0];

function runHook(hook: FieldHook, value: unknown) {
  return hook({ value } as HookArgs);
}

describe("normalizeCredentialCode", () => {
  it("trims and uppercases a mixed-case code", () => {
    expect(runHook(normalizeCredentialCode, "  smn-abc123  ")).toBe("SMN-ABC123");
    expect(runHook(normalizeCredentialCode, "\tSmn-Demo-001\n")).toBe("SMN-DEMO-001");
  });

  it("leaves an already normalised code unchanged", () => {
    expect(runHook(normalizeCredentialCode, "SMN-DEMO-001")).toBe("SMN-DEMO-001");
  });

  it("passes non-string values through untouched", () => {
    expect(runHook(normalizeCredentialCode, undefined)).toBeUndefined();
    expect(runHook(normalizeCredentialCode, null)).toBeNull();
  });

  it("is wired as a beforeChange hook on the credentialCode field", () => {
    const field = Certificates.fields.find(
      (candidate: Field) => "name" in candidate && candidate.name === "credentialCode",
    ) as TextField | undefined;
    expect(field).toBeDefined();
    expect(field?.hooks?.beforeChange).toContain(normalizeCredentialCode);
  });
});
