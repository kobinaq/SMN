/** Pure payment link rules. No Payload import. */

type Ref = number | string | { id: number | string } | null | undefined;

export type PaymentLinkData = { kind?: string | null; cohort?: Ref };

function hasRef(value: Ref): boolean {
  return value != null && value !== "";
}

export function validatePaymentLinks(data: PaymentLinkData): string | true {
  const hasCohort = hasRef(data.cohort);
  if (data.kind === "cohort" && !hasCohort) return "Choose a cohort for a cohort payment.";
  if (data.kind === "one-on-one" && hasCohort) return "A One-on-One payment cannot have a cohort.";
  if (hasCohort && data.kind !== "cohort") return "A cohort can only be set when the kind is Cohort.";
  return true;
}
