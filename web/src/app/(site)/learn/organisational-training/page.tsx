import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker, Masthead } from "@/components/site/kit";
import { homepageOfferings } from "@/lib/pages/home";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

const offering = homepageOfferings.items[2];

export const metadata: Metadata = {
  title: seoTitle("Organisational Training"),
  description: offering.body,
  alternates: { canonical: "/learn/organisational-training" },
};

export default function OrganisationalTrainingPage() {
  return (
    <>
      <Masthead
        image={img.eventWorkshop}
        alt="Team social media marketing workshop"
        imageClassName="object-cover object-[center_15%]"
        kicker="Learn"
        title={offering.title}
        lede={offering.body}
        meta={offering.meta}
      />
      <Band tone="raised" size="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[5/4] overflow-hidden order-2 lg:order-1">
            <Image
              src={img.eventsGathering}
              alt="Organisation team in a practical marketing workshop"
              fill
              className="object-cover object-[center_25%]"
              sizes="(max-width: 1024px) 100vw, 55vw"
              quality={85}
            />
          </div>
          <div className="order-1 lg:order-2">
            <Kicker>Who it is for</Kicker>
            <h2 className="mt-5 font-display display-2 text-text-1">Scoped to your team.</h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-text-2">{offering.audience}</p>
            <div className="mt-10">
              <Button href="/contact?type=Training%20request">Start a conversation</Button>
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
