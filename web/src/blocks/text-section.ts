import type { Block } from "payload";
import { restrictedRichText } from "@/fields/rich-text";

export const TextSection: Block = {
  slug: "text-section",
  labels: { singular: "Text section", plural: "Text sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "body", type: "richText", editor: restrictedRichText, required: true },
  ],
};
