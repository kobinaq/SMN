import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Additive and idempotent only. Phase 1B data model for Courses, Cohorts and
 * the One-on-One product.
 *
 * - `courses` is evolved in place (it has no rows on dev or prod). Every
 *   existing column stays. New: `certificate_enabled` and `courses_who_its_for`.
 * - New `cohorts` table with its status enum.
 * - New `one_on_one` global table, plus its array and relationship tables.
 *
 * payload_locked_documents_rels only exists when document locking is enabled,
 * so the statements touching it are conditional on the table being present.
 *
 * `down` is intentionally empty. Production and dev can share one database,
 * and a rollback that removes these objects is not safe to leave in the file.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "certificate_enabled" boolean DEFAULT true;

    CREATE TABLE IF NOT EXISTS "courses_who_its_for" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "courses_who_its_for"
        ADD CONSTRAINT "courses_who_its_for_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "courses_who_its_for_order_idx" ON "courses_who_its_for" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "courses_who_its_for_parent_id_idx" ON "courses_who_its_for" USING btree ("_parent_id");

    DO $$ BEGIN
      CREATE TYPE "public"."enum_cohorts_status" AS ENUM('draft', 'open', 'full', 'running', 'finished');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "cohorts" (
      "id" serial PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL,
      "name" varchar NOT NULL,
      "starts_at" timestamp(3) with time zone NOT NULL,
      "ends_at" timestamp(3) with time zone,
      "application_deadline" timestamp(3) with time zone,
      "seats" numeric NOT NULL,
      "price" numeric,
      "currency" varchar DEFAULT 'GHS',
      "status" "public"."enum_cohorts_status" DEFAULT 'draft' NOT NULL,
      "meeting_url" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "cohorts"
        ADD CONSTRAINT "cohorts_course_id_courses_id_fk"
        FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "cohorts_course_idx" ON "cohorts" USING btree ("course_id");
    CREATE INDEX IF NOT EXISTS "cohorts_status_idx" ON "cohorts" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "cohorts_updated_at_idx" ON "cohorts" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "cohorts_created_at_idx" ON "cohorts" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "one_on_one" (
      "id" serial PRIMARY KEY NOT NULL,
      "duration_weeks" numeric DEFAULT 2,
      "days_per_week" numeric DEFAULT 4,
      "session_count" numeric DEFAULT 8,
      "price" numeric,
      "currency" varchar DEFAULT 'GHS',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "one_on_one_included" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "one_on_one_resources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "one_on_one_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "one_on_one_included"
        ADD CONSTRAINT "one_on_one_included_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."one_on_one"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "one_on_one_resources"
        ADD CONSTRAINT "one_on_one_resources_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."one_on_one"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "one_on_one_rels"
        ADD CONSTRAINT "one_on_one_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."one_on_one"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "one_on_one_rels"
        ADD CONSTRAINT "one_on_one_rels_users_fk"
        FOREIGN KEY ("users_id") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "one_on_one_included_order_idx" ON "one_on_one_included" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "one_on_one_included_parent_id_idx" ON "one_on_one_included" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "one_on_one_resources_order_idx" ON "one_on_one_resources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "one_on_one_resources_parent_id_idx" ON "one_on_one_resources" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "one_on_one_rels_order_idx" ON "one_on_one_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "one_on_one_rels_parent_idx" ON "one_on_one_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "one_on_one_rels_path_idx" ON "one_on_one_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "one_on_one_rels_users_id_idx" ON "one_on_one_rels" USING btree ("users_id");

    -- Document locking is disabled in the Payload config, so
    -- payload_locked_documents_rels does not exist in dev or prod. Every
    -- statement touching it is guarded and is skipped when the table is absent.
    -- This migration never creates that table.
    DO $$ BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cohorts_id" integer;

        CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cohorts_id_idx"
          ON "payload_locked_documents_rels" USING btree ("cohorts_id");

        BEGIN
          ALTER TABLE "payload_locked_documents_rels"
            ADD CONSTRAINT "payload_locked_documents_rels_cohorts_fk"
            FOREIGN KEY ("cohorts_id") REFERENCES "public"."cohorts"("id")
            ON DELETE cascade ON UPDATE no action;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
      END IF;
    END $$;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
