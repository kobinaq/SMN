import type { Metadata } from "next";
import { ResourceFilterPage } from "@/components/resources/ResourceFilterPage";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Templates"),
  description:
    "Free marketing templates from Social Marketers Network: calendars, briefs, audits, and planning sheets.",
  alternates: { canonical: "/resources/templates" },
};

export default function ResourceTemplatesPage() {
  return (
    <ResourceFilterPage
      type="Template"
      kicker="Resources · Templates"
      title="Marketing templates you can use this week."
      description="Ready-to-use files for planning, content systems, and campaign work."
      image={img.resCalendar}
      alt="Content calendar planning sheet"
      emptyTitle="Templates coming soon"
      emptyBody="Browse the full library while this filter is empty."
    />
  );
}
