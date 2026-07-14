import type { GlobalConfig } from "payload";
import { FEE_PENDING_LABEL } from "../lib/currency";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Website",
    description:
      "Public marketing settings. Confirm pricing before publishing fee amounts. Unconfirmed fees should stay as “Contact SMN for current fees”.",
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
                { name: "secondaryCtaLabel", type: "text", defaultValue: "Explore programmes" },
                { name: "secondaryCtaHref", type: "text", defaultValue: "/programs" },
              ],
            },
          ],
        },
        {
          label: "Cohort",
          fields: [
            {
              name: "cohort",
              type: "group",
              fields: [
                { name: "name", type: "text" },
                { name: "startDate", type: "text" },
                { name: "applicationDeadline", type: "text" },
                { name: "duration", type: "text" },
                { name: "seats", type: "number" },
                { name: "audience", type: "textarea" },
                { name: "format", type: "text" },
                { name: "sessions", type: "text" },
                {
                  name: "priceConfirmed",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description:
                      "Only enable after the client confirms the public fee. When off, the site shows the safe pending label.",
                  },
                },
                {
                  name: "priceLabel",
                  type: "text",
                  defaultValue: FEE_PENDING_LABEL,
                  admin: {
                    description: "Preferred format when confirmed: GH₵2,500. Otherwise keep pending wording.",
                  },
                },
                { name: "priceNote", type: "textarea" },
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
