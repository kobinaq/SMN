import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Kicker, Masthead } from "@/components/site/kit";
import { homepageOfferings } from "@/lib/pages/home";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

const offering = homepageOfferings.items[1];

export const metadata: Metadata = {
  title: seoTitle("Specialised One-on-One Training"),
  description: offering.body,
  alternates: { canonical: "/learn/one-on-one-training" },
};

export default function OneOnOneTrainingPage() {
  return (
    <>
      <Masthead
        image={img.mentorshipTalk}
        alt="One-on-one social media marketing training"
        kicker="Learn"
        title={offering.title}
        lede={offering.body}
        meta={offering.meta}
      />
      <Band tone="raised" size="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker>Who it is for</Kicker>
            <h2 className="mt-5 font-display display-2 text-text-1">Built around your goals.</h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-text-2">{offering.audience}</p>
            <div className="mt-10">
              <Button href="/contact?type=Training%20request">Enquire about one-on-one training</Button>
            </div>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={img.mentorshipPair}
              alt="Learner and tutor in a focused training session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>
      </Band>
    </>
  );
}
