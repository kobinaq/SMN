import Image from "next/image";
import Link from "next/link";
import { Band, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import { img } from "@/lib/images";
import { homepageOfferings } from "@/lib/pages/home";

const offeringImages = [
  {
    src: img.cohortSpotlight,
    alt: "TSA cohort learning together",
    position: "object-[center_30%]",
  },
  {
    src: img.mentorshipTalk,
    alt: "One-on-one marketing training conversation",
    position: "object-top",
  },
  {
    src: img.eventWorkshop,
    alt: "Team marketing workshop in session",
    position: "object-top",
  },
] as const;

/** Doc Section 3 - three learning formats. */
export function LearningOfferings() {
  return (
    <Band tone="canvas" size="lg" fade id="learn-offerings">
      <SectionHead title={homepageOfferings.title} lede={homepageOfferings.lede} />
      <div data-stagger className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle lg:grid-cols-3">
        {homepageOfferings.items.map((item, index) => {
          const photo = offeringImages[index];
          return (
            <Link
              key={item.title}
              href={item.href}
              data-stagger-item
              className="group flex min-h-11 flex-col bg-canvas transition-colors hover:bg-raised"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className={`object-cover ${photo.position} transition duration-700 ease-out group-hover:scale-[1.03]`}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={85}
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <p className="eyebrow text-accent">{item.meta}</p>
                <h3 className="mt-3 font-display text-2xl text-text-1 transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
                <p className="mt-4 text-xs leading-relaxed text-text-3">{item.audience}</p>
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
  );
}
