import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Courses } from "./collections/Courses";
import { Events } from "./collections/Events";
import { Stories } from "./collections/Stories";
import { Resources } from "./collections/Resources";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · SMN CMS",
    },
  },
  collections: [Users, Media, Posts, Courses, Events, Stories, Resources],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "smn-dev-secret-change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      // Local: project payload.db. Vercel serverless FS is read-only except /tmp.
      url:
        process.env.DATABASE_URL ||
        (process.env.VERCEL
          ? "file:/tmp/payload.db"
          : `file:${path.resolve(dirname, "../payload.db")}`),
    },
    // Auto-create/update tables in local dev only
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
});
