import type { Block } from "payload";
import { validateOptionalHref } from "@/lib/page-blocks/link-validation";

export const PartnerLogos: Block = {
  slug: "partner-logos",
  labels: { singular: "Partner logos", plural: "Partner logos" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "partners",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media", required: true },
        { name: "url", type: "text", validate: validateOptionalHref, admin: { description: "Optional. A page link or full https:// link." } },
        {
          name: "approved",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Only approved logos are shown." },
        },
      ],
    },
  ],
};
