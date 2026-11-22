import { Band } from "@/components/site/kit";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { enquiryTypes, type EnquiryType } from "@/lib/enquiries/options";

/** The form component does not accept cohort-application (that has its own apply flow). */
type FormType = Exclude<EnquiryType, "newsletter" | "cohort-application">;

export function EnquiryFormBlock({ heading, text, enquiryType }: { heading?: string; text?: string; enquiryType?: string }) {
  const type: FormType = (enquiryTypes as readonly string[]).includes(enquiryType ?? "") && enquiryType !== "newsletter" && enquiryType !== "cohort-application"
    ? (enquiryType as FormType)
    : "contact";
  return (
    <Band>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {heading ? <h2 className="font-display display-3 text-text-1">{heading}</h2> : null}
          {text ? <p className="mt-4 max-w-xl text-base leading-relaxed text-text-2">{text}</p> : null}
        </div>
        <EnquiryForm
          idPrefix={`page-${type}`}
          enquiryType={type}
          submitLabel="Send"
          successMessage="Thank you. We will be in touch soon."
          fields={[
            { name: "name", label: "Name", kind: "text", autoComplete: "name", api: "name" },
            { name: "email", label: "Email", kind: "email", autoComplete: "email", api: "email" },
            { name: "message", label: "Message", kind: "textarea", api: "message" },
          ]}
        />
      </div>
    </Band>
  );
}
