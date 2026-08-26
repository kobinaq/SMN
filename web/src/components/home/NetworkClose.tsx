import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { homepageClose } from "@/lib/content";
import { img } from "@/lib/images";

const [pullQuote, ...body] = homepageClose.paragraphs;

/** The closing argument, and the last chance to join. */
export function NetworkClose() {
  return (
    <Band size="lg" bordered={false} fade>
      <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Kicker>{homepageClose.lead}</Kicker>
          <h2 className="mt-6 max-w-[12ch] font-display display-1 text-text-1">
            {homepageClose.title}
          </h2>
          <p className="mt-10 max-w-[26ch] font-display display-3 text-accent">{pullQuote}</p>
          <div className="mt-8 max-w-[58ch] space-y-4 rule pt-8 text-base leading-relaxed text-text-2">
            {body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={cta.joinCommunity.href}>Join the community</Button>
            <Button href={cta.applyCohort.href} variant="secondary">
              {cta.applyCohort.shortLabel}
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden" data-parallax-wrap>
          <Image
            src={img.communityHome}
            alt="SMN gathering with a speaker, audience, and Own your voice tote"
            fill
            className="object-cover"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </div>
    </Band>
  );
}
