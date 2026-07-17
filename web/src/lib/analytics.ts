/**
 * Privacy-conscious marketing conversion events.
 * Naming: snake_case, object_action where possible.
 * Do not attach emails, phone numbers, or free-text personal content.
 *
 * Documented in docs/marketing-analytics.md
 */
export type MarketingEventName =
  | "primary_cta_click"
  | "secondary_cta_click"
  | "programme_page_view"
  | "application_start"
  | "application_complete"
  | "application_error"
  | "employer_enquiry_start"
  | "employer_enquiry_complete"
  | "whatsapp_click"
  | "payment_start"
  | "payment_success"
  | "event_register"
  | "member_signin_click"
  | "portfolio_view"
  | "certificate_verify_view";

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export function trackEvent(name: MarketingEventName, props: EventProps = {}) {
  if (typeof window === "undefined") return;

  const payload = { event: name, ...props };

  try {
    window.dataLayer?.push(payload);
  } catch {
    /* ignore */
  }

  try {
    window.gtag?.("event", name, props);
  } catch {
    /* ignore */
  }

  try {
    window.plausible?.(name, { props });
  } catch {
    /* ignore */
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, props);
  }
}
