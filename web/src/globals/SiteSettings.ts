import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "Social Marketers Network" },
    { name: "tagline", type: "textarea" },
    { name: "discordInvite", type: "text" },
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
