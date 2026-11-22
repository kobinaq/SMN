import type { Field } from "payload";
import { validateHref, validateOptionalHref } from "@/lib/page-blocks/link-validation";

type LinkOptions = {
  name?: string;
  required?: boolean;
  label?: string;
  /** Extra fields in the same group, e.g. a style select. */
  extra?: Field[];
};

/** Label plus href. Hrefs are paths, #anchors, mailto:, tel: or https:// only. */
export function linkFields({ required = true }: { required?: boolean } = {}): Field[] {
  return [
    {
      type: "row",
      fields: [
        {
          name: "label",
          type: "text",
          required,
          admin: { width: "40%" },
          validate: (value: string | null | undefined, { siblingData }: { siblingData?: { href?: string } }) => {
            if (required) return (value ?? "").trim() ? true : "Enter the link text.";
            return !(value ?? "").trim() && (siblingData?.href ?? "").trim() ? "Enter the link text." : true;
          },
        },
        {
          name: "href",
          type: "text",
          required,
          admin: {
            width: "60%",
            description: "A page like /about, an #anchor, mailto:, tel:, or a full https:// link.",
          },
          validate: required ? validateHref : validateOptionalHref,
        },
      ],
    },
  ];
}

/** A named link group. Optional links may be left blank. */
export function linkField({ name = "link", required = true, label, extra = [] }: LinkOptions = {}): Field {
  return {
    name,
    type: "group",
    label,
    fields: [...linkFields({ required }), ...extra],
  };
}

export type LinkValue = { label?: string | null; href?: string | null } | null | undefined;
