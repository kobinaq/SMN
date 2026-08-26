import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, SectionHead } from "@/components/site/kit";
import { excerptStoryQuote } from "@/lib/content";

type HomeStoryItem = {
  name: string;
  role: string;
  programme?: string | null;
  quote: string;
  image: string;
};

/** Members in their own words. The quote leads at display size; the person
 *  follows underneath, because the claim matters more than the headshot. */
export function Testimonials({ stories }: { stories: HomeStoryItem[] }) {
  if (!stories.length) return null;

  return (
    <Band tone="raised" size="lg" fade>
      <SectionHead
        kicker="In their words"
        title="What members say"
        lede="Written by people who finished the work, not by us."
        actions={
          <Button href="/stories" variant="secondary">
            Member stories
          </Button>
        }
      />
      <div data-stagger className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
        {stories.map((story) => (
          <figure key={story.name} data-stagger-item className="flex flex-col bg-canvas p-7 sm:p-9">
            <blockquote className="font-display text-xl leading-snug text-text-1 sm:text-2xl">
              &ldquo;{excerptStoryQuote(story.quote)}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-4 rule pt-6 mt-8">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={story.image} alt="" fill className="object-cover" sizes="44px" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-text-1">{story.name}</span>
                <span className="block text-sm text-text-3">{story.role}</span>
                {story.programme ? (
                  <span className="mt-0.5 block eyebrow text-text-3">{story.programme}</span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Band>
  );
}
