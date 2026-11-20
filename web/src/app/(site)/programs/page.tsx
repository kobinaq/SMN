import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import { ProgramSections } from "@/components/programs/ProgramBlocks";
import { Band, Checklist, CtaBand, Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import {
  programFaqs,
  programs,
  programsClose,
  programsHero,
  programsSeo,
  whyLearn,
} from "@/lib/pages/programs";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withDefaultShareImages(metadata, parent);
}

const metadata: Metadata = {
  title: { absolute: programsSeo.title },
  description: programsSeo.description,
  alternates: { canonical: "/programs" },
  openGraph: { title: programsSeo.title, description: programsSeo.description, url: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <Masthead
        kicker="Programs"
        title={programsHero.title}
        lede={programsHero.lede}
        actions={
          <Button href={programsHero.ctaHref}>{programsHero.ctaLabel}</Button>
        }
      />

      <div id="programs">
        {programs.map((program) => (
          <ProgramSections key={program.id} program={program} />
        ))}
      </div>

      <Band tone="raised">
        <h2 className="font-display display-2 text-text-1">{whyLearn.title}</h2>
        <Checklist className="mt-8 max-w-3xl" items={whyLearn.items} />
      </Band>

      <Band>
        <h2 className="font-display display-2 text-text-1">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-edge-subtle border-y border-edge-subtle">
          {programFaqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer font-display text-xl text-text-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Band>

      <CtaBand
        title={programsClose.title}
        lede={programsClose.body}
        actions={<Button href={programsClose.ctaHref}>{programsClose.ctaLabel}</Button>}
      />
    </>
  );
}
