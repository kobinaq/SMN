import type { Metadata } from "next";
import { ResourceFilterPage } from "@/components/resources/ResourceFilterPage";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Guides"),
  description:
    "Practical marketing guides from Social Marketers Network for social, AI, and campaign work.",
  alternates: { canonical: "/resources/guides" },
};

export default function ResourceGuidesPage() {
  return (
    <ResourceFilterPage
      type="Guide"
      kicker="Resources · Guides"
      title="Guides for clearer marketing work."
      description="Step-by-step playbooks for positioning, content systems, and AI-assisted workflows."
      image={img.resWeekly}
      alt="Weekly operating notes for marketers"
      emptyTitle="Guides coming soon"
      emptyBody="Check Insights for articles, or browse the rest of the library."
    />
  );
}
