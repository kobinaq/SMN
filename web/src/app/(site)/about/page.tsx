import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Band, Checklist, CtaBand, DefinitionGrid, Kicker, Masthead, SectionHead, Sequence } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/icons";
import { seoTitle } from "@/lib/brand";
import { instructor } from "@/lib/content";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
import {
  aboutClose,
  aboutEcosystem,
  aboutFounder,
  aboutHero,
  aboutMission,
  aboutOrigin,
  aboutPhilosophy,
  aboutVision,
  aboutWhyChoose,
} from "@/lib/pages/about";

export const metadata: Metadata = {
  title: seoTitle("About"),
  description:
    "Think Social Academy is a social media marketing academy and community. We believe people should learn how to think, not just what to post.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

/** Tab 4 "06 About" (ticket T10), with Tab 5 brand rules applied. */
export default function AboutPage() {
  return (
    <>
      <Masthead
        image={img.aboutMission}
        alt="Instructor presenting to a room of learners"
        imageClassName="object-cover object-[center_30%]"
        kicker={aboutHero.kicker}
        title={aboutHero.title}
        lede={aboutHero.lede}
        actions={
          <>
            <Button href={cta.explorePrograms.href}>{cta.explorePrograms.label}</Button>
            <Button href={cta.joinCommunity.href} variant="secondary">
              {cta.joinCommunity.label}
            </Button>
          </>
        }
      />

      <Band id="about-tsa" size="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Kicker>{aboutOrigin.kicker}</Kicker>
            <h2 className="mt-5 font-display display-2 text-text-1">{aboutOrigin.title}</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-2 sm:text-base">
              {aboutOrigin.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/4]">
              <Image
                src={img.instructorTeaching}
                alt="Arielle Adodo teaching a marketing session"
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={85}
              />
            </div>
          </div>
        </div>
      </Band>

      <Band tone="raised" id="mission">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker>Our mission</Kicker>
            <p className="mt-5 font-display display-3 text-text-1">{aboutMission}</p>
          </div>
          <div>
            <Kicker>Our vision</Kicker>
            <p className="mt-5 font-display display-3 text-text-1">{aboutVision}</p>
          </div>
        </div>
      </Band>

      <Band id="why-tsa" size="lg">
        <SectionHead
          kicker="Why choose TSA"
          title="Thoughtful learning. Practical application."
          lede="What we focus on, and why it matters for the work you will do."
        />
        <DefinitionGrid className="mt-12" columns={3} items={aboutWhyChoose} />
      </Band>

      <Band tone="raised" id="philosophy" size="lg">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <SectionHead
              align="stacked"
              kicker="Our learning philosophy"
              title="Learn. Apply. Grow. Connect."
              lede="Every TSA programme follows the same four stages, so learning turns into practice and practice keeps going after the programme ends."
            />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={img.courseGrowth}
              alt="Learners applying social media marketing concepts"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
          </div>
        </div>
        <Sequence className="mt-12" items={aboutPhilosophy} />
      </Band>

      <Band id="founder" size="lg">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28">
            <Image
              src={instructor.image}
              alt={`${aboutFounder.name}, ${aboutFounder.role}`}
              fill
              className="object-cover object-[center_15%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
          </div>
          <div>
            <Kicker>{aboutFounder.kicker}</Kicker>
            <h2 className="mt-5 font-display display-2 text-text-1">{aboutFounder.name}</h2>
            <p className="mt-2 text-sm text-text-3">{aboutFounder.role}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-2 sm:text-base">
              {aboutFounder.story.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-text-1" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <h3 className="mt-10 font-display text-xl text-text-1">Professional experience</h3>
            <Checklist className="mt-4" items={aboutFounder.experience} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer" variant="secondary">
                View LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </Band>

      <Band tone="raised" id="ecosystem">
        <SectionHead kicker="The Think Social ecosystem" title="Two arms, one way of thinking." align="stacked" />
        <div className="mt-10 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
          {aboutEcosystem.map((item) => {
            const photo =
              item.title === "Think Social Academy"
                ? { src: img.cohortSpotlight, alt: "Think Social Academy learning community" }
                : { src: img.storiesLounge, alt: "Think Social Agency storytelling and content work" };
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-11 flex-col bg-canvas transition-colors hover:bg-raised"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover object-[center_25%] transition duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    quality={85}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <p className="eyebrow text-accent">{item.tagline}</p>
                  <h3 className="mt-3 font-display text-2xl text-text-1">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
                  <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
                    {item.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Band>

      <CtaBand
        kicker={aboutClose.kicker}
        title={aboutClose.title}
        lede={aboutClose.lede}
        actions={
          <>
            <Button href={cta.explorePrograms.href} variant="light">
              {cta.explorePrograms.label}
            </Button>
            <Button href={cta.joinCommunity.href} variant="secondary">
              {cta.joinCommunity.label}
            </Button>
          </>
        }
      />
    </>
  );
}
