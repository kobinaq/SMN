import { PortalShell } from "@/components/portal/PortalShell";
import type { StaffLinkInput } from "@/components/portal/nav-config";
import { requireStaff, staffDisplayName, staffRoleLabel } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getAdminWorkspaceBadges } from "@/lib/admin-dashboard";
import { canStaff, staffRole } from "@/lib/staff-permissions";

export default async function StaffAppLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff([], "/staff");
  const payload = await getPayloadClient();
  const badges = await getAdminWorkspaceBadges(payload, staff);
  const role = staffRole(staff);
  const badgeFor = (...parts: string[]) =>
    badges.find((item) => parts.some((part) => item.href.includes(part) || item.href === part))?.count;

  const links: StaffLinkInput[] = [
    { href: "/staff", label: "Today", count: badgeFor("/admin", "/staff") },
    { href: "/staff/learning", label: "Learning", count: badgeFor("course-builder", "learning") },
    { href: "/staff/members", label: "People" },
    { href: "/staff/mentorship", label: "Mentorship", count: badgeFor("mentorship") },
    { href: "/staff/opportunities", label: "Jobs", count: badgeFor("opportunity") },
    { href: "/staff/certificates", label: "Certificates", count: badgeFor("certificate") },
    { href: "/staff/events", label: "Events" },
  ];

  if (canStaff(staff, "content", "analyst")) {
    links.push(
      { href: "/staff/content/posts", label: "Posts" },
      { href: "/staff/content/resources", label: "Resources" },
      { href: "/staff/content/media", label: "Media" },
      { href: "/staff/website/courses", label: "Catalogue" },
      { href: "/staff/website/events", label: "Event editor" },
      { href: "/staff/website/stories", label: "Stories" },
      { href: "/staff/website/settings", label: "Site settings" },
    );
  } else if (canStaff(staff, "learning")) {
    links.push(
      { href: "/staff/content/resources", label: "Resources" },
      { href: "/staff/content/media", label: "Media" },
    );
  }

  if (canStaff(staff, "support", "analyst") || role === "super-admin") {
    links.push(
      { href: "/staff/system/users", label: "Staff users" },
      { href: "/staff/system/ai", label: "AI activity" },
      { href: "/staff/system/audit", label: "Audit log" },
    );
  }

  return (
    <PortalShell
      variant="staff"
      identity={{
        name: staffDisplayName(staff),
        subtitle: staffRoleLabel(staff),
      }}
      staffLinks={links}
      maxWidth="7xl"
    >
      {children}
    </PortalShell>
  );
}
