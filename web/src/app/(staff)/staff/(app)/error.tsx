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
      description="The operation did not finish. Retry, or return to Overview. No stack traces are shown here."
      action={
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={reset}>
            Retry
          </Button>
          <Button href="/staff" variant="secondary">
            Overview
          </Button>
        </div>
      }
    />
  );
}
