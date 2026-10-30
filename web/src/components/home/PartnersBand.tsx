import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { img } from "@/lib/images";
import { homepagePartner } from "@/lib/pages/home";

/** Doc Section 9 - partner / agency invitation. */
export function PartnersBand() {
  return (
    <Band tone="blue" size="lg" fade>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Kicker>Partner With Us</Kicker>
          <h2 className="mt-5 max-w-[18ch] font-display display-2 text-text-1">
            {homepagePartner.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2 sm:text-lg">
            {homepagePartner.body}
          </p>
          <div className="mt-8">
            <Button href={homepagePartner.ctaHref} variant="light">
              {homepagePartner.ctaLabel}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden" data-parallax-wrap>
          <Image
            src={img.hireConversation}
            alt="Partnership conversation between marketers"
            fill
            className="object-cover"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
        </div>
      </div>
    </Band>
  );
}
