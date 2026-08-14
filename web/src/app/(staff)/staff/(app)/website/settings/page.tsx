import { SiteSettingsForm } from "@/components/staff/SiteSettingsForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export default async function SiteSettingsPage() {
  const staff = await requireStaff(["content"], "/staff/website/settings");
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings", depth: 0, ...staffAccess(staff) });
  const social = (settings.social || {}) as Record<string, string | null | undefined>;
  const homepage = (settings.homepage || {}) as Record<string, string | null | undefined>;
  const impactStats = Array.isArray(settings.impactStats)
    ? settings.impactStats.map((item) => ({
        label: String(item?.label || ""),
        value: String(item?.value || ""),
        verified: Boolean(item?.verified),
      }))
    : [];

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Site settings"
        description="Public brand, homepage, banner, and verified stats. Cohort copy lives on Learning programmes marked Cohort."
      />
      <StaffPanel>
        <SiteSettingsForm
          initial={{
            siteName: String(settings.siteName || ""),
            tagline: String(settings.tagline || ""),
            description: String(settings.description || ""),
            whatsappInvite: String(settings.whatsappInvite || ""),
            opsEmail: String(settings.opsEmail || ""),
            announcementBanner: String(settings.announcementBanner || ""),
            footerBlurb: String(settings.footerBlurb || ""),
            homepageHeadline: String(homepage.headline || ""),
            homepageSupportingCopy: String(homepage.supportingCopy || ""),
            homepagePrimaryCtaLabel: String(homepage.primaryCtaLabel || ""),
            homepageSecondaryCtaLabel: String(homepage.secondaryCtaLabel || ""),
            homepageSecondaryCtaHref: String(homepage.secondaryCtaHref || ""),
            instagram: String(social.instagram || ""),
            linkedin: String(social.linkedin || ""),
            twitter: String(social.twitter || ""),
            impactStats,
          }}
        />
      </StaffPanel>
    </div>
  );
}
