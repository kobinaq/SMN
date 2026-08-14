import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "cohort_applications" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "phone" varchar NOT NULL,
      "country" varchar NOT NULL,
      "role" varchar NOT NULL,
      "level" varchar NOT NULL,
      "linkedin" varchar,
      "portfolio" varchar,
      "goals" varchar NOT NULL,
      "source" varchar,
      "status" varchar DEFAULT 'received' NOT NULL,
      "member_id" integer,
      "staff_notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "cohort_applications_email_idx" ON "cohort_applications" ("email");
    CREATE INDEX IF NOT EXISTS "cohort_applications_created_at_idx" ON "cohort_applications" ("created_at");
    CREATE INDEX IF NOT EXISTS "cohort_applications_updated_at_idx" ON "cohort_applications" ("updated_at");

    DO $$ BEGIN
      ALTER TABLE "cohort_applications"
        ADD CONSTRAINT "cohort_applications_member_id_members_id_fk"
        FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    UPDATE "users" SET "role" = 'super-admin' WHERE "role" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "cohort_applications" CASCADE;
  `);
}
