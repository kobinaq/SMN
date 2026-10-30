import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Band, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import type { ResourceItem } from "@/lib/content";

/**
 * Resources teaser. Lists a few published CMS resources and renders nothing
 * at all when there are none, so the home page never shows placeholder copy.
 */
export function ResourcesPreview({ resources }: { resources: ResourceItem[] }) {
  if (!resources.length) return null;

  return (
    <Band fade>
      <SectionHead
        align="stacked"
        kicker="Resources"
        title="Keep learning."
        lede="Practical resources to help you think, create and work better in social media marketing."
        actions={
          <Button href="/grow" variant="secondary">
            Explore Resources
          </Button>
        }
      />
      <ul className="mt-10 border-t border-edge-subtle">
        {resources.map((resource) => (
          <li key={resource.slug} className="border-b border-edge-subtle">
            <Link
              href={`/grow/${resource.slug}`}
              className="group grid min-h-11 gap-2 py-6 transition-colors hover:bg-raised sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:px-4"
            >
              <span>
                <span className="block font-display text-xl text-text-1 transition-colors group-hover:text-accent sm:text-2xl">
                  {resource.title}
                </span>
                <span className="mt-1 block text-sm text-text-3">
                  {resource.type}
                </span>
              </span>
              <span className="flex items-center gap-2 eyebrow text-text-3">
                Open
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
