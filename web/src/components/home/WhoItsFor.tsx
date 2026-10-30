import { Band, DefinitionGrid, SectionHead } from "@/components/site/kit";
import { homepageAudience } from "@/lib/pages/home";

/** Doc Section 4 — audience. */
export function WhoItsFor() {
  return (
    <Band tone="raised" size="lg" fade>
      <SectionHead title={homepageAudience.title} />
      <div className="mt-10">
        <DefinitionGrid
          items={homepageAudience.items.map((item) => ({
            title: item.title,
            body: item.body,
          }))}
        />
      </div>
    </Band>
  );
}
