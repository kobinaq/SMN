import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Marketing CMS fields: published testimonials, expanded site-settings.
 * Safe additive migration — does not invent public prices or publish seed stories.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories"
      ADD COLUMN IF NOT EXISTS "programme" varchar,
      ADD COLUMN IF NOT EXISTS "portfolio_url" varchar,
      ADD COLUMN IF NOT EXISTS "permission_confirmed" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT false;

    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "description" varchar,
      ADD COLUMN IF NOT EXISTS "announcement_banner" varchar,
      ADD COLUMN IF NOT EXISTS "footer_blurb" varchar,
      ADD COLUMN IF NOT EXISTS "homepage_headline" varchar,
      ADD COLUMN IF NOT EXISTS "homepage_supporting_copy" varchar,
      ADD COLUMN IF NOT EXISTS "homepage_primary_cta_label" varchar DEFAULT 'Apply for the next cohort',
      ADD COLUMN IF NOT EXISTS "homepage_secondary_cta_label" varchar DEFAULT 'Explore programmes',
      ADD COLUMN IF NOT EXISTS "homepage_secondary_cta_href" varchar DEFAULT '/programs',
      ADD COLUMN IF NOT EXISTS "cohort_application_deadline" varchar,
      ADD COLUMN IF NOT EXISTS "cohort_audience" varchar,
      ADD COLUMN IF NOT EXISTS "cohort_format" varchar,
      ADD COLUMN IF NOT EXISTS "cohort_price_confirmed" boolean DEFAULT false;

    CREATE TABLE IF NOT EXISTS "site_settings_impact_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL,
      "verified" boolean DEFAULT false
    );

    DO $$ BEGIN
      ALTER TABLE "site_settings_impact_stats"
        ADD CONSTRAINT "site_settings_impact_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_impact_stats_order_idx"
      ON "site_settings_impact_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_impact_stats_parent_id_idx"
      ON "site_settings_impact_stats" USING btree ("_parent_id");

    UPDATE "site_settings"
    SET "cohort_price_label" = 'Contact SMN for current fees',
        "cohort_price_confirmed" = false
    WHERE "cohort_price_label" ILIKE '%250%000%'
       OR "cohort_price_label" IS NULL
       OR "cohort_price_label" = '';

    UPDATE "stories" SET "published" = false, "permission_confirmed" = false
    WHERE "name" ILIKE '%demo%' OR "role" ILIKE '%fictional%';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_impact_stats" CASCADE;

    ALTER TABLE "stories"
      DROP COLUMN IF EXISTS "programme",
      DROP COLUMN IF EXISTS "portfolio_url",
      DROP COLUMN IF EXISTS "permission_confirmed",
      DROP COLUMN IF EXISTS "published";

    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "announcement_banner",
      DROP COLUMN IF EXISTS "footer_blurb",
      DROP COLUMN IF EXISTS "homepage_headline",
      DROP COLUMN IF EXISTS "homepage_supporting_copy",
      DROP COLUMN IF EXISTS "homepage_primary_cta_label",
      DROP COLUMN IF EXISTS "homepage_secondary_cta_label",
      DROP COLUMN IF EXISTS "homepage_secondary_cta_href",
      DROP COLUMN IF EXISTS "cohort_application_deadline",
      DROP COLUMN IF EXISTS "cohort_audience",
      DROP COLUMN IF EXISTS "cohort_format",
      DROP COLUMN IF EXISTS "cohort_price_confirmed";
  `);
}
