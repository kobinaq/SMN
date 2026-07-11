import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function BlogNewsletter() {
  return (
    <aside className="overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[1.75rem] sm:p-8 md:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
        Newsletter
      </p>
      <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
        Get strategy notes in your inbox
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
        Practical ideas on social media, AI, and marketing careers. No spam, just useful posts
        from the Network.
      </p>
      <div className="mt-6 max-w-lg">
        <NewsletterForm />
      </div>
    </aside>
  );
}
