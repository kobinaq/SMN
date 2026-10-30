import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { site } from "@/lib/site";
import { seoTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: seoTitle("Verify certificate"),
  description: `Confirm a ${site.name} certificate with its credential code.`,
  robots: { index: false, follow: false },
};

export default function VerifyCertificateNotFound() {
  return (
    <div className="bg-canvas pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
      <div className="container-wide py-12 sm:py-16 md:py-20">
        <Link href="/" className="text-sm text-text-3 transition hover:text-text-1">
          Think Social Academy
        </Link>

        <section className="mx-auto mt-8 max-w-2xl border border-dashed border-edge bg-raised p-8 sm:p-12">
          <p className="font-display text-sm tracking-[0.08em] text-accent">
            TSA credential
          </p>
          <h1 className="mt-4 font-display display-3 text-text-1">
            Certificate not verified
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-2">
            This code is not public, is not valid, or has been revoked. Check the link and try
            again, or contact TSA if you believe this credential should verify.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href={cta.contact.href}>{cta.contact.label}</Button>
            <Button href="/" variant="secondary">
              Back home
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
