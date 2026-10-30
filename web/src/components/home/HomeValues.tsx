import { Band, DefinitionGrid, SectionHead } from "@/components/site/kit";
import { homepageValues } from "@/lib/pages/home";

/** Doc Section 5 — teaching values. */
export function HomeValues() {
  return (
    <Band tone="canvas" size="lg" fade>
      <SectionHead title={homepageValues.title} />
      <div className="mt-10">
        <DefinitionGrid
          items={homepageValues.items.map((item) => ({
            title: item.title,
            body: item.body,
          }))}
        />
      </div>
    </Band>
  );
}
