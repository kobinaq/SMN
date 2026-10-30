import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { insightsNewsletter } from "@/lib/pages/resources";

export function BlogNewsletter() {
  return (
    <aside className="overflow-hidden border border-edge-subtle bg-accent-strong p-6 sm:p-8 md:p-10">
      <p className="eyebrow text-accent sm:text-xs">
        Newsletter
      </p>
      <h2 className="mt-3 font-display display-3 text-text-1">
        {insightsNewsletter.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
        {insightsNewsletter.body}
      </p>
      <div className="mt-6 max-w-lg">
        <NewsletterForm />
      </div>
    </aside>
  );
}
