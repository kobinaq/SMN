import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Download } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { ResourceTypeNav } from "@/components/resources/ResourceTypeNav";
import { Button } from "@/components/ui/Button";
import { Band, Checklist, Masthead, Placeholder, SectionHead } from "@/components/site/kit";
import { seoTitle } from "@/lib/brand";
import { resourceTypes } from "@/lib/content";
import {
  resourceAccess,
  resourceCategories,
  resourceLibraryContents,
  resourcesHero,
} from "@/lib/pages/resources";
import { getResourceLibrary } from "@/lib/resources";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Resources"),
  description:
    "Keep learning with practical social media marketing resources from Think Social Academy: articles, guides, templates, tools, case studies and webinars.",
  alternates: { canonical: "/grow" },
  openGraph: { url: "/grow" },
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
 * Tab 4 "05 Resources" (ticket T9). The unfiltered view adds the Tab 4
 * categories and the public / member split above the library.
 *
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
  const [all] = await Promise.all([getResourceLibrary()]);
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

  const heading = TITLES[active] ?? { title: resourcesHero.title, lede: resourcesHero.lede };

  return (
    <>
      <Masthead
        kicker={active === "All" ? resourcesHero.kicker : `${resourcesHero.kicker} · ${active}`}
        title={heading.title}
        lede={heading.lede}
        meta={
          <span className="tnum">
            {all.length} {all.length === 1 ? "resource" : "resources"} in the library
          </span>
        }
      />

      {active === "All" ? (
        <>
          <Band id="categories">
            <SectionHead
              kicker="Categories"
              title="Find what you need."
              lede="Articles, guides, templates, tools, case studies and webinars. New material is added as it is published."
            />
            <div className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle sm:grid-cols-2 lg:grid-cols-3">
              {resourceCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group flex min-h-11 flex-col bg-canvas p-7 transition-colors hover:bg-raised"
                >
                  <h3 className="font-display text-xl text-text-1">{category.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-2">{category.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Browse {category.title.toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Band>

          <Band tone="raised" id="access">
            <div className="grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
              {[resourceAccess.public, resourceAccess.member].map((tier) => (
                <div key={tier.title} className="flex flex-col bg-canvas p-7 sm:p-9">
                  <h2 className="font-display display-3 text-text-1">{tier.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{tier.body}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href={tier.href} variant="secondary">
                      {tier.ctaLabel}
                    </Button>
                    {"secondaryHref" in tier ? (
                      <Button href={tier.secondaryHref} variant="ghost">
                        {tier.secondaryLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Band>
        </>
      ) : null}

      <Band id="library" size="lg" bordered={false} className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-text-3">Filter</p>
            <Suspense fallback={null}>
              <ResourceTypeNav counts={counts} orientation="vertical" />
            </Suspense>

            <p className="mt-10 eyebrow text-text-3">What is in here</p>
            <Checklist className="mt-3" tone="muted" items={resourceLibraryContents} />
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
                      ? "New tools are shared with the community first. Create your free account and we will share them as they land."
                      : "Nothing under this filter yet. Browse the rest of the library while we add more."
                  }
                  actions={
                    all.length === 0 ? (
                      <Button href="/signup">Create your free account</Button>
                    ) : (
                      <Button href="/grow" variant="secondary">
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
                            href={`/grow?type=${encodeURIComponent(group.type)}`}
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
                <Button href={`/grow/${all[0].slug}`} variant="secondary" className="sm:shrink-0">
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
              <Link href="/learn" className="link-wipe text-accent">
                explore our programmes
              </Link>
              .
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
