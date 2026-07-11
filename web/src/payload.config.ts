import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Members } from "./collections/Members";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Courses } from "./collections/Courses";
import { Events } from "./collections/Events";
import { Stories } from "./collections/Stories";
import { Resources } from "./collections/Resources";
import { SiteSettings } from "./globals/SiteSettings";
import { createDbAdapter } from "./lib/db";
import { isR2Configured } from "./lib/storage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const r2Enabled = isR2Configured();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "SMN CMS",
      description: "Social Marketers Network content and member administration",
      titleSuffix: " · SMN",
      // Browser tab / bookmarks
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/brand/logo-blue.png",
        },
      ],
      openGraph: {
        title: "SMN CMS",
        description: "Social Marketers Network admin",
        siteName: "Social Marketers Network",
      },
    },
    components: {
      graphics: {
        // Paths relative to admin.importMap.baseDir (src/)
        Logo: "./components/payload/Logo.tsx",
        Icon: "./components/payload/Icon.tsx",
      },
    },
  },
  collections: [Users, Members, Media, Posts, Courses, Events, Stories, Resources],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "smn-dev-secret-change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: createDbAdapter(),
  sharp,
  plugins: r2Enabled
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: "media",
              generateFileURL: ({ filename: file, prefix }) => {
                const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
                if (base) {
                  return `${base}/${prefix ? `${prefix}/` : ""}${file}`;
                }
                // Fallback: API path if no public CDN URL
                return `/api/media/file/${file}`;
              },
            },
          },
          bucket: process.env.R2_BUCKET as string,
          config: {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
            region: process.env.R2_REGION || "auto",
            endpoint: process.env.R2_ENDPOINT as string,
            forcePathStyle: true,
          },
        }),
      ]
    : [],
});
