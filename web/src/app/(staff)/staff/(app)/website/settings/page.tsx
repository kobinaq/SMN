import { SiteSettingsForm } from "@/components/staff/SiteSettingsForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export default async function SiteSettingsPage() {
  const staff = await requireStaff(["content"], "/staff/website/settings");
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings", depth: 0, ...staffAccess(staff) });
  const cohort = (settings.cohort || {}) as Record<string, string | number | null | undefined>;
  const social = (settings.social || {}) as Record<string, string | null | undefined>;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Site settings"
        description="Global brand, cohort, and social links used across the public site."
      />
      <StaffPanel>
        <SiteSettingsForm
          initial={{
            siteName: String(settings.siteName || ""),
            tagline: String(settings.tagline || ""),
            whatsappInvite: String(settings.whatsappInvite || ""),
            opsEmail: String(settings.opsEmail || ""),
            cohortName: String(cohort.name || ""),
            cohortStartDate: String(cohort.startDate || ""),
            cohortDuration: String(cohort.duration || ""),
            cohortSeats: cohort.seats == null ? "" : String(cohort.seats),
            cohortPriceLabel: String(cohort.priceLabel || ""),
            cohortPriceNote: String(cohort.priceNote || ""),
            cohortSessions: String(cohort.sessions || ""),
            instagram: String(social.instagram || ""),
            linkedin: String(social.linkedin || ""),
            twitter: String(social.twitter || ""),
          }}
        />
      </StaffPanel>
    </div>
  );
}
