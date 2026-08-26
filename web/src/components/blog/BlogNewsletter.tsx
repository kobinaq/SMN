import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function BlogNewsletter() {
  return (
    <aside className="overflow-hidden border border-edge-subtle bg-accent-strong p-6 sm:p-8 md:p-10">
      <p className="eyebrow text-accent sm:text-xs">
        Newsletter
      </p>
      <h2 className="mt-3 font-display display-3 text-text-1">
        Get strategy notes in your inbox
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
        Practical ideas on social media, AI, and marketing careers. No spam, just useful posts
        from the Network.
      </p>
      <div className="mt-6 max-w-lg">
        <NewsletterForm />
      </div>
    </aside>
  );
}
