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

export function checkoutCourseGate(course: {
  status?: unknown;
  amount?: unknown;
  lmsCourse?: unknown;
  lmsStatus?: unknown;
}): { ok: true; lmsId: string; amount: number } | { ok: false; error: string; status: number } {
  if (course.status === "coming-soon") {
    return { ok: false, error: "This programme is coming soon.", status: 400 };
  }
  const amount = Number(course.amount || 0);
  if (!amount || amount < 100) {
    return { ok: false, error: "Programme price is not configured.", status: 400 };
  }
  const lmsId = relationId(course.lmsCourse);
  if (!lmsId) {
    return { ok: false, error: "This programme has no lessons yet.", status: 400 };
  }
  if (course.lmsStatus !== "published") {
    return { ok: false, error: "This programme has no published lessons yet.", status: 400 };
  }
  return { ok: true, lmsId, amount };
}

export function paymentStatusAfterFailedDelivery(refunded: boolean): "refunded" | "needs_refund" {
  return refunded ? "refunded" : "needs_refund";
}
