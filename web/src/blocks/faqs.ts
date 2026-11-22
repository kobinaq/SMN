import type { Block } from "payload";

export const Faqs: Block = {
  slug: "faqs",
  labels: { singular: "FAQs", plural: "FAQs" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};
