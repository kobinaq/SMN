import type { Block } from "payload";
import { linkFields } from "@/fields/link";
import { imageField, imagePresetField } from "./shared";

export const Hero: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    { name: "eyebrow", type: "text", admin: { description: "Small label above the headline (optional)." } },
    { name: "headline", type: "text", required: true },
    { name: "text", type: "textarea" },
    {
      name: "buttons",
      type: "array",
      maxRows: 2,
      fields: [
        ...linkFields(),
        {
          name: "style",
          type: "select",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      ],
    },
    imageField(),
    imagePresetField(),
  ],
};
