import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";
import { Band, Kicker } from "@/components/site/kit";
import { homepageFounderStory, instructor } from "@/lib/content";

/** Tab 4 founder lead-in with Arielle's photo from content.ts / public images. */
export function FounderStory() {
  return (
    <Band tone="raised" size="lg" fade>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden" data-parallax-wrap>
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
              data-parallax
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </Reveal>

        <div>
          <Kicker>Founder &amp; lead instructor</Kicker>
          <h2 className="mt-6 font-display display-2 text-text-1">{instructor.name}</h2>
          <p className="mt-2 text-sm text-text-3">Founder, Think Social Academy</p>
          <div className="mt-8 max-w-[62ch] space-y-5 text-base leading-relaxed text-text-2">
            {homepageFounderStory.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 font-display text-lg text-text-1">{instructor.name}</p>
          <a
            href={instructor.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-wipe mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            {instructor.name} on LinkedIn
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Band>
  );
}
