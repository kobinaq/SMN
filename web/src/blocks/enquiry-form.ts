import type { Block } from "payload";
import { enquiryTypeLabels, enquiryTypes } from "@/lib/enquiries/options";

export const EnquiryFormBlock: Block = {
  slug: "enquiry-form",
  labels: { singular: "Enquiry form", plural: "Enquiry forms" },
  fields: [
    { name: "heading", type: "text" },
    { name: "text", type: "textarea" },
    {
      name: "enquiryType",
      type: "select",
      defaultValue: "contact",
      required: true,
      options: enquiryTypes
        // Newsletter has its own block; cohort applications use the apply flow.
        .filter((type) => type !== "newsletter" && type !== "cohort-application")
        .map((type) => ({ label: enquiryTypeLabels[type], value: type })),
    },
  ],
};
