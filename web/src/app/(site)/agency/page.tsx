import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Band, CtaBand, Masthead, Sequence } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { agencyEnabled } from "@/lib/features";
import {
  agencyApproach,
  agencyAudience,
  agencyClose,
  agencyEnquiry,
  agencyHero,
  agencyRelationship,
  agencySeo,
  agencyServices,
} from "@/lib/pages/agency";

export const metadata: Metadata = {
  title: { absolute: agencySeo.title },
  description: agencySeo.description,
  alternates: { canonical: "/agency" },
  robots: agencyEnabled ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title: agencySeo.title, description: agencySeo.description, url: "/agency" },
};

export default function AgencyPage() {
  return (
    <>
      <Masthead
        kicker={agencyHero.kicker}
        title={agencyHero.title}
        lede={agencyHero.lede}
        actions={<Button href={agencyHero.ctaHref}>{agencyHero.ctaLabel}</Button>}
      />

      <Band>
        <h2 className="font-display display-2 text-text-1">{agencyServices.title}</h2>
        <div className="mt-10 space-y-12">
          {agencyServices.items.map((service, index) => (
            <article key={service.title} className="max-w-3xl">
              <h3 className="font-display text-2xl text-text-1">
                {index + 1}. {service.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-text-2">{service.body}</p>
              {"extra" in service && service.extra ? (
                <p className="mt-3 text-base leading-relaxed text-text-2">{service.extra}</p>
              ) : null}
            </article>
          ))}
        </div>
      </Band>

      <Band tone="raised">
        <h2 className="max-w-3xl font-display display-2 text-text-1">{agencyApproach.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-2">{agencyApproach.lede}</p>
        <Sequence className="mt-4" items={[...agencyApproach.items]} />
      </Band>

      <CtaBand
        title={agencyClose.title}
        lede={agencyClose.lede}
        actions={<Button href={agencyClose.ctaHref}>{agencyClose.ctaLabel}</Button>}
      />

      <Band>
        <h2 className="max-w-3xl font-display display-2 text-text-1">{agencyAudience.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-2">{agencyAudience.body}</p>
      </Band>

      <Band id="enquiry" tone="raised">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
          <div>
            <h2 className="font-display display-2 text-text-1">{agencyEnquiry.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-2">{agencyEnquiry.lede}</p>
          </div>
          <EnquiryForm
            idPrefix="agency"
            enquiryType="partnership"
            submitLabel={agencyEnquiry.submitLabel}
            successMessage={agencyEnquiry.success}
            fields={[
              { name: "name", label: "Name", kind: "text", autoComplete: "name", api: "name" },
              { name: "organisation", label: "Business/organisation", kind: "text", autoComplete: "organization", api: "organisation" },
              { name: "email", label: "Work email", kind: "email", autoComplete: "email", api: "email" },
              { name: "links", label: "Website or social media links", kind: "text" },
              { name: "support", label: "Support required", kind: "text" },
              { name: "goals", label: "Tell us about your goals", kind: "textarea", api: "message" },
            ]}
          />
        </div>
      </Band>

      <Band>
        <p className="max-w-3xl text-base leading-relaxed text-text-2">{agencyRelationship}</p>
      </Band>
    </>
  );
}
