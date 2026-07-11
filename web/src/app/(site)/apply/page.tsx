import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply",
  description: `Apply to the ${site.cohort.name}.`,
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title={`Apply to the ${site.cohort.name}`}
        description={`Next intake ${site.cohort.startDate}. Applications are reviewed within 3-5 business days. Live sessions run on Google Classroom. Community lives on WhatsApp.`}
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide max-w-3xl rounded-[2rem] border border-white/10 bg-surface p-6 md:p-10">
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
