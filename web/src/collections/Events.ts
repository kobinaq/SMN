import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "format", "pricing", "status", "startsAt"],
    group: "Website",
  },
  access: {
    read: ({ req }) =>
      req.user?.collection === "users" ? true : { status: { equals: "published" } },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["Webinar", "Workshop", "Networking", "Conference"],
    },
    {
      name: "format",
      type: "select",
      required: true,
      defaultValue: "online",
      options: [
        { label: "Online", value: "online" },
        { label: "Onsite", value: "onsite" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    {
      name: "pricing",
      type: "select",
      required: true,
      defaultValue: "free",
      options: [
        { label: "Free", value: "free" },
        { label: "Paid", value: "paid" },
      ],
    },
    {
      name: "amount",
      type: "number",
      min: 0,
      admin: { description: "Price in minor units (pesewas). Required when paid." },
    },
    { name: "currency", type: "text", defaultValue: "GHS" },
    { name: "capacity", type: "number", min: 1 },
    { name: "venue", type: "text" },
    { name: "address", type: "textarea" },
    {
      name: "onlineUrl",
      type: "text",
      admin: { description: "Meet / Classroom / Zoom link shown after registration." },
    },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date" },
    { name: "date", type: "date", admin: { description: "Legacy display date; prefer startsAt." } },
    { name: "time", type: "text", admin: { description: "Legacy time label." } },
    { name: "host", type: "text" },
    { name: "summary", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "registrationUrl",
      type: "text",
      admin: { description: "Legacy external URL — leave blank for first-party registration." },
    },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};
