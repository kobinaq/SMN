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
import { Mentors } from "./collections/Mentors";
import { MentorshipRequests } from "./collections/MentorshipRequests";
import { MentorshipRelationships } from "./collections/MentorshipRelationships";
import { OpportunitySources } from "./collections/OpportunitySources";
import { Opportunities } from "./collections/Opportunities";
import { OpportunityApplications } from "./collections/OpportunityApplications";
import { Enrollments } from "./collections/Enrollments";
import { LearningItems } from "./collections/LearningItems";
import { Progress } from "./collections/Progress";
import { LmsCourses } from "./collections/LmsCourses";
import { LmsModules } from "./collections/LmsModules";
import { LmsLessons } from "./collections/LmsLessons";
import { LmsLessonProgress } from "./collections/LmsLessonProgress";
import { Portfolios } from "./collections/Portfolios";
import { Certificates } from "./collections/Certificates";
import { AuditEvents } from "./collections/AuditEvents";
import { MemberNotes } from "./collections/MemberNotes";
import { AICollections } from "./collections/AI";
import { SiteSettings } from "./globals/SiteSettings";
import { createDbAdapter } from "./lib/db";
import { validateProductionEnv } from "./lib/env";
import { getServerURL } from "./lib/server-url";
import { isR2Configured } from "./lib/storage";
import { enforceStaffPermissions } from "./lib/admin-permission-config";

validateProductionEnv();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const r2Enabled = isR2Configured();
const serverURL = getServerURL();
const csrfOrigins = Array.from(
  new Set(
    [
      serverURL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
      process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "",
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "",
    ].filter(Boolean),
  ),
);

export default buildConfig({
  serverURL,
  cookiePrefix: "smn-admin",
  // Allow admin cookies / server actions from deployment origins
  csrf: csrfOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "SMN CMS",
      description: "Social Marketers Network content and member administration",
      titleSuffix: " · SMN",
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
      beforeNavLinks: ["@/components/payload/AdminWorkspaceNav"],
      beforeLogin: ["@/components/payload/LoginIntro"],
      afterLogin: ["@/components/payload/LoginHelp"],
      views: {
        dashboard: {
          Component: "@/components/payload/AdminDashboard",
        },
        courseBuilder: {
          Component: "@/components/payload/CourseBuilder",
          path: "/course-builder",
          exact: true,
        },
        member360: { Component: "@/components/payload/Member360", path: "/member-360", exact: true },
        mentorshipOperations: { Component: "@/components/payload/MentorshipOperations", path: "/mentorship-operations", exact: true },
        opportunityOperations: { Component: "@/components/payload/OpportunityOperations", path: "/opportunity-operations", exact: true },
        certificateIssuing: { Component: "@/components/payload/CertificateIssuing", path: "/certificate-issuing", exact: true },
      },
      graphics: {
        Logo: "@/components/payload/Logo",
        Icon: "@/components/payload/Icon",
      },
    },
  },
  collections: enforceStaffPermissions([
    Users,
    Members,
    Mentors,
    MentorshipRequests,
    MentorshipRelationships,
    OpportunitySources,
    Opportunities,
    OpportunityApplications,
    Enrollments,
    LearningItems,
    Progress,
    LmsCourses,
    LmsModules,
    LmsLessons,
    LmsLessonProgress,
    Portfolios,
    Certificates,
    AuditEvents,
    MemberNotes,
    ...AICollections,
    Media,
    Posts,
    Courses,
    Events,
    Stories,
    Resources,
  ]),
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "smn-dev-secret-change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: createDbAdapter(),
  sharp,
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      alwaysInsertFields: true,
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
      // Disabled locally when R2 env vars are absent, but keeping the plugin in
      // the config makes the admin schema and import map environment-invariant.
      bucket: process.env.R2_BUCKET || "disabled-local",
      config: r2Enabled
        ? {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
            region: process.env.R2_REGION || "auto",
            endpoint: process.env.R2_ENDPOINT as string,
            forcePathStyle: true,
          }
        : { region: "auto" },
    }),
  ],
});
