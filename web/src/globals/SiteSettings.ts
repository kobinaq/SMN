import type { GlobalConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Website",
    description:
      "Public brand, homepage, and social settings. Cohort copy and fees live on Learning programmes marked Cohort.",
  },
  access: {
    read: () => true,
    update: staffOnly,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Brand",
          fields: [
            { name: "siteName", type: "text", required: true, defaultValue: "Social Marketers Network" },
            { name: "tagline", type: "textarea" },
            { name: "description", type: "textarea", admin: { description: "Default meta description" } },
            { name: "opsEmail", type: "email" },
            { name: "whatsappInvite", type: "text", admin: { description: "Full WhatsApp invite URL" } },
            {
              name: "announcementBanner",
              type: "text",
              admin: { description: "Optional sitewide banner. Leave blank to hide." },
            },
            {
              name: "footerBlurb",
              type: "textarea",
              admin: { description: "Short footer explanation of the platform" },
            },
          ],
        },
        {
          label: "Homepage",
          fields: [
            {
              name: "homepage",
              type: "group",
              fields: [
                { name: "headline", type: "text" },
                { name: "supportingCopy", type: "textarea" },
                { name: "primaryCtaLabel", type: "text", defaultValue: "Apply for the next cohort" },
                { name: "secondaryCtaLabel", type: "text", defaultValue: "Join the community" },
                { name: "secondaryCtaHref", type: "text", defaultValue: "/community" },
              ],
            },
          ],
        },
        {
          label: "Social",
          fields: [
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
        },
        {
          label: "Impact (optional)",
          fields: [
            {
              name: "impactStats",
              type: "array",
              admin: {
                description:
                  "Only publish verifiable figures. Leave empty until the client supplies real metrics.",
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
                {
                  name: "verified",
                  type: "checkbox",
                  defaultValue: false,
                  admin: { description: "Must be checked to appear on the public site" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
