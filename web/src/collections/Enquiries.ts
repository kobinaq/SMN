import type { CollectionConfig } from "payload";
import {
  enquiryStatuses,
  enquiryStatusLabels,
  enquiryTypeLabels,
  enquiryTypes,
} from "@/lib/enquiries/options";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["type", "name", "email", "status", "createdAt"],
    group: "Website",
    description: "Public form submissions. Created only by POST /api/enquiries.",
  },
  access: {
    admin: staffOnly,
    read: staffOnly,
    create: () => false,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      index: true,
      options: enquiryTypes.map((value) => ({ label: enquiryTypeLabels[value], value })),
    },
    { name: "name", type: "text" },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text" },
    { name: "organisation", type: "text" },
    { name: "message", type: "textarea" },
    { name: "sourcePage", type: "text" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: enquiryStatuses.map((value) => ({ label: enquiryStatusLabels[value], value })),
    },
    { name: "owner", type: "relationship", relationTo: "users", maxDepth: 0, index: true, admin: { description: "Staff member handling this enquiry." } },
    { name: "notes", type: "textarea", admin: { description: "Internal staff notes. Never returned publicly or emailed." } },
    { name: "enrollment", type: "relationship", relationTo: "enrollments", maxDepth: 0, admin: { description: "Enrollment created from this enquiry." } },
  ],
};
