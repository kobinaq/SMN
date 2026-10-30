import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/icons";
import { Band, SectionHead } from "@/components/site/kit";
import { homepageExplore } from "@/lib/content";

/** Tab 4 Explore TSA: Academy, Community, Partner, Resources. */
export function ExploreTsa() {
  return (
    <Band size="lg" fade>
      <SectionHead align="stacked" kicker="Explore TSA" title="Four ways to engage." />
      <div
        data-stagger
        className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle sm:grid-cols-2"
      >
        {homepageExplore.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            data-stagger-item
            className="group flex min-h-11 flex-col bg-canvas p-7 transition-colors hover:bg-raised sm:p-9"
          >
            <h3 className="font-display text-2xl text-text-1 transition-colors group-hover:text-accent">
              {item.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
              {item.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </Band>
  );
}
