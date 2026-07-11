import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Download, Layers, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { ResourceTypeNav } from "@/components/resources/ResourceTypeNav";
import { Button } from "@/components/ui/Button";
import { resourceTypes } from "@/lib/content";
import { getResourceLibrary } from "@/lib/resources";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free templates, AI prompts, checklists, and toolkits for social media marketers.",
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ResourcesPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const all = await getResourceLibrary();
  const active =
    type && resourceTypes.includes(type as (typeof resourceTypes)[number]) ? type : "All";

  const filtered =
    active === "All" ? all : all.filter((r) => r.type === active);

  const counts: Record<string, number> = { All: all.length };
  for (const r of all) {
    counts[r.type] = (counts[r.type] || 0) + 1;
  }

  // Group by type when showing all
  const groups =
    active === "All"
      ? resourceTypes
          .filter((t) => t !== "All")
          .map((t) => ({
            type: t,
            items: all.filter((r) => r.type === t),
          }))
          .filter((g) => g.items.length > 0)
      : [{ type: active, items: filtered }];

  const freeCount = all.filter((r) => r.free).length;

  return (
    <>
      {/* Utility hero — not blog-style editorial */}
      <section className="border-b border-white/10 bg-ink pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide py-10 sm:py-12 md:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
                <Layers className="h-3 w-3" />
                Resource library
              </div>
              <h1 className="mt-4 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                Marketing tools & downloads
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
                Practical files for planning, AI, audits, and portfolios. Grab what you need,
                use it on real work this week.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-sm">
                <div>
                  <p className="font-display text-2xl text-white">{all.length}</p>
                  <p className="text-xs text-white/40">tools in library</p>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <p className="font-display text-2xl text-mint">{freeCount}</p>
                  <p className="text-xs text-white/40">free downloads</p>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <p className="font-display text-2xl text-white">PDF + sheets</p>
                  <p className="text-xs text-white/40">formats included</p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col justify-between rounded-xl border border-white/10 bg-deep-blue p-5 sm:p-6 lg:w-[320px] lg:shrink-0">
              <div>
                <Mail className="h-5 w-5 text-baby-blue" />
                <p className="mt-3 font-display text-lg text-white">New tools by email</p>
                <p className="mt-2 text-sm text-white/65">
                  Get notified when we drop templates and prompt packs.
                </p>
              </div>
              <div className="mt-5">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library body: sidebar filters + download list */}
      <section className="bg-near-black pb-16 pt-8 sm:pb-24 sm:pt-10 md:pb-28">
        <div className="container-wide">
          {/* Mobile type filter */}
          <div className="mb-6 lg:hidden">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
              Filter by type
            </p>
            <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-white/5" />}>
              <ResourceTypeNav counts={counts} orientation="horizontal" />
            </Suspense>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-xl border border-white/10 bg-ink p-4">
                <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Categories
                </p>
                <Suspense fallback={null}>
                  <ResourceTypeNav counts={counts} orientation="vertical" />
                </Suspense>
                <div className="mt-6 border-t border-white/10 px-3 pt-5">
                  <p className="text-xs text-white/45">
                    Prefer live training?
                  </p>
                  <Button href="/apply" className="mt-3 w-full text-xs">
                    Apply to cohort
                  </Button>
                </div>
              </div>
            </aside>

            {/* Download list */}
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-lg text-white sm:text-xl">
                    {active === "All" ? "All downloads" : active}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {filtered.length} file{filtered.length === 1 ? "" : "s"} · click to open &
                    request by email
                  </p>
                </div>
                <Link
                  href={site.whatsappInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-baby-blue transition hover:text-white"
                >
                  Ask in WhatsApp →
                </Link>
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
                  <p className="font-display text-lg text-white">Nothing in this category</p>
                  <p className="mt-2 text-sm text-white/45">Try another type from the filters.</p>
                  <Button href="/resources" variant="secondary" className="mt-6">
                    Show all tools
                  </Button>
                </div>
              ) : active === "All" ? (
                <div className="space-y-10">
                  {groups.map((group) => (
                    <div key={group.type}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                          {group.type}
                        </h3>
                        <Link
                          href={`/resources?type=${encodeURIComponent(group.type)}`}
                          className="text-xs text-baby-blue hover:text-white"
                        >
                          View only →
                        </Link>
                      </div>
                      <div className="space-y-2.5">
                        {group.items.map((resource) => (
                          <ResourceRow key={resource.slug} resource={resource} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filtered.map((resource) => (
                    <ResourceRow key={resource.slug} resource={resource} />
                  ))}
                </div>
              )}

              {/* Utility footer strip — not blog newsletter clone */}
              <div className="mt-12 grid gap-4 rounded-xl border border-white/10 bg-ink p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-deep-blue text-white">
                    <Download className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base text-white sm:text-lg">
                      How downloads work
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Open a tool, enter your email, and we send the file. Free for the community.
                    </p>
                  </div>
                </div>
                <Button href="/resources/content-calendar-system" variant="secondary" className="sm:shrink-0">
                  Try a free template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
