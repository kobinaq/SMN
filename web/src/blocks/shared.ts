import type { Field } from "payload";

export const imageField = (name = "image", label?: string): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
});
