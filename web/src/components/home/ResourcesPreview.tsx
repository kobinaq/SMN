import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Band, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import type { ResourceItem } from "@/lib/content";

/**
 * Resources teaser. Empty CMS: neutral copy, no invented titles.
 * Populated CMS: list a few published resources.
 */
export function ResourcesPreview({ resources }: { resources: ResourceItem[] }) {
  return (
    <Band fade>
      <SectionHead
        align="stacked"
        kicker="Resources"
        title={resources.length ? "Keep learning." : "Resources are on the way."}
        lede={
          resources.length
            ? "Practical resources to help you think, create and work better in social media marketing."
            : "Templates, guides and tools will appear here as they are published. Nothing invented in the meantime."
        }
        actions={
          <Button href="/resources" variant="secondary">
            Explore Resources
          </Button>
        }
      />
      {resources.length ? (
        <ul className="mt-10 border-t border-edge-subtle">
          {resources.map((resource) => (
            <li key={resource.slug} className="border-b border-edge-subtle">
              <Link
                href={`/resources/${resource.slug}`}
                className="group grid min-h-11 gap-2 py-6 transition-colors hover:bg-raised sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:px-4"
              >
                <span>
                  <span className="block font-display text-xl text-text-1 transition-colors group-hover:text-accent sm:text-2xl">
                    {resource.title}
                  </span>
                  <span className="mt-1 block text-sm text-text-3">{resource.type}</span>
                </span>
                <span className="flex items-center gap-2 eyebrow text-text-3">
                  Open
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </Band>
  );
}
