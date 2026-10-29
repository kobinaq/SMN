import { describe, expect, it } from "vitest";
import { createElement } from "react";
import {
  optionsFromChildren,
  selectOptionDomId,
  selectTriggerLabelledBy,
  valueMatchesFieldName,
} from "@/components/ui/Select";

describe("optionsFromChildren", () => {
  it("reads value and label from option elements", () => {
    const options = optionsFromChildren([
      createElement("option", { value: "", disabled: true, key: "empty" }, "Select…"),
      createElement("option", { value: "live", key: "live" }, "Live cohort"),
    ]);
    expect(options).toEqual([
      { value: "", label: "Select…", disabled: true },
      { value: "live", label: "Live cohort", disabled: false },
    ]);
  });

  it("falls back to the option text when value is omitted", () => {
    const options = optionsFromChildren(createElement("option", null, "Video call"));
    expect(options).toEqual([{ value: "Video call", label: "Video call", disabled: false }]);
  });
});

describe("selectTriggerLabelledBy", () => {
  it("joins an external label id with the value id", () => {
    expect(selectTriggerLabelledBy("field-label", "value-id")).toBe("field-label value-id");
  });

  it("omits the value id when includeValue is false", () => {
    expect(selectTriggerLabelledBy("field-label", "value-id", { includeValue: false })).toBe(
      "field-label",
    );
  });

  it("leaves aria-labelledby unset when no external label is passed", () => {
    expect(selectTriggerLabelledBy(undefined, "value-id")).toBeUndefined();
  });
});

describe("valueMatchesFieldName", () => {
  it("treats placeholder text that repeats the field label as a match", () => {
    expect(valueMatchesFieldName("Experience level", "Experience level")).toBe(true);
    expect(valueMatchesFieldName("Seniority", "Seniority")).toBe(true);
    expect(valueMatchesFieldName("  experience LEVEL ", "Experience level")).toBe(true);
  });

  it("keeps distinct values for naming", () => {
    expect(valueMatchesFieldName("Beginner", "Experience level")).toBe(false);
    expect(valueMatchesFieldName("Senior", "Seniority")).toBe(false);
  });
});

describe("selectOptionDomId", () => {
  it("builds a stable id from the list id and option value", () => {
    expect(selectOptionDomId("list-1", "Mid-level")).toBe("list-1-opt-Mid-level");
    expect(selectOptionDomId("list-1", "")).toBe("list-1-opt-empty");
    expect(selectOptionDomId("list-1", "Lead / Head")).toBe("list-1-opt-Lead___Head");
  });
});
