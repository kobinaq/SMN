import type { GlobalConfig } from "payload";
import { linkFields } from "@/fields/link";
import { isPageEditorEnabled, pageEditorAccess } from "@/lib/page-editor";
import { previewBreakpoints } from "@/lib/page-blocks/preview-url";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header",
  admin: {
    group: "Website",
    hidden: () => !isPageEditorEnabled(),
    description: "Menu and button shown at the top of CMS pages. Available outside production only.",
    livePreview: { url: "/preview/pages/home", breakpoints: previewBreakpoints },
  },
  access: {
    read: pageEditorAccess.read,
    update: pageEditorAccess.update,
    readVersions: pageEditorAccess.readVersions,
  },
  versions: { drafts: true, max: 50 },
  fields: [
    { name: "navItems", type: "array", maxRows: 8, fields: linkFields() },
    {
      name: "ctaButton",
      type: "group",
      label: "Button (optional)",
      fields: linkFields({ required: false }),
    },
    {
      name: "sections",
      type: "group",
      fields: [
        {
          name: "showAgency",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Show Agency in menus and allow its page" },
        },
        {
          name: "showEvents",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Show Events in menus and allow its page. Keep off until the first event is published." },
        },
      ],
    },
  ],
};
