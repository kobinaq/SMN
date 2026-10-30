import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { img } from "@/lib/images";
import { homepageConnect } from "@/lib/pages/home";

/** Doc Section 6 - community without overpromising. */
export function CommunityPreview() {
  return (
    <Band tone="light" size="lg" fade>
      <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Kicker>Connect</Kicker>
          <h2 className="mt-5 max-w-[18ch] font-display display-2 text-text-1">
            {homepageConnect.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2 sm:text-lg">
            {homepageConnect.body}
          </p>
          <div className="mt-8">
            <Button href={homepageConnect.ctaHref}>{homepageConnect.ctaLabel}</Button>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden" data-parallax-wrap>
          <Image
            src={img.communityHome}
            alt="TSA members gathered in the community space"
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
