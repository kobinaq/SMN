import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { homepageClose } from "@/lib/content";
import { img } from "@/lib/images";

/** Tab 4 final CTA. Primary Join the community → /connect; secondary Explore our programmes. */
export function NetworkClose() {
  return (
    <Band size="lg" bordered={false} fade>
      <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Kicker>{homepageClose.lead}</Kicker>
          <h2 className="mt-6 max-w-[14ch] font-display display-1 text-text-1">
            {homepageClose.title}
          </h2>
          <div className="mt-8 max-w-[58ch] space-y-4 text-base leading-relaxed text-text-2">
            {homepageClose.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={cta.joinCommunity.href}>{cta.joinCommunity.label}</Button>
            <Button href={cta.explorePrograms.href} variant="secondary">
              {cta.explorePrograms.label}
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden" data-parallax-wrap>
          <Image
            src={img.communityHome}
            alt="TSA members gathered together in the community space"
            fill
            className="object-cover object-[center_25%]"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
          />
        </div>
      </div>
    </Band>
  );
}
