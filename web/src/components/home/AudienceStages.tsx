import { Band, SectionHead } from "@/components/site/kit";
import { audienceStages } from "@/lib/brand";

/**
 * Who the network is for. Rendered as a divided grid rather than floating
 * cards — the hairlines make it read as one table of audiences instead of
 * four unrelated pitches.
 */
export function AudienceStages() {
  return (
    <Band size="lg" fade>
      <SectionHead
        kicker="Who it is for"
        title="Built for marketers at different stages."
        lede="You do not need a marketing degree or an existing job in the field. You do need to be ready to do the work."
      />
      <div
        data-stagger
        className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2"
      >
        {audienceStages.map((item) => (
          <div key={item.title} data-stagger-item className="bg-canvas p-7 sm:p-9">
            <h3 className="font-display text-2xl text-text-1">{item.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
          </div>
        ))}
      </div>
    </Band>
  );
}
