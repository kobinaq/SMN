import type { CollectionConfig } from "payload";

const onVercel = process.env.VERCEL === "1";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
    // Vercel has no persistent local disk — disable until Blob/S3 is configured
    disableLocalStorage: onVercel,
    mimeTypes: ["image/*"],
    imageSizes: onVercel
      ? []
      : [
          {
            name: "card",
            width: 800,
            height: 600,
            position: "centre",
          },
          {
            name: "hero",
            width: 1920,
            height: 1080,
            position: "centre",
          },
        ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
