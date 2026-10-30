import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Band, Masthead, SectionHead } from "@/components/site/kit";
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
        image={img.cohortSpotlight}
        alt="Team social media marketing workshop"
        kicker="Learn"
        title={offering.title}
        lede={offering.body}
        meta={offering.meta}
      />
      <Band tone="raised" size="lg">
        <SectionHead title="Who it’s for" lede={offering.audience} />
        <div className="mt-10">
          <Button href="/contact?type=Training%20request">Start a conversation</Button>
        </div>
      </Band>
    </>
  );
}
