import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Band, Kicker } from "@/components/site/kit";
import { instructor } from "@/lib/content";
import { homepageFounder } from "@/lib/pages/home";

/** Doc Section 2 — founder profile sits above the hero on the homepage. */
export function FounderStory() {
  return (
    <Band tone="raised" size="lg" fade bordered={false}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden" data-parallax-wrap>
            <Image
              src={instructor.image}
              alt={homepageFounder.name}
              fill
              className="object-cover"
              data-parallax
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </Reveal>

        <div>
          <Kicker>Founder</Kicker>
          <h2 className="mt-6 font-display display-2 text-text-1">{homepageFounder.heading}</h2>
          <p className="mt-4 text-sm text-text-3">
            {homepageFounder.name}
            <span className="mx-2 text-edge-strong">·</span>
            {homepageFounder.role}
          </p>
          <div className="mt-8 max-w-[62ch] space-y-5 text-base leading-relaxed text-text-2">
            {homepageFounder.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8">
            <Button href={homepageFounder.ctaHref} variant="secondary">
              {homepageFounder.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </Band>
  );
}
