import { Band } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { getProgramsCatalogue } from "@/lib/programs/catalogue";
import { priceCta, type PriceProduct } from "@/lib/page-blocks/price-cta";
import { safeHref } from "./helpers";
import { formatMinor } from "./CourseList";

type Props = {
  heading?: string;
  product?: PriceProduct;
  course?: { id?: number | string } | number | string | null;
  applyLink?: string;
};

export async function PricePanelBlock({ heading, product = "course", course, applyLink }: Props) {
  const courseId = course && typeof course === "object" ? course.id : course;
  const catalogue = product === "workshops" ? null : await getProgramsCatalogue().catch(() => null);

  let price: number | null = null;
  let currency: string | null = null;
  let hasOpenCohort = false;
  if (product === "course" && catalogue && courseId != null) {
    const row = catalogue.courses.find((c) => c.course.id === String(courseId));
    price = row ? (row.nextCohort?.price ?? row.course.defaultPrice) : null;
    currency = row ? (row.nextCohort?.currency ?? row.course.currency) : null;
    hasOpenCohort = Boolean(row?.nextCohort);
  } else if (product === "one-on-one" && catalogue) {
    price = catalogue.oneOnOne.price;
    currency = catalogue.oneOnOne.currency;
  }

  const cta = priceCta({ product, price, currency, hasOpenCohort, applyLink: safeHref(applyLink) });
  const shown = formatMinor(cta.price);

  return (
    <Band>
      <div className="max-w-md rounded-2xl border border-edge-subtle bg-raised p-6">
        {heading ? <h2 className="font-display text-2xl text-text-1">{heading}</h2> : null}
        {shown ? <p className="mt-3 text-3xl font-semibold text-text-1">{shown}</p> : null}
        <div className="mt-6">
          {cta.href && !cta.disabled ? (
            <Button href={cta.href}>{cta.label}</Button>
          ) : (
            <Button disabled aria-disabled="true">{cta.label}</Button>
          )}
        </div>
        {cta.note ? <p className="mt-3 text-sm text-text-3">{cta.note}</p> : null}
      </div>
    </Band>
  );
}
