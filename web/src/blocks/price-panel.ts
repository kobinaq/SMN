import type { Block } from "payload";
import { validateOptionalHref } from "@/lib/page-blocks/link-validation";

export const PricePanel: Block = {
  slug: "price-panel",
  labels: { singular: "Price panel", plural: "Price panels" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "product",
      type: "select",
      required: true,
      defaultValue: "course",
      options: [
        { label: "Course", value: "course" },
        { label: "One-on-One", value: "one-on-one" },
        { label: "Workshops", value: "workshops" },
      ],
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      admin: { condition: (_data, siblingData) => siblingData?.product === "course" },
    },
    {
      name: "applyLink",
      type: "text",
      validate: validateOptionalHref,
      admin: {
        description: "Optional. Where Apply goes when the course has an open cohort. Defaults to /apply.",
        condition: (_data, siblingData) => siblingData?.product === "course",
      },
    },
  ],
};
