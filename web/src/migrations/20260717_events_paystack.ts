import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * First-party events, Paystack payments, event registrations, catalogue checkout fields.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'published',
      ADD COLUMN IF NOT EXISTS "format" varchar DEFAULT 'online',
      ADD COLUMN IF NOT EXISTS "pricing" varchar DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS "amount" numeric,
      ADD COLUMN IF NOT EXISTS "currency" varchar DEFAULT 'GHS',
      ADD COLUMN IF NOT EXISTS "capacity" numeric,
      ADD COLUMN IF NOT EXISTS "venue" varchar,
      ADD COLUMN IF NOT EXISTS "address" varchar,
      ADD COLUMN IF NOT EXISTS "online_url" varchar,
      ADD COLUMN IF NOT EXISTS "starts_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "ends_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "host" varchar,
      ADD COLUMN IF NOT EXISTS "body" varchar;

    UPDATE "events" SET "starts_at" = "date" WHERE "starts_at" IS NULL AND "date" IS NOT NULL;
    UPDATE "events" SET "status" = 'published' WHERE "status" IS NULL;
    ALTER TABLE "events" ALTER COLUMN "registration_url" DROP NOT NULL;

    ALTER TABLE "courses"
      ADD COLUMN IF NOT EXISTS "amount" numeric,
      ADD COLUMN IF NOT EXISTS "currency" varchar DEFAULT 'GHS',
      ADD COLUMN IF NOT EXISTS "program_key" varchar,
      ADD COLUMN IF NOT EXISTS "delivery" varchar DEFAULT 'self-paced',
      ADD COLUMN IF NOT EXISTS "classroom_url" varchar,
      ADD COLUMN IF NOT EXISTS "lms_course_id" integer;
    ALTER TABLE "courses" ALTER COLUMN "selar_url" DROP NOT NULL;

    DO $$ BEGIN
      ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_source_check";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "event_registrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "event_id" integer NOT NULL,
      "member_id" integer NOT NULL,
      "status" varchar DEFAULT 'pending_payment' NOT NULL,
      "ticket_code" varchar,
      "paystack_reference" varchar,
      "amount_paid" numeric,
      "currency" varchar DEFAULT 'GHS',
      "registered_at" timestamp(3) with time zone,
      "checked_in_at" timestamp(3) with time zone,
      "checked_in_by_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "event_registrations_ticket_code_idx" ON "event_registrations" ("ticket_code");
    CREATE INDEX IF NOT EXISTS "event_registrations_event_idx" ON "event_registrations" ("event_id");
    CREATE INDEX IF NOT EXISTS "event_registrations_member_idx" ON "event_registrations" ("member_id");

    CREATE TABLE IF NOT EXISTS "payments" (
      "id" serial PRIMARY KEY NOT NULL,
      "kind" varchar NOT NULL,
      "member_id" integer NOT NULL,
      "amount" numeric NOT NULL,
      "currency" varchar DEFAULT 'GHS' NOT NULL,
      "status" varchar DEFAULT 'initialized' NOT NULL,
      "paystack_reference" varchar NOT NULL,
      "paystack_access_code" varchar,
      "event_id" integer,
      "catalogue_course_id" integer,
      "enrollment_id" integer,
      "event_registration_id" integer,
      "metadata" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "payments_paystack_reference_idx" ON "payments" ("paystack_reference");

    ALTER TABLE "lms_courses"
      ADD COLUMN IF NOT EXISTS "classroom_url" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payments" CASCADE;
    DROP TABLE IF EXISTS "event_registrations" CASCADE;
  `);
}
