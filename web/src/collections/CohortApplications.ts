import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const CohortApplications: CollectionConfig = {
  slug: "cohort-applications",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "createdAt"],
    group: "Website",
    description: "Public flagship cohort applications from /apply.",
  },
  access: {
    admin: staffOnly,
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text", required: true },
    { name: "country", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "level", type: "text", required: true },
    { name: "linkedin", type: "text" },
    { name: "portfolio", type: "text" },
    { name: "goals", type: "textarea", required: true },
    { name: "source", type: "text" },
    {
      name: "course",
      type: "relationship",
      relationTo: "lms-courses",
      maxDepth: 1,
      index: true,
      admin: { description: "Published cohort this application is for." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "received",
      options: [
        { label: "Received", value: "received" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Accepted", value: "accepted" },
        { label: "Waitlisted", value: "waitlisted" },
        { label: "Declined", value: "declined" },
      ],
    },
    { name: "member", type: "relationship", relationTo: "members", maxDepth: 0 },
    { name: "staffNotes", type: "textarea" },
  ],
};
