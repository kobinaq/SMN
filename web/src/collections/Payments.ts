import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Payments: CollectionConfig = {
  slug: "payments",
  admin: {
    useAsTitle: "paystackReference",
    defaultColumns: ["kind", "status", "amount", "currency", "paystackReference", "updatedAt"],
    group: "Commerce",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) =>
      req.user?.collection === "users"
        ? true
        : req.user?.collection === "members"
          ? { member: { equals: req.user.id } }
          : false,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Event", value: "event" },
        { label: "Course", value: "course" },
      ],
    },
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "amount", type: "number", required: true, min: 0, admin: { description: "Amount in minor units (e.g. pesewas)." } },
    { name: "currency", type: "text", required: true, defaultValue: "GHS" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "initialized",
      options: [
        { label: "Initialized", value: "initialized" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
      ],
    },
    { name: "paystackReference", type: "text", required: true, unique: true, index: true },
    { name: "paystackAccessCode", type: "text" },
    { name: "event", type: "relationship", relationTo: "events", maxDepth: 0 },
    { name: "catalogueCourse", type: "relationship", relationTo: "courses", maxDepth: 0 },
    { name: "enrollment", type: "relationship", relationTo: "enrollments", maxDepth: 0 },
    { name: "eventRegistration", type: "relationship", relationTo: "event-registrations" as "events", maxDepth: 0 },
    { name: "metadata", type: "json" },
  ],
};
