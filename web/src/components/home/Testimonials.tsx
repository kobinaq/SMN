import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { excerptStoryQuote } from "@/lib/content";

type HomeStoryItem = {
  name: string;
  role: string;
  programme?: string | null;
  quote: string;
  image: string;
};

export function Testimonials({ stories }: { stories: HomeStoryItem[] }) {
  if (!stories.length) return null;

  return (
    <section data-section-fade className="border-y border-white/10 bg-surface py-16 sm:py-24 md:py-32">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-white sm:text-3xl md:text-5xl">Testimonials</h2>
        <div data-stagger className="mt-8 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <figure
              key={story.name}
              data-stagger-item
              className="rounded-[1.75rem] border border-white/10 bg-surface-2 p-6 md:p-8"
            >
              <blockquote className="text-base leading-relaxed text-white/75">
                {`"${excerptStoryQuote(story.quote)}"`}
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
                  <Image src={story.image} alt={story.name} fill className="object-cover" />
                </div>
                <div>
                  <figcaption className="font-display text-lg text-white">{story.name}</figcaption>
                  <p className="text-sm text-white/50">{story.role}</p>
                  {story.programme ? (
                    <p className="mt-1 text-xs text-white/35">{story.programme}</p>
                  ) : null}
                </div>
              </div>
            </figure>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/stories" variant="secondary">
            Member stories
          </Button>
        </div>
      </div>
    </section>
  );
}
