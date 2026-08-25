import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { homepagePartners } from "@/lib/content";

export function PartnersBand() {
  return (
    <section data-section-fade className="bg-near-black py-12 sm:py-24">
      <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-8 md:p-14">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Partners
            </p>
            <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
              {homepagePartners.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-base">
              {homepagePartners.body}
            </p>
          </div>
          <div className="btn-row-mobile lg:justify-end">
            <Button href={cta.partner.href} variant="light">
              {cta.partner.label}
            </Button>
            <Button href={cta.hireTalent.href} variant="secondary">
              {cta.hireTalent.label}
            </Button>
          </div>
        </div>
        <p className="mt-10 max-w-2xl font-display text-xl text-white sm:mt-12 sm:text-2xl md:text-3xl">
          {homepagePartners.close}
        </p>
      </div>
    </section>
  );
}
