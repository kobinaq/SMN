import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import Image from "next/image";
import { Band, Checklist, CtaBand, DefinitionGrid, Kicker, Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { instructor } from "@/lib/content";
import { img } from "@/lib/images";
import { RenderBlocks } from "@/components/page-blocks/RenderBlocks";
import { chooseSource, cmsMetadata, getCachedPublishedPage } from "@/lib/cms-pages";
import { aboutApproach, aboutAudience, aboutClose, aboutFounder, aboutHero, aboutSeo } from "@/lib/pages/about";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const cms = await getCachedPublishedPage("about");
  return withDefaultShareImages(chooseSource(cms) === "cms" ? cmsMetadata(cms, metadata) : metadata, parent);
}

const metadata: Metadata = {
  title: { absolute: aboutSeo.title },
  description: aboutSeo.description,
  alternates: { canonical: "/about" },
  openGraph: { title: aboutSeo.title, description: aboutSeo.description, url: "/about" },
};

export default async function AboutPage() {
  // A published CMS page wins outside production. Production gets null here and renders code.
  const cms = await getCachedPublishedPage("about");
  if (chooseSource(cms) === "cms") return <RenderBlocks blocks={cms?.layout} />;
  return (
    <>
      <Masthead
        image={img.aboutMission}
        alt="Instructor presenting to a room of learners"
        kicker={aboutHero.kicker}
        title={aboutHero.title}
        lede={aboutHero.lede}
        actions={<Button href={aboutHero.ctaHref}>{aboutHero.ctaLabel}</Button>}
      />

      <Band id="founder" size="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Kicker>{aboutFounder.kicker}</Kicker>
            <h2 className="mt-5 font-display display-2 text-text-1">{aboutFounder.heading}</h2>
            <p className="mt-4 text-sm text-text-1">
              {aboutFounder.name}
              <span className="mx-2 text-edge-strong">·</span>
              <span className="text-text-3">{aboutFounder.role}</span>
            </p>
            <h3 className="mt-8 font-display text-2xl text-text-1">{aboutFounder.storyHeading}</h3>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-2 sm:text-base">
              {aboutFounder.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/4]">
            <Image
              src={instructor.image}
              alt={`${aboutFounder.name}, ${aboutFounder.role}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Band>

      <Band tone="raised" id="approach">
        <h2 className="font-display display-2 text-text-1">{aboutApproach.title}</h2>
        <DefinitionGrid className="mt-10" items={[...aboutApproach.items]} />
      </Band>

      <Band id="who">
        <h2 className="max-w-2xl font-display display-2 text-text-1">{aboutAudience.title}</h2>
        <Checklist className="mt-8 max-w-3xl" items={aboutAudience.items} />
      </Band>

      <CtaBand title={aboutClose.title} lede={aboutClose.lede} actions={<Button href={aboutClose.ctaHref}>{aboutClose.ctaLabel}</Button>} />
    </>
  );
}
