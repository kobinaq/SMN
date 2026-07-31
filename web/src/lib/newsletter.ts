export type NewsletterResult = { ok: true; skipped?: boolean } | { ok: false; error: string };

/**
 * Adds an address to the Mailchimp audience. When Mailchimp is not configured the
 * call is reported as skipped so callers can tell "nothing to do" apart from "failed".
 */
export async function subscribeToNewsletter(
  email: string,
  tags: string[] = ["website-newsletter"],
): Promise<NewsletterResult> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audience = process.env.MAILCHIMP_AUDIENCE_ID;
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audience || !prefix) return { ok: true, skipped: true };

  try {
    const response = await fetch(
      `https://${prefix}.api.mailchimp.com/3.0/lists/${audience}/members`,
      {
        method: "POST",
        headers: { Authorization: `apikey ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email, status: "pending", tags }),
      },
    );

    if (response.ok) return { ok: true };

    const detail = await response.text();
    // Already on the list satisfies the request just as well as a new signup.
    if (detail.includes("Member Exists")) return { ok: true };
    console.error("[newsletter]", detail);
    return { ok: false, error: "Subscription failed." };
  } catch (error) {
    console.error("[newsletter]", error);
    return { ok: false, error: "Subscription failed." };
  }
}
