"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { trackEvent } from "@/lib/analytics";

export function EventRegisterButton({
  eventId,
  pricing,
  signedIn,
}: {
  eventId: string | number;
  pricing: "free" | "paid";
  signedIn: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    try {
      if (pricing === "free") {
        trackEvent("event_register", { pricing: "free" });
        const response = await fetch("/api/events/register", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to register.");
        toast.push("You're registered.", "success");
        router.push(`/app/events/tickets?id=${result.id}`);
        router.refresh();
        return;
      }

      trackEvent("payment_start", { kind: "event" });
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "event", eventId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to start checkout.");
      window.location.href = result.authorizationUrl;
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to register.", "error");
      setBusy(false);
    }
  }

  const label = busy
    ? "Please wait…"
    : !signedIn
      ? "Sign in to register"
      : pricing === "paid"
        ? "Pay & register"
        : "Register free";

  return (
    <Button type="button" disabled={busy} onClick={run}>
      {label}
    </Button>
  );
}
