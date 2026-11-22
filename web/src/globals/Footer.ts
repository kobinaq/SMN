import type { GlobalConfig } from "payload";
import { linkFields } from "@/fields/link";
import { isPageEditorEnabled, pageEditorAccess } from "@/lib/page-editor";
import { validateHttpsUrl } from "@/lib/page-blocks/link-validation";
import { previewBreakpoints } from "@/lib/page-blocks/preview-url";

export const socialPlatforms = ["instagram", "linkedin", "x", "facebook", "youtube", "tiktok", "whatsapp"] as const;

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Website",
    hidden: () => !isPageEditorEnabled(),
    description: "Footer shown on CMS pages. Available outside production only.",
    livePreview: { url: "/preview/pages/home", breakpoints: previewBreakpoints },
  },
  access: {
    read: pageEditorAccess.read,
    update: pageEditorAccess.update,
    readVersions: pageEditorAccess.readVersions,
  },
  versions: { drafts: true, max: 50 },
  fields: [
    { name: "blurb", type: "textarea" },
    {
      name: "columns",
      type: "array",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "links", type: "array", fields: linkFields() },
      ],
    },
    { name: "legalLinks", type: "array", fields: linkFields() },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: socialPlatforms.map((value) => ({ label: value === "x" ? "X" : value[0].toUpperCase() + value.slice(1), value })),
        },
        { name: "url", type: "text", required: true, validate: validateHttpsUrl },
      ],
    },
  ],
};
