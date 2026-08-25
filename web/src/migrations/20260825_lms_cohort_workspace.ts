import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Adds the in-app cohort workspace: live sessions (with a resources sub-table),
 * an attendance register that drives cohort completion, announcements, and a
 * per-cohort discussion board. Additive only — no existing tables are touched.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_lms_sessions_status" AS ENUM('draft', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_lms_attendance_status" AS ENUM('present', 'late', 'excused', 'absent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_lms_announcements_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_lms_discussion_posts_author_role" AS ENUM('member', 'staff'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_lms_discussion_posts_status" AS ENUM('visible', 'hidden'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "lms_sessions_resources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "file_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_sessions" (
      "id" serial PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL,
      "title" varchar NOT NULL,
      "summary" varchar,
      "session_at" timestamp(3) with time zone NOT NULL,
      "duration_minutes" numeric,
      "join_url" varchar,
      "recording_url" varchar,
      "order" numeric DEFAULT 0,
      "status" "enum_lms_sessions_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_attendance" (
      "id" serial PRIMARY KEY NOT NULL,
      "session_id" integer NOT NULL,
      "course_id" integer NOT NULL,
      "member_id" integer NOT NULL,
      "status" "enum_lms_attendance_status" DEFAULT 'present' NOT NULL,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_announcements" (
      "id" serial PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL,
      "pinned" boolean DEFAULT false,
      "author_id" integer,
      "published_at" timestamp(3) with time zone,
      "status" "enum_lms_announcements_status" DEFAULT 'published' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_discussion_posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL,
      "body" varchar NOT NULL,
      "author_member_id" integer,
      "author_staff_id" integer,
      "author_name" varchar,
      "author_role" "enum_lms_discussion_posts_author_role",
      "status" "enum_lms_discussion_posts_status" DEFAULT 'visible' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "lms_sessions_resources" ADD CONSTRAINT "lms_sessions_resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_sessions_resources" ADD CONSTRAINT "lms_sessions_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_sessions"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_sessions" ADD CONSTRAINT "lms_sessions_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_attendance" ADD CONSTRAINT "lms_attendance_session_id_lms_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."lms_sessions"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_attendance" ADD CONSTRAINT "lms_attendance_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_attendance" ADD CONSTRAINT "lms_attendance_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_announcements" ADD CONSTRAINT "lms_announcements_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_announcements" ADD CONSTRAINT "lms_announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_discussion_posts" ADD CONSTRAINT "lms_discussion_posts_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_discussion_posts" ADD CONSTRAINT "lms_discussion_posts_author_member_id_members_id_fk" FOREIGN KEY ("author_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_discussion_posts" ADD CONSTRAINT "lms_discussion_posts_author_staff_id_users_id_fk" FOREIGN KEY ("author_staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "lms_sessions_resources_order_idx" ON "lms_sessions_resources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "lms_sessions_resources_parent_id_idx" ON "lms_sessions_resources" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "lms_sessions_resources_file_idx" ON "lms_sessions_resources" USING btree ("file_id");
    CREATE INDEX IF NOT EXISTS "lms_sessions_course_idx" ON "lms_sessions" USING btree ("course_id");
    CREATE INDEX IF NOT EXISTS "lms_sessions_updated_at_idx" ON "lms_sessions" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "lms_sessions_created_at_idx" ON "lms_sessions" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "lms_attendance_session_idx" ON "lms_attendance" USING btree ("session_id");
    CREATE INDEX IF NOT EXISTS "lms_attendance_course_idx" ON "lms_attendance" USING btree ("course_id");
    CREATE INDEX IF NOT EXISTS "lms_attendance_member_idx" ON "lms_attendance" USING btree ("member_id");
    CREATE INDEX IF NOT EXISTS "lms_attendance_updated_at_idx" ON "lms_attendance" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "lms_attendance_created_at_idx" ON "lms_attendance" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "lms_announcements_course_idx" ON "lms_announcements" USING btree ("course_id");
    CREATE INDEX IF NOT EXISTS "lms_announcements_author_idx" ON "lms_announcements" USING btree ("author_id");
    CREATE INDEX IF NOT EXISTS "lms_announcements_updated_at_idx" ON "lms_announcements" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "lms_announcements_created_at_idx" ON "lms_announcements" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "lms_discussion_posts_course_idx" ON "lms_discussion_posts" USING btree ("course_id");
    CREATE INDEX IF NOT EXISTS "lms_discussion_posts_author_member_idx" ON "lms_discussion_posts" USING btree ("author_member_id");
    CREATE INDEX IF NOT EXISTS "lms_discussion_posts_author_staff_idx" ON "lms_discussion_posts" USING btree ("author_staff_id");
    CREATE INDEX IF NOT EXISTS "lms_discussion_posts_updated_at_idx" ON "lms_discussion_posts" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "lms_discussion_posts_created_at_idx" ON "lms_discussion_posts" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "lms_sessions_resources" CASCADE;
    DROP TABLE IF EXISTS "lms_attendance" CASCADE;
    DROP TABLE IF EXISTS "lms_announcements" CASCADE;
    DROP TABLE IF EXISTS "lms_discussion_posts" CASCADE;
    DROP TABLE IF EXISTS "lms_sessions" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_lms_sessions_status";
    DROP TYPE IF EXISTS "public"."enum_lms_attendance_status";
    DROP TYPE IF EXISTS "public"."enum_lms_announcements_status";
    DROP TYPE IF EXISTS "public"."enum_lms_discussion_posts_author_role";
    DROP TYPE IF EXISTS "public"."enum_lms_discussion_posts_status";
  `);
}
