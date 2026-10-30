import Link from "next/link";
import { Band, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import { homepageOfferings } from "@/lib/pages/home";

/** Doc Section 3 — three learning formats. */
export function LearningOfferings() {
  return (
    <Band tone="canvas" size="lg" fade id="learn-offerings">
      <SectionHead title={homepageOfferings.title} lede={homepageOfferings.lede} />
      <div data-stagger className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle lg:grid-cols-3">
        {homepageOfferings.items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            data-stagger-item
            className="group flex min-h-11 flex-col bg-canvas p-7 transition-colors hover:bg-raised sm:p-8"
          >
            <p className="eyebrow text-accent">{item.meta}</p>
            <h3 className="mt-3 font-display text-2xl text-text-1 transition-colors group-hover:text-accent">
              {item.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
            <p className="mt-4 text-xs leading-relaxed text-text-3">{item.audience}</p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
              {item.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </Band>
  );
}
