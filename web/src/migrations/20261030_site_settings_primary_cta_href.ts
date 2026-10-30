import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Homepage primary CTA href — admin is the source of truth for the public hero.
 * Also seeds the singleton site_settings row when none exists so CMS and public match.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "homepage_primary_cta_href" varchar DEFAULT '/learn';

    INSERT INTO "site_settings" (
      "id",
      "site_name",
      "tagline",
      "description",
      "ops_email",
      "whatsapp_invite",
      "social_instagram",
      "social_linkedin",
      "social_twitter",
      "announcement_banner",
      "footer_blurb",
      "homepage_headline",
      "homepage_supporting_copy",
      "homepage_primary_cta_label",
      "homepage_primary_cta_href",
      "homepage_secondary_cta_label",
      "homepage_secondary_cta_href",
      "created_at",
      "updated_at"
    )
    SELECT
      1,
      'Think Social Academy',
      'Learn. Apply. Grow. Connect.',
      'Think Social Academy is a social media marketing academy and community focused on thoughtful learning, practical application, and work designed to support brand and business results.',
      'info@socialmarketersnetwork.com',
      'https://chat.whatsapp.com/socialmarketers',
      'https://instagram.com/socialmarketersnetwork',
      'https://linkedin.com/company/social-marketers-network',
      'https://x.com/smn_africa',
      '',
      'Think Social Academy - a social media marketing academy teaching strategy, content, AI tools, and practical application.',
      'Learn the skills to deliver results for any brand or business using social media.',
      'Learn social media marketing, execute smarter and leave with real experience to become opportunity-ready. Whether you are starting out, building on existing experience, or developing your team''s capabilities, TSA gives you a structured, practical training in one of the most in-demand areas of digital skills.',
      'Explore our programmes',
      '/learn',
      'Apply for the next cohort',
      '/apply',
      NOW(),
      NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "site_settings" LIMIT 1);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "homepage_primary_cta_href";
  `);
}
