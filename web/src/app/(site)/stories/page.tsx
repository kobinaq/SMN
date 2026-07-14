import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { getStories } from "@/lib/cms";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Member stories",
  description: "Published member testimonials and outcomes from the Social Marketers Network.",
  alternates: { canonical: "/stories" },
};

export default async function StoriesPage() {
  const stories = await getStories();
  return (
    <>
      <PageHero
        eyebrow="Member stories"
        title="Outcomes from people in the Network."
        description="Only permissioned, published testimonials appear here. Seed or fictional quotes are not shown."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        {stories.length ? (
          <div className="container-wide grid gap-6 md:grid-cols-2">
            {stories.map((story) => (
              <figure
                key={story.name}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="image-matte" />
                </div>
                <div className="p-7">
                  <figcaption className="font-display text-2xl text-white">{story.name}</figcaption>
                  <p className="mt-1 text-sm text-white/50">{story.role}</p>
                  {story.programme ? (
                    <p className="mt-1 text-xs text-white/35">{story.programme}</p>
                  ) : null}
                  <blockquote className="mt-5 leading-relaxed text-white/75">
                    “{story.quote}”
                  </blockquote>
                  {story.portfolioUrl ? (
                    <a
                      href={story.portfolioUrl}
                      className="mt-4 inline-flex text-sm text-baby-blue hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View portfolio
                    </a>
                  ) : null}
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <div className="container-wide max-w-2xl rounded-[2rem] border border-dashed border-white/15 bg-surface p-8 text-center">
            <p className="text-sm text-white/60">
              No published member stories yet. When SMN confirms permissioned testimonials in
              Payload, they will appear here automatically.
            </p>
          </div>
        )}
        <div className="container-wide mt-12">
          <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
        </div>
      </section>
    </>
  );
}
