import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Band, Checklist, CtaBand, DefinitionGrid, Masthead, Sequence } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import {
  partnershipEnquiry,
  partnershipOpportunities,
  partnershipShapes,
  partnershipSteps,
  partnershipsClose,
  partnershipsHero,
  partnershipsSeo,
  partnershipsWhy,
} from "@/lib/pages/partnerships";

export const metadata: Metadata = {
  title: { absolute: partnershipsSeo.title },
  description: partnershipsSeo.description,
  alternates: { canonical: "/partnerships" },
  openGraph: { title: partnershipsSeo.title, description: partnershipsSeo.description, url: "/partnerships" },
};

export default function PartnershipsPage() {
  return (
    <>
      <Masthead
        kicker="Partnerships"
        title={partnershipsHero.title}
        lede={partnershipsHero.lede}
        actions={<Button href={partnershipsHero.ctaHref}>{partnershipsHero.ctaLabel}</Button>}
      />

      <Band>
        <h2 className="max-w-2xl font-display display-2 text-text-1">{partnershipsWhy.title}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-text-2">
          {partnershipsWhy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Band>

      <Band tone="raised">
        <h2 className="font-display display-2 text-text-1">Partnership opportunities</h2>
        <DefinitionGrid className="mt-10" columns={2} items={[...partnershipOpportunities]} />
      </Band>

      <Band>
        <h2 className="font-display display-2 text-text-1">{partnershipShapes.title}</h2>
        <Checklist className="mt-8 max-w-3xl" items={partnershipShapes.items} />
      </Band>

      <Band tone="raised">
        <h2 className="font-display display-2 text-text-1">{partnershipSteps.title}</h2>
        <Sequence className="mt-4" items={[...partnershipSteps.items]} />
      </Band>

      <Band id="enquiry">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
          <div>
            <h2 className="font-display display-2 text-text-1">{partnershipEnquiry.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-2">{partnershipEnquiry.lede}</p>
          </div>
          <EnquiryForm
            idPrefix="partnership"
            enquiryType="partnership"
            submitLabel={partnershipEnquiry.submitLabel}
            successMessage={partnershipEnquiry.success}
            fields={[
              { name: "name", label: "Name", kind: "text", autoComplete: "name", api: "name" },
              { name: "organisation", label: "Organisation", kind: "text", autoComplete: "organization", api: "organisation" },
              { name: "email", label: "Work email", kind: "email", autoComplete: "email", api: "email" },
              { name: "partnershipType", label: "Partnership type", kind: "text" },
              { name: "explore", label: "What would you like to explore?", kind: "textarea", api: "message" },
            ]}
          />
        </div>
      </Band>

      <CtaBand
        title={partnershipsClose.title}
        actions={<Button href={partnershipsClose.ctaHref}>{partnershipsClose.ctaLabel}</Button>}
      />
    </>
  );
}
