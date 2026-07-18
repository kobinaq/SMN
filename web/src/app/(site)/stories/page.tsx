import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStories } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Member stories",
  description: "Published member testimonials and outcomes from the Social Marketers Network.",
  alternates: { canonical: "/stories" },
};

export default async function StoriesPage() {
  const stories = await getStories();
  const [featured, ...rest] = stories;

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[78svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={img.communityHome}
            alt=""
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/88 to-near-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/50" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(70svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(78svh-7rem)] sm:pb-20">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Outcomes from people in the Network.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            Real progress from marketers learning, shipping, and growing with SMN.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href="/community" variant="secondary">
              Join the community
            </Button>
          </div>
        </div>
      </section>

      {featured ? (
        <section data-section-fade className="border-b border-white/10 bg-ink py-16 sm:py-24">
          <div className="container-wide grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="image-matte" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">Featured story</p>
              <blockquote className="mt-6 font-display text-2xl leading-snug text-white sm:text-3xl md:text-4xl md:leading-[1.2]">
                “{featured.quote}”
              </blockquote>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-display text-xl text-white">{featured.name}</p>
                <p className="mt-1 text-sm text-white/50">{featured.role}</p>
                {featured.programme ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">{featured.programme}</p>
                ) : null}
                {featured.portfolioUrl ? (
                  <a
                    href={featured.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm text-baby-blue transition hover:text-white"
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

      <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-28">
        <div className="container-wide">
          {rest.length ? (
            <>
              <div className="max-w-2xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">More voices</p>
                <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                  Marketers finding clarity, craft, and community.
                </h2>
              </div>
              <div data-stagger className="mt-12 columns-1 gap-6 md:columns-2 md:gap-8">
                {rest.map((story, index) => (
                  <figure
                    key={`${story.name}-${index}`}
                    data-stagger-item
                    className="mb-6 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface sm:mb-8 sm:rounded-[1.75rem]"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="image-matte" />
                    </div>
                    <div className="p-6 sm:p-7">
                      <blockquote className="text-[15px] leading-relaxed text-white/75">
                        “{story.quote}”
                      </blockquote>
                      <figcaption className="mt-5 border-t border-white/10 pt-4">
                        <p className="font-display text-lg text-white">{story.name}</p>
                        <p className="mt-0.5 text-sm text-white/45">{story.role}</p>
                        {story.programme ? (
                          <p className="mt-1 text-xs text-white/30">{story.programme}</p>
                        ) : null}
                        {story.portfolioUrl ? (
                          <a
                            href={story.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm text-baby-blue hover:text-white"
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
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <div className="absolute inset-0">
                <Image src={img.communityPortrait} alt="" fill className="object-cover opacity-40" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/80 to-near-black/60" />
              </div>
              <div className="relative px-6 py-16 text-center sm:px-10 sm:py-24">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Coming soon</p>
                <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl text-white sm:text-4xl">
                  Member stories are being prepared for publication.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
                  Apply to the next cohort and become part of the Network — your progress could be next.
                </p>
                <div className="btn-row-mobile mt-8 justify-center">
                  <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
                  <Button href="/community" variant="secondary">
                    Meet the community
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {(featured || rest.length > 0) && (
            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 sm:mt-20 md:flex-row md:items-end">
              <div className="max-w-lg">
                <h2 className="font-display text-3xl text-white">Write the next chapter with SMN.</h2>
                <p className="mt-3 text-sm text-white/55">
                  Join the flagship cohort or start in community — then ship work that proves you belong.
                </p>
              </div>
              <div className="btn-row-mobile">
                <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
                <Button href="/programs" variant="secondary">
                  Explore programmes
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
