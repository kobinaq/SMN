import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Stories: CollectionConfig = {
  slug: "stories",
  admin: {
    useAsTitle: "name",
    group: "Website",
    description:
      "Member testimonials. Only stories with Published enabled appear on the public site. Do not publish fictional or seed content.",
  },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    {
      name: "programme",
      type: "text",
      admin: { description: "Programme or cohort name (optional)" },
    },
    { name: "quote", type: "textarea", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "portfolioUrl",
      type: "text",
      admin: { description: "Optional public portfolio or case-study link" },
    },
    {
      name: "permissionConfirmed",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Confirm the member gave permission to publish this testimonial",
      },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Public site only shows published testimonials with permission confirmed",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.published && !data?.permissionConfirmed) {
          data.published = false;
        }
        return data;
      },
    ],
  },
};
