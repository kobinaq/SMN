import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { Button } from "@/components/ui/Button";
import { getResourceLibrary } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Free marketing templates from Social Marketers Network — calendars, briefs, audits, and planning sheets.",
  alternates: { canonical: "/resources/templates" },
};

export default async function ResourceTemplatesPage() {
  const all = await getResourceLibrary();
  const items = all.filter((r) => r.type === "Template");

  return (
    <>
      <section className="border-b border-white/10 bg-ink pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide py-10 sm:py-12 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
            <FileText className="h-3 w-3" />
            Resources · Templates
          </div>
          <h1 className="mt-4 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
            Marketing templates
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            Ready-to-use files for planning, content systems, and campaign work. Download what you
            need and put it into practice this week.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/resources" className="text-baby-blue hover:text-white">
              All free resources →
            </Link>
            <Link href="/resources/guides" className="text-white/50 hover:text-white">
              Guides →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-10 sm:py-14 md:py-16">
        <div className="container-wide">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
              <p className="font-display text-lg text-white">Templates coming soon</p>
              <p className="mt-2 text-sm text-white/45">Browse the full library meanwhile.</p>
              <Button href="/resources" variant="secondary" className="mt-6">
                View all resources
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((resource) => (
                <ResourceRow key={resource.slug} resource={resource} />
              ))}
            </div>
          )}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-white/50">Want live training with these tools?</p>
            <Button href="/apply" variant="secondary">
              Apply to cohort
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
