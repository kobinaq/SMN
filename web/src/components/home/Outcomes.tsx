import { Band, SectionHead, Sequence } from "@/components/site/kit";
import { homepageOutcomes } from "@/lib/content";

/** Tab 4 What you'll leave with, adjusted for Tab 5 claims. */
export function Outcomes() {
  return (
    <Band size="lg" fade>
      <SectionHead
        kicker="Outcomes"
        title="Don't just complete a programme. Leave ready for your next step."
        lede="Programmes emphasise practice, guided application and portfolio work. Strategy develops through experience, feedback and continued work."
      />
      <Sequence className="mt-12" items={homepageOutcomes} />
    </Band>
  );
}
