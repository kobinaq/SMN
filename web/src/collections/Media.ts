import type { CollectionConfig } from "payload";
import { isR2Configured } from "@/lib/storage";

const onVercel = process.env.VERCEL === "1";
const r2 = isR2Configured();
// Local disk only when not on Vercel and R2 is off
const useLocalDisk = !onVercel && !r2;

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(
        req.user &&
          (req.user.collection === "users" || req.user.collection === "members"),
      ),
    update: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    delete: ({ req }) => Boolean(req.user && req.user.collection === "users"),
  },
  upload: {
    staticDir: "media",
    disableLocalStorage: !useLocalDisk,
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: useLocalDisk
      ? [
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
        ]
      : [],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
