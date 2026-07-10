import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { getStories } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Stories from people in the Network.",
};

export default async function StoriesPage() {
  const stories = await getStories();
  return (
    <>
      <PageHero
        eyebrow="Success stories"
        title="Real people. Real progress."
        description="What happens when solid learning meets a strong community."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <figure
              key={story.name}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface"
            >
              <div className="relative aspect-[4/3]">
                <Image src={story.image} alt={story.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-7">
                <figcaption className="font-display text-2xl text-white">{story.name}</figcaption>
                <p className="mt-1 text-sm text-white/50">{story.role}</p>
                <blockquote className="mt-5 text-white/75 leading-relaxed">“{story.quote}”</blockquote>
              </div>
            </figure>
          ))}
        </div>
        <div className="container-wide mt-12">
          <Button href="/apply">Apply to the cohort</Button>
        </div>
      </section>
    </>
  );
}
