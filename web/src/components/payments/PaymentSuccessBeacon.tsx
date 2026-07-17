"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires once on mount when a payment return URL lands with a reference. */
export function PaymentSuccessBeacon({
  kind,
  reference,
}: {
  kind: "event" | "course";
  reference?: string;
}) {
  useEffect(() => {
    if (!reference) return;
    trackEvent("payment_success", { kind, reference: reference.slice(0, 24) });
  }, [kind, reference]);

  return null;
}
