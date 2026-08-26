"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/Feedback";

export default function StaffError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[staff]", error);
  }, [error]);

  return (
    <ErrorState
      title="Staff workspace error"
      description="The operation did not finish. Retry, or return to Today."
      action={
        <div className="w-full">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={reset}>
              Retry
            </Button>
            <Button href="/staff" variant="secondary">
              Today
            </Button>
          </div>
          {/* Production strips the message, but the digest is the key to the
              matching server log — without it an operator has nothing to quote
              when reporting the fault. */}
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-text-3">Reference: {error.digest}</p>
          ) : null}
        </div>
      }
    />
  );
}
