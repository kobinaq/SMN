import type { Block } from "payload";
import { linkField } from "@/fields/link";
import { imageField } from "./shared";

export const CardGrid: Block = {
  slug: "card-grid",
  labels: { singular: "Card grid", plural: "Card grids" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    {
      name: "variant",
      type: "select",
      defaultValue: "program-types",
      options: [
        { label: "Program types", value: "program-types" },
        { label: "Approaches", value: "approaches" },
        { label: "Audiences", value: "audiences" },
      ],
    },
    {
      name: "cards",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
        imageField(),
        linkField({ name: "link", required: false, label: "Link (optional)" }),
      ],
    },
  ],
};
