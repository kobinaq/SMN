import Link from "next/link";
import { EnquiryForm, type EnquiryField } from "@/components/forms/EnquiryForm";
import { Band, Checklist, Kicker } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import type { EnquiryType } from "@/lib/enquiries";
import type { ProgramCopy } from "@/lib/pages/programs";

const interestFields = [
  { name: "name", label: "Name", kind: "text", autoComplete: "name", api: "name" },
  { name: "email", label: "Email", kind: "email", autoComplete: "email", api: "email" },
  { name: "message", label: "Message", kind: "textarea", api: "message" },
] as const satisfies readonly EnquiryField[];

const workshopFields = [
  { name: "name", label: "Contact person", kind: "text", autoComplete: "name", api: "name" },
  { name: "organisation", label: "Organisation name", kind: "text", autoComplete: "organization", api: "organisation" },
  { name: "email", label: "Email", kind: "email", autoComplete: "email", api: "email" },
  { name: "teamSize", label: "Team size", kind: "text" },
  { name: "objectives", label: "Training objectives", kind: "textarea", api: "message" },
  { name: "delivery", label: "Preferred delivery format", kind: "text" },
] as const satisfies readonly EnquiryField[];

const programEnquiryType = {
  cohort: "programme-social-media-marketing",
  "one-on-one": "one-on-one-training",
  workshop: "organisational-training",
} as const satisfies Record<ProgramCopy["kind"], EnquiryType>;

function ProgramBody({ program }: { program: ProgramCopy }) {
  return (
    <>
      <Kicker>{program.descriptor}</Kicker>
      <h2 className="mt-5 font-display display-2 text-text-1">{program.title}</h2>
      {program.subheading ? (
        <h3 className="mt-4 font-display text-xl text-text-1">{program.subheading}</h3>
      ) : null}
      <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-text-2">
        {program.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 space-y-10">
        {program.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="font-display text-2xl text-text-1">{section.heading}</h3>
            {section.body ? <p className="mt-3 text-base leading-relaxed text-text-2">{section.body}</p> : null}
            {section.items ? <Checklist className="mt-4 max-w-3xl" items={section.items} /> : null}
          </div>
        ))}
      </div>
    </>
  );
}

export function ProgramSections({ program }: { program: ProgramCopy }) {
  return (
    <Band id={program.id}>
      <ProgramBody program={program} />
      <div className="mt-10">
        <Button href={program.href}>{program.ctaLabel}</Button>
      </div>
    </Band>
  );
}

export function ProgramDetail({ program }: { program: ProgramCopy }) {
  return (
    <>
      <header className="border-b border-edge-subtle bg-canvas pt-[calc(6rem+env(safe-area-inset-top))] pb-14 sm:pt-40 sm:pb-20">
        <div className="container-wide">
          <Link href="/programs" className="text-sm text-text-3 underline-offset-2 hover:text-text-1 hover:underline">
            All programmes
          </Link>
          <div className="mt-8">
            <ProgramBody program={program} />
          </div>
        </div>
      </header>
      <Band id={program.kind === "cohort" ? "register" : "enquiry"} tone="raised">
        <ProgramAction program={program} />
      </Band>
    </>
  );
}

function ProgramAction({ program }: { program: ProgramCopy }) {
  const enquiryType = programEnquiryType[program.kind];
  const label = program.kind === "cohort" ? "Register interest" : program.ctaLabel;
  return (
    <div className="max-w-xl">
      <h2 className="font-display display-3 text-text-1">{label}</h2>
      <div className="mt-8">
        <EnquiryForm
          idPrefix={program.kind}
          fields={program.kind === "workshop" ? workshopFields : interestFields}
          enquiryType={enquiryType}
          submitLabel={label}
          successMessage="Message sent. We'll get back to you soon."
        />
      </div>
    </div>
  );
}
