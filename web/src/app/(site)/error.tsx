"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site]", error);
  }, [error]);

  return (
    <section className="container-page flex flex-col items-center justify-center py-28 text-center sm:py-36">
      <p className="text-[11px] font-medium tracking-[0.28em] text-baby-blue uppercase">
        Something went wrong
      </p>
      <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">
        We couldn’t load this page
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
        This is on us, not you. Try again in a moment, or head back to the homepage.
      </p>
      <div className="btn-row-mobile mt-8">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
