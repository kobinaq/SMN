import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { img } from "@/lib/images";
import { homepageGrow } from "@/lib/pages/home";

/** Doc Section 7 - Grow hub teaser. Always shows; articles load from CMS elsewhere. */
export function GrowPreview() {
  return (
    <Band tone="raised" size="lg" fade>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[5/4] overflow-hidden" data-parallax-wrap>
          <Image
            src={img.postStrategy}
            alt="Strategy notes and marketing planning materials"
            fill
            className="object-cover object-center"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 55vw"
            quality={85}
          />
        </div>
        <div>
          <Kicker>Grow</Kicker>
          <h2 className="mt-5 font-display display-2 text-text-1">{homepageGrow.title}</h2>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2 sm:text-lg">
            {homepageGrow.body}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {homepageGrow.topics.map((topic) => (
              <li
                key={topic}
                className="border border-edge-subtle px-3 py-2 text-xs text-text-2 sm:text-sm"
              >
                {topic}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={homepageGrow.ctaHref} variant="secondary">
              {homepageGrow.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </Band>
  );
}
