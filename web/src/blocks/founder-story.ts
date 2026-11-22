import type { Block } from "payload";
import { restrictedRichText } from "@/fields/rich-text";
import { imageField } from "./shared";

export const FounderStory: Block = {
  slug: "founder-story",
  labels: { singular: "Founder story", plural: "Founder stories" },
  fields: [
    { name: "heading", type: "text" },
    { name: "name", type: "text" },
    { name: "role", type: "text" },
    { name: "story", type: "richText", editor: restrictedRichText },
    imageField(),
    { name: "quote", type: "textarea" },
  ],
};
