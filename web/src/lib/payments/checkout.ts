export function relationId(value: unknown): string {
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id: string | number }).id);
  }
  return value == null ? "" : String(value);
}

export function numericId(value: unknown): number {
  const n = Number(relationId(value));
  return Number.isFinite(n) ? n : 0;
}

export function checkoutPublishedAmountGate(course: {
  status?: unknown;
  amount?: unknown;
  priceConfirmed?: unknown;
}): { ok: true; amount: number } | { ok: false; error: string; status: number } {
  if (course.status !== "published") {
    return { ok: false, error: "This programme is not available.", status: 400 };
  }
  if (course.priceConfirmed === false) {
    return { ok: false, error: "Programme price is not configured.", status: 400 };
  }
  const amount = Number(course.amount || 0);
  if (!amount || amount < 100) {
    return { ok: false, error: "Programme price is not configured.", status: 400 };
  }
  return { ok: true, amount };
}

export function checkoutCourseGate(course: {
  status?: unknown;
  commerce?: unknown;
  amount?: unknown;
  priceConfirmed?: unknown;
}): { ok: true; amount: number } | { ok: false; error: string; status: number } {
  if (course.commerce !== "purchase") {
    return { ok: false, error: "This programme is application-only.", status: 400 };
  }
  return checkoutPublishedAmountGate(course);
}

export function paymentStatusAfterFailedDelivery(refunded: boolean): "refunded" | "needs_refund" {
  return refunded ? "refunded" : "needs_refund";
}
