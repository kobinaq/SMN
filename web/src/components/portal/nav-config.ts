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

const operationsHrefs = new Set([
  "/staff",
  "/staff/learning",
  "/staff/members",
  "/staff/mentorship",
  "/staff/opportunities",
  "/staff/certificates",
]);

const contentHrefs = new Set([
  "/staff/content/posts",
  "/staff/content/resources",
  "/staff/content/media",
]);

const websiteHrefs = new Set([
  "/staff/website/courses",
  "/staff/website/events",
  "/staff/website/stories",
  "/staff/website/settings",
]);

const systemHrefs = new Set([
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

function collapsibleGroup(
  heading: string,
  icon: PortalNavItem["icon"],
  links: StaffLinkInput[],
): PortalNavItem | null {
  if (!links.length) return null;
  return {
    href: links[0].href,
    label: heading,
    icon,
    children: links.map(toNavItem),
  };
}

/** Regroup flat role-gated staff links into sidebar groups with nested sections. */
export function buildStaffNavGroups(links: StaffLinkInput[]): PortalNavGroup[] {
  const operations = links.filter((link) => operationsHrefs.has(link.href)).map(toNavItem);
  const content = links.filter((link) => contentHrefs.has(link.href));
  const website = links.filter((link) => websiteHrefs.has(link.href));
  const system = links.filter((link) => systemHrefs.has(link.href));

  const groups: PortalNavGroup[] = [{ heading: "Operations", items: operations }];

  const contentItem = collapsibleGroup("Content", FileText, content);
  const websiteItem = collapsibleGroup("Website", Globe, website);
  const systemItem = collapsibleGroup("System", Shield, system);

  const secondary: PortalNavItem[] = [];
  if (contentItem) secondary.push(contentItem);
  if (websiteItem) secondary.push(websiteItem);
  if (systemItem) secondary.push(systemItem);

  if (secondary.length) {
    groups.push({ heading: "More", items: secondary });
  }

  return groups;
}
