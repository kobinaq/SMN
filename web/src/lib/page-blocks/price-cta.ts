/**
 * CTA rules for the price-panel block. Pure: callers pass catalog facts in.
 * Prices are always staff-set; the panel never invents one.
 */
export type PriceProduct = "course" | "one-on-one" | "workshops";

export type PriceCtaInput = {
  product: PriceProduct;
  /** Staff-set price in minor units (pesewas), already resolved by the catalogue. */
  price: number | null;
  currency?: string | null;
  /** True when the course has an open next cohort with seats. */
  hasOpenCohort?: boolean;
  /** Optional editor-set apply link. Defaults to /apply. */
  applyLink?: string | null;
};

export type PriceCta = {
  label: string;
  href: string | null;
  disabled: boolean;
  note: string | null;
  /** Price in minor units to display, or null when none should be shown. */
  price: number | null;
  currency: string | null;
};

export const DEFAULT_APPLY_LINK = "/apply";
export const ONE_ON_ONE_NOTE = "Online payment is coming soon";
export const REGISTER_INTEREST_HREF = "/contact?type=programme-social-media-marketing";
export const WORKSHOPS_HREF = "/contact?type=organisational-training";

export function priceCta(input: PriceCtaInput): PriceCta {
  const currency = input.currency || "GHS";
  switch (input.product) {
    case "workshops":
      // Never a price or checkout.
      return { label: "Contact sales", href: WORKSHOPS_HREF, disabled: false, note: null, price: null, currency: null };
    case "one-on-one":
      return { label: "Pay", href: null, disabled: true, note: ONE_ON_ONE_NOTE, price: input.price, currency };
    case "course":
    default:
      return input.hasOpenCohort
        ? {
            label: "Apply",
            href: input.applyLink?.trim() || DEFAULT_APPLY_LINK,
            disabled: false,
            note: null,
            price: input.price,
            currency,
          }
        : {
            label: "Register interest",
            href: REGISTER_INTEREST_HREF,
            disabled: false,
            note: null,
            price: input.price,
            currency,
          };
  }
}
