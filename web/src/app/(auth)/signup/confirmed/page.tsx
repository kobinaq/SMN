import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { WhatsAppUpdatesLink } from "@/components/join/WhatsAppUpdatesLink";
import { Button } from "@/components/ui/Button";
import { getMember, memberDisplayName } from "@/lib/auth/member";
import { seoTitle } from "@/lib/brand";
import { getSiteSettings } from "@/lib/cms";
import { confirmationCopy, confirmationSteps, confirmationSubtitle } from "@/lib/pages/join";

export const metadata: Metadata = {
  title: seoTitle(confirmationCopy.metaTitle),
};

export default async function SignupConfirmedPage() {
  const member = await getMember();
  if (!member) redirect("/signup");
  const site = await getSiteSettings();

  return (
    <AuthShell
      title={confirmationCopy.title}
      subtitle={confirmationSubtitle(memberDisplayName(member), member.email)}
    >
      <section aria-labelledby="signup-next-heading">
        <h2 id="signup-next-heading" className="font-display text-lg text-text-1">
          {confirmationCopy.nextHeading}
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-2">
          {confirmationSteps(site.cohort).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <div className="mt-8 flex flex-col gap-3">
        <Button href="/app/welcome" className="w-full">
          {confirmationCopy.primaryLabel}
        </Button>
        <Button href="/app" variant="secondary" className="w-full">
          {confirmationCopy.secondaryLabel}
        </Button>
      </div>
      <div className="mt-4 border-t border-edge-subtle pt-4 text-center">
        <WhatsAppUpdatesLink href={site.whatsappInvite} />
      </div>
    </AuthShell>
  );
}
