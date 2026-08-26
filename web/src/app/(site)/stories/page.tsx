import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/icons";
import { Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { getStories } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Member Stories"),
  description:
    "See what happens when learning becomes practice. Published member stories from Social Marketers Network.",
  alternates: { canonical: "/stories" },
};

export const revalidate = 60;

export default async function StoriesPage() {
  const stories = await getStories();
  const [featured, ...rest] = stories;

  return (
    <>
      <Masthead
        image={img.storiesLounge}
        alt="Members talking in the SMN lounge"
        kicker="Social Marketers Network"
        title="See what happens when learning becomes practice."
        lede="Our participants are not just completing programmes. They are building skills, portfolios, confidence, relationships, and experience."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href="/community" variant="secondary">
              Join the community
            </Button>
          </>
        }
      />

      {featured ? (
        <section data-section-fade className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
          <div className="container-wide grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            <div>
              <p className="eyebrow text-ai">
                Featured participant
              </p>
              <p className="mt-4 font-display text-sm tracking-[0.04em] text-text-3">
                Meet {featured.name}
              </p>
              <blockquote className="mt-4 font-display text-2xl leading-snug text-text-1 sm:text-3xl md:text-4xl md:leading-[1.2]">
                “{featured.quote}”
              </blockquote>
              <div className="mt-8 border-t border-edge-subtle pt-6">
                <p className="font-display text-xl text-text-1">{featured.name}</p>
                <p className="mt-1 text-sm text-text-3">{featured.role}</p>
                {featured.programme ? (
                  <p className="mt-1 eyebrow text-text-3">{featured.programme}</p>
                ) : null}
                {featured.portfolioUrl ? (
                  <a
                    href={featured.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-text-1"
                  >
                    View portfolio
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section data-section-fade className="bg-canvas py-16 sm:py-24 md:py-28">
        <div className="container-wide">
          {rest.length ? (
            <>
              <div className="max-w-2xl">
                <h2 className="font-display display-3 text-text-1">
                  Marketers building skills, portfolios, and experience.
                </h2>
              </div>
              <div data-stagger className="mt-12 columns-1 gap-6 md:columns-2 md:gap-8">
                {rest.map((story, index) => (
                  <figure
                    key={`${story.name}-${index}`}
                    data-stagger-item
                    className="mb-6 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-edge-subtle bg-raised sm:mb-8"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6 sm:p-7">
                      <blockquote className="text-[15px] leading-relaxed text-text-2">
                        “{story.quote}”
                      </blockquote>
                      <figcaption className="mt-5 border-t border-edge-subtle pt-4">
                        <p className="font-display text-lg text-text-1">{story.name}</p>
                        <p className="mt-0.5 text-sm text-text-3">{story.role}</p>
                        {story.programme ? (
                          <p className="mt-1 text-xs text-text-3">{story.programme}</p>
                        ) : null}
                        {story.portfolioUrl ? (
                          <a
                            href={story.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-text-1"
                          >
                            View portfolio
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </>
          ) : !featured ? (
            <div className="relative overflow-hidden border border-edge-subtle">
              <div className="absolute inset-0">
                <Image
                  src={img.storiesEmpty}
                  alt="Two SMN members"
                  fill
                  className="object-cover opacity-40"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/80 to-near-black/60" />
              </div>
              <div className="relative px-6 py-16 text-center sm:px-10 sm:py-24">
                <p className="eyebrow text-accent">Coming soon</p>
                <h2 className="mx-auto mt-4 max-w-xl font-display display-3 text-text-1">
                  Member stories are being prepared for publication.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-2">
                  Apply to the next cohort and become part of the Network. Your progress could be next.
                </p>
                <div className="btn-row-mobile mt-8 justify-center">
                  <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
                </div>
              </div>
            </div>
          ) : null}

          {(featured || rest.length > 0) && (
            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-edge-subtle pt-12 sm:mt-20 md:flex-row md:items-end">
              <div className="max-w-lg">
                <h2 className="font-display text-3xl text-text-1">Write the next chapter with SMN.</h2>
                <p className="mt-3 text-sm text-text-2">
                  Join the flagship cohort or start in community, then ship work that proves you belong.
                </p>
              </div>
              <div className="btn-row-mobile">
                <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
                <Button href="/community" variant="secondary">
                  Join the community
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
