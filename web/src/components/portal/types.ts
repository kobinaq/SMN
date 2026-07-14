import type { LucideIcon } from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  children?: PortalNavItem[];
};

export type PortalNavGroup = {
  heading?: string;
  items: PortalNavItem[];
};

export type PortalIdentity = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
};

export type PortalVariant = "member" | "staff";
