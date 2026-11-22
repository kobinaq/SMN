"use client";

import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { subscribeModule } from "@/lib/pages/chrome";

/** Hidden on /resources, which has its own subscribe block. */
export function FooterSubscribe() {
  const pathname = usePathname();
  if (pathname === "/resources") return null;

  return (
    <div className="mt-10 max-w-xl border-t border-edge-subtle pt-8 sm:mt-14">
      <h2 className="font-display text-2xl text-text-1">{subscribeModule.heading}</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-2">{subscribeModule.body}</p>
      <NewsletterForm
        id="footer-newsletter-email"
        className="mt-5"
        buttonLabel={subscribeModule.button}
        successMessage={subscribeModule.success}
        privacy
      />
    </div>
  );
}
