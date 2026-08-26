import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Download } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { ResourceTypeNav } from "@/components/resources/ResourceTypeNav";
import { Button } from "@/components/ui/Button";
import { Band, Checklist, Masthead, Placeholder } from "@/components/site/kit";
import { resourceOfferings, seoTitle } from "@/lib/brand";
import { resourceTypes } from "@/lib/content";
import { getResourceLibrary } from "@/lib/resources";
import { getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Resources"),
  description:
    "Practical marketing resources you can actually use. Templates, frameworks, checklists, AI prompts, and guides from Social Marketers Network.",
  alternates: { canonical: "/resources" },
};

const TITLES: Record<string, { title: string; lede: string }> = {
  Template: {
    title: "Templates you can use this week.",
    lede: "Ready-to-use files for planning, content systems, and campaign work.",
  },
  Guide: {
    title: "Guides for clearer marketing work.",
    lede: "Step-by-step playbooks for positioning, content systems, and AI-assisted workflows.",
  },
};

/**
 * The whole library on one page. Templates and Guides were separate pages that
 * rendered this same list with one filter applied; they are `?type=` views now,
 * so the filter nav and the empty state are written once.
 */
export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const [site, all] = await Promise.all([getSiteSettings(), getResourceLibrary()]);
  const active =
    type && resourceTypes.includes(type as (typeof resourceTypes)[number]) ? type : "All";

  const filtered = active === "All" ? all : all.filter((item) => item.type === active);

  const counts: Record<string, number> = { All: all.length };
  for (const item of all) counts[item.type] = (counts[item.type] || 0) + 1;

  const groups =
    active === "All"
      ? resourceTypes
          .filter((item) => item !== "All")
          .map((item) => ({ type: item, items: all.filter((r) => r.type === item) }))
          .filter((group) => group.items.length > 0)
      : [{ type: active, items: filtered }];

  const heading = TITLES[active] ?? {
    title: "Marketing resources you can actually use.",
    lede: "Templates, frameworks, checklists, AI prompts, and guides. Free for the community — open one, enter your email, and we send the file.",
  };

  return (
    <>
      <Masthead
        kicker={active === "All" ? "Resources" : `Resources · ${active}`}
        title={heading.title}
        lede={heading.lede}
        meta={
          <span className="tnum">
            {all.length} {all.length === 1 ? "resource" : "resources"} in the library
          </span>
        }
      />

      <Band size="lg" bordered={false}>
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-text-3">Filter</p>
            <Suspense fallback={null}>
              <ResourceTypeNav counts={counts} orientation="vertical" />
            </Suspense>

            <p className="mt-10 eyebrow text-text-3">What is in here</p>
            <Checklist className="mt-3" tone="muted" items={resourceOfferings} />
          </aside>

          <div>
            <Suspense fallback={null}>
              <ResourceTypeNav counts={counts} />
            </Suspense>

            <div className="mt-8">
              {!filtered.length ? (
                <Placeholder
                  title={active === "All" ? "The library is being built" : `No ${active} yet`}
                  body={
                    all.length === 0
                      ? "New tools are shared with the community first. Join the WhatsApp group and we will send them as they land."
                      : "Nothing under this filter yet. Browse the rest of the library while we add more."
                  }
                  actions={
                    all.length === 0 ? (
                      <Button href={site.whatsappInvite} target="_blank" rel="noreferrer">
                        Join WhatsApp
                      </Button>
                    ) : (
                      <Button href="/resources" variant="secondary">
                        Show everything
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="space-y-12">
                  {groups.map((group) => (
                    <section key={group.type}>
                      {active === "All" ? (
                        <div className="mb-4 flex items-center justify-between gap-3 rule pt-4">
                          <h2 className="eyebrow text-text-3">{group.type}</h2>
                          <Link
                            href={`/resources?type=${encodeURIComponent(group.type)}`}
                            scroll={false}
                            className="link-wipe text-xs text-accent"
                          >
                            View only
                          </Link>
                        </div>
                      ) : null}
                      <div className="space-y-2.5">
                        {group.items.map((resource) => (
                          <ResourceRow key={resource.slug} resource={resource} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-14 grid gap-5 border border-edge-subtle bg-raised p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent-bg text-accent">
                  <Download className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg text-text-1">How downloads work</p>
                  <p className="mt-1 text-sm text-text-2">
                    Open a tool, enter your email, and we send the file. Free for the community.
                  </p>
                </div>
              </div>
              {all[0] ? (
                <Button href={`/resources/${all[0].slug}`} variant="secondary" className="sm:shrink-0">
                  Try a free template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="mt-8 border border-edge-subtle bg-raised p-6">
              <p className="font-display text-lg text-text-1">Get new tools by email</p>
              <p className="mt-1 text-sm text-text-2">
                One note when something useful lands. No drip sequence.
              </p>
              <div className="mt-5">
                <NewsletterForm />
              </div>
            </div>

            <p className="mt-10 text-sm text-text-3">
              Want the thinking behind the files? Read{" "}
              <Link href="/insights" className="link-wipe text-accent">
                Insights
              </Link>{" "}
              or{" "}
              <Link href="/programs/cohort" className="link-wipe text-accent">
                apply to live training
              </Link>
              .
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
