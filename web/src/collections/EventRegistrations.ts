import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const EventRegistrations: CollectionConfig = {
  slug: "event-registrations",
  admin: {
    useAsTitle: "ticketCode",
    defaultColumns: ["event", "member", "status", "ticketCode", "registeredAt"],
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
    { name: "event", type: "relationship", relationTo: "events", required: true, maxDepth: 1, index: true },
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending_payment",
      options: [
        { label: "Pending payment", value: "pending_payment" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Checked in", value: "checked_in" },
        { label: "No show", value: "no_show" },
      ],
    },
    { name: "ticketCode", type: "text", unique: true, index: true },
    { name: "paystackReference", type: "text", index: true },
    { name: "amountPaid", type: "number", min: 0 },
    { name: "currency", type: "text", defaultValue: "GHS" },
    { name: "registeredAt", type: "date" },
    { name: "checkedInAt", type: "date" },
    { name: "checkedInBy", type: "relationship", relationTo: "users", maxDepth: 0 },
  ],
};
