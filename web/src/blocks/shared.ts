import type { Field } from "payload";
import { imagePresetKeys } from "@/lib/page-blocks/image-presets";

const presetLabel = (key: string) => key.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/** Optional built-in image, shown only when no upload is set. */
export const imagePresetField = (): Field => ({
  name: "imagePreset",
  type: "select",
  label: "Built-in image",
  options: imagePresetKeys.map((value) => ({ label: presetLabel(value), value })),
  admin: { description: "Used only when no image is uploaded." },
});

export const imageField = (name = "image", label?: string): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
});
