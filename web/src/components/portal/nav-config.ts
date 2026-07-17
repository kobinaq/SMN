import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  FolderOpen,
  Globe,
  Handshake,
  Image,
  LayoutDashboard,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import type { PortalNavGroup, PortalNavItem } from "./types";

export const memberNavGroups: PortalNavGroup[] = [
  {
    items: [
      { href: "/app", label: "Home", icon: LayoutDashboard },
      { href: "/app/learning", label: "Learning", icon: BookOpen },
      { href: "/app/mentors", label: "Mentors", icon: Handshake },
      { href: "/app/opportunities", label: "Opportunities", icon: Briefcase },
      { href: "/app/career-coach", label: "Career Coach", icon: Sparkles },
    ],
  },
  {
    heading: "Grow",
    items: [
      { href: "/app/portfolio", label: "Portfolio", icon: FolderOpen },
      { href: "/app/certificates", label: "Certificates", icon: Award },
    ],
  },
  {
    heading: "Account",
    items: [{ href: "/app/profile", label: "Profile", icon: UserRound }],
  },
];

const staffIconByHref: Record<string, PortalNavItem["icon"]> = {
  "/staff": LayoutDashboard,
  "/staff/learning": BookOpen,
  "/staff/members": Users,
  "/staff/mentorship": Handshake,
  "/staff/opportunities": Briefcase,
  "/staff/certificates": Award,
  "/staff/content/posts": FileText,
  "/staff/content/resources": FolderOpen,
  "/staff/content/media": Image,
  "/staff/website/courses": Globe,
  "/staff/website/events": Calendar,
  "/staff/website/stories": ScrollText,
  "/staff/website/settings": Settings,
  "/staff/system/users": Shield,
  "/staff/system/ai": Activity,
  "/staff/system/audit": ScrollText,
};

const workHrefs = new Set([
  "/staff",
  "/staff/learning",
  "/staff/members",
  "/staff/mentorship",
  "/staff/opportunities",
  "/staff/certificates",
]);

const siteHrefs = new Set([
  "/staff/content/posts",
  "/staff/content/resources",
  "/staff/content/media",
  "/staff/website/courses",
  "/staff/website/events",
  "/staff/website/stories",
  "/staff/website/settings",
]);

const teamHrefs = new Set([
  "/staff/system/users",
  "/staff/system/ai",
  "/staff/system/audit",
]);

export type StaffLinkInput = {
  href: string;
  label: string;
  count?: number;
};

function toNavItem(link: StaffLinkInput): PortalNavItem {
  return {
    href: link.href,
    label: link.label,
    icon: staffIconByHref[link.href] ?? FileText,
    badge: link.count,
  };
}

/** Regroup flat role-gated staff links into Work / Site / Team. */
export function buildStaffNavGroups(links: StaffLinkInput[]): PortalNavGroup[] {
  const work = links.filter((link) => workHrefs.has(link.href)).map(toNavItem);
  const site = links.filter((link) => siteHrefs.has(link.href)).map(toNavItem);
  const team = links.filter((link) => teamHrefs.has(link.href)).map(toNavItem);

  const groups: PortalNavGroup[] = [{ heading: "Work", items: work }];
  if (site.length) groups.push({ heading: "Site", items: site });
  if (team.length) groups.push({ heading: "Team", items: team });
  return groups;
}
