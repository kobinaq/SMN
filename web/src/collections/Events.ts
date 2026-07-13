import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "date"],
    group: "Website",
  },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["Webinar", "Workshop", "Networking", "Conference"],
    },
    { name: "date", type: "date", required: true },
    { name: "time", type: "text" },
    { name: "summary", type: "textarea", required: true },
    { name: "registrationUrl", type: "text", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
