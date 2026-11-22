import type { Block } from "payload";
import { linkField } from "@/fields/link";
import { restrictedRichText } from "@/fields/rich-text";
import { imageField, imagePresetField } from "./shared";

export const FounderStory: Block = {
  slug: "founder-story",
  labels: { singular: "Founder story", plural: "Founder stories" },
  fields: [
    { name: "eyebrow", type: "text", admin: { description: "Small label above the heading (optional)." } },
    { name: "heading", type: "text" },
    { name: "name", type: "text" },
    { name: "role", type: "text" },
    { name: "story", type: "richText", editor: restrictedRichText },
    imageField(),
    imagePresetField(),
    { name: "quote", type: "textarea" },
    linkField({ name: "cta", required: false, label: "Link (optional)" }),
  ],
};
