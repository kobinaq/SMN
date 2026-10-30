import { Button } from "@/components/ui/Button";
import { Band, SectionHead } from "@/components/site/kit";
import { homepageGrow } from "@/lib/pages/home";

/** Doc Section 7 — Grow hub teaser. Always shows; articles load from CMS elsewhere. */
export function GrowPreview() {
  return (
    <Band tone="raised" size="lg" fade>
      <SectionHead
        kicker="Grow"
        title={homepageGrow.title}
        lede={homepageGrow.body}
        actions={
          <Button href={homepageGrow.ctaHref} variant="secondary">
            {homepageGrow.ctaLabel}
          </Button>
        }
      />
      <ul className="mt-10 flex flex-wrap gap-2">
        {homepageGrow.topics.map((topic) => (
          <li
            key={topic}
            className="border border-edge-subtle px-3 py-2 text-xs text-text-2 sm:text-sm"
          >
            {topic}
          </li>
        ))}
      </ul>
    </Band>
  );
}
