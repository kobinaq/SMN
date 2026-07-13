import type { GlobalConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Website" },
  access: {
    read: () => true,
    update: staffOnly,
  },
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "Social Marketers Network" },
    { name: "tagline", type: "textarea" },
    { name: "whatsappInvite", type: "text" },
    { name: "opsEmail", type: "email" },
    {
      name: "cohort",
      type: "group",
      fields: [
        { name: "name", type: "text" },
        { name: "startDate", type: "text" },
        { name: "duration", type: "text" },
        { name: "seats", type: "number" },
        { name: "priceLabel", type: "text" },
        { name: "priceNote", type: "text" },
        { name: "sessions", type: "text" },
      ],
    },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "instagram", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "twitter", type: "text" },
      ],
    },
  ],
};
