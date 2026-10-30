import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";
import { WhatsAppUpdatesLink } from "@/components/join/WhatsAppUpdatesLink";
import { getMember } from "@/lib/auth/member";
import { seoTitle } from "@/lib/brand";
import { getSiteSettings } from "@/lib/cms";
import { accountIncludes, cohortNote, signupCopy } from "@/lib/pages/join";

export const metadata: Metadata = {
  title: seoTitle(signupCopy.metaTitle),
  description: signupCopy.metaDescription,
};

export default async function SignupPage() {
  const member = await getMember();
  if (member) redirect("/app");
  const site = await getSiteSettings();

  return (
    <AuthShell title={signupCopy.title} subtitle={signupCopy.subtitle}>
      <SignupForm />

      <div className="mt-4 border-t border-edge-subtle pt-4 text-center">
        <WhatsAppUpdatesLink href={site.whatsappInvite} />
      </div>

      <section aria-labelledby="signup-includes-heading" className="mt-8">
        <h2 id="signup-includes-heading" className="font-display text-lg text-text-1">
          {signupCopy.includesHeading}
        </h2>
        <ul className="mt-3 space-y-3">
          {accountIncludes.map((item) => (
            <li key={item.title} className="text-sm leading-relaxed text-text-2">
              <span className="font-semibold text-text-1">{item.title}.</span> {item.body}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-[var(--radius-md)] border border-edge-subtle bg-raised p-4 text-sm leading-relaxed text-text-2">
          {cohortNote(site.cohort)}
        </p>
      </section>
    </AuthShell>
  );
}
