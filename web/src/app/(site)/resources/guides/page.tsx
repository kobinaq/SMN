import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { Button } from "@/components/ui/Button";
import { getResourceLibrary } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical marketing guides from Social Marketers Network — how-tos for social, AI, and campaign work.",
  alternates: { canonical: "/resources/guides" },
};

export default async function ResourceGuidesPage() {
  const all = await getResourceLibrary();
  const items = all.filter((r) => r.type === "Guide");

  return (
    <>
      <section className="border-b border-white/10 bg-ink pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide py-10 sm:py-12 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
            <BookOpen className="h-3 w-3" />
            Resources · Guides
          </div>
          <h1 className="mt-4 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
            Marketing guides
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            Step-by-step playbooks for modern marketing work — from positioning and content systems
            to AI-assisted workflows.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/resources" className="text-baby-blue hover:text-white">
              All free resources →
            </Link>
            <Link href="/resources/templates" className="text-white/50 hover:text-white">
              Templates →
            </Link>
            <Link href="/insights" className="text-white/50 hover:text-white">
              Insights →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-10 sm:py-14 md:py-16">
        <div className="container-wide">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
              <p className="font-display text-lg text-white">Guides coming soon</p>
              <p className="mt-2 text-sm text-white/45">
                Check Insights for articles, or browse templates and toolkits.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/insights" variant="secondary">
                  Read Insights
                </Button>
                <Button href="/resources">View all resources</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((resource) => (
                <ResourceRow key={resource.slug} resource={resource} />
              ))}
            </div>
          )}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-white/50">Prefer a structured learning path?</p>
            <Button href="/programs" variant="secondary">
              Explore the Academy
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
