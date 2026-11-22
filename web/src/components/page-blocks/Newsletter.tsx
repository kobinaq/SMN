import { Band } from "@/components/site/kit";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterBlock({ heading, text }: { heading?: string; text?: string }) {
  return (
    <Band tone="raised">
      <div className="max-w-xl">
        {heading ? <h2 className="font-display display-3 text-text-1">{heading}</h2> : null}
        {text ? <p className="mt-4 text-base leading-relaxed text-text-2">{text}</p> : null}
        <NewsletterForm className="mt-6" id="page-newsletter-email" privacy />
      </div>
    </Band>
  );
}
