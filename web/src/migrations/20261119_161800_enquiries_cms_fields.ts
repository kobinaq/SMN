import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Additive only. `npm run db:migrate:create` stopped on interactive enum
 * rename prompts because the July baseline snapshot is behind the hand-written
 * migrations (dropped collections such as learning_items). Shipping that diff
 * would rename and drop live tables. This file is the reviewed subset:
 * new tables, new columns, new enum values, new indexes.
 *
 * payload_locked_documents_rels only exists when document locking is enabled,
 * so the statements touching it are conditional on the table being present.
 *
 * `down` is intentionally empty. Production and dev can share one database,
 * and a rollback that drops these objects is not safe to leave in the file.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Social Media Strategy';
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Content Marketing & Planning';
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Platforms';
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Performance';
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Professional Development';

    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "status" "public"."enum_posts_status" DEFAULT 'published' NOT NULL;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_resources_category" AS ENUM(
        'Social Media Strategy',
        'Content Marketing & Planning',
        'AI',
        'Platforms',
        'Performance',
        'Professional Development'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_resources_format" AS ENUM(
        'Template',
        'Checklist',
        'Worksheet',
        'Planning tool',
        'Guide',
        'Prompt library',
        'Handbook',
        'Toolkit',
        'Download',
        'Link'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "category" "public"."enum_resources_category";
    ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "format" "public"."enum_resources_format";
    ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "external_url" varchar;

    -- No site_settings.agency_enabled: NEXT_PUBLIC_AGENCY_ENABLED is the Agency source of truth; the dev DB may keep an unused column from an earlier run.

    DO $$ BEGIN
      CREATE TYPE "public"."enum_enquiries_type" AS ENUM(
        'programme-social-media-marketing',
        'one-on-one-training',
        'organisational-training',
        'partnership',
        'contact',
        'newsletter'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'in-progress', 'closed');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "enquiries" (
      "id" serial PRIMARY KEY NOT NULL,
      "type" "public"."enum_enquiries_type" NOT NULL,
      "name" varchar,
      "email" varchar NOT NULL,
      "phone" varchar,
      "organisation" varchar,
      "message" varchar,
      "source_page" varchar,
      "status" "public"."enum_enquiries_status" DEFAULT 'new' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "enquiries_type_idx" ON "enquiries" USING btree ("type");
    CREATE INDEX IF NOT EXISTS "enquiries_email_idx" ON "enquiries" USING btree ("email");
    CREATE INDEX IF NOT EXISTS "enquiries_status_idx" ON "enquiries" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "enquiries_type_email_idx" ON "enquiries" USING btree ("type", "email");
    CREATE INDEX IF NOT EXISTS "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");

    -- Document locking is disabled in the Payload config, so
    -- payload_locked_documents_rels does not exist in dev or prod. Every
    -- statement touching it is guarded and is skipped when the table is absent.
    -- This migration never creates that table.
    DO $$ BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "enquiries_id" integer;

        CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enquiries_id_idx"
          ON "payload_locked_documents_rels" USING btree ("enquiries_id");

        IF to_regclass('public.enquiries') IS NOT NULL THEN
          BEGIN
            ALTER TABLE "payload_locked_documents_rels"
              ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk"
              FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id")
              ON DELETE cascade ON UPDATE no action;
          EXCEPTION WHEN duplicate_object THEN NULL;
          END;
        END IF;
      END IF;
    END $$;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
