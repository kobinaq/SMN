import type { Block } from "payload";
import { linkField } from "@/fields/link";

export const CtaBand: Block = {
  slug: "cta-band",
  labels: { singular: "Call to action band", plural: "Call to action bands" },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "text", type: "textarea" },
    linkField({ name: "primary", required: true, label: "Primary link" }),
    linkField({ name: "secondary", required: false, label: "Secondary link (optional)" }),
  ],
};
