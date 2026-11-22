import type { Block } from "payload";

export const Steps: Block = {
  slug: "steps",
  labels: { singular: "Steps", plural: "Steps" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "steps",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
  ],
};
