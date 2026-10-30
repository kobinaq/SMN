import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Band, Masthead, SectionHead } from "@/components/site/kit";
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
        image={img.cohortSpotlight}
        alt="One-on-one social media marketing training"
        kicker="Learn"
        title={offering.title}
        lede={offering.body}
        meta={offering.meta}
      />
      <Band tone="raised" size="lg">
        <SectionHead title="Who it’s for" lede={offering.audience} />
        <div className="mt-10">
          <Button href="/contact?type=Training%20request">Enquire about one-on-one training</Button>
        </div>
      </Band>
    </>
  );
}
