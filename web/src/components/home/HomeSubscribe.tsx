import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Band } from "@/components/site/kit";
import { subscribeModule } from "@/lib/pages/chrome";

/** Homepage section 10. The footer repeats this module on every page. */
export function HomeSubscribe() {
  return (
    <Band id="subscribe" tone="canvas" size="lg" fade>
      <div className="max-w-xl">
        <h2 className="font-display display-3 text-text-1">{subscribeModule.heading}</h2>
        <p className="mt-4 text-base leading-relaxed text-text-2">{subscribeModule.body}</p>
        <NewsletterForm
          id="home-newsletter-email"
          className="mt-6"
          buttonLabel={subscribeModule.button}
          successMessage={subscribeModule.success}
          privacy
        />
      </div>
    </Band>
  );
}
