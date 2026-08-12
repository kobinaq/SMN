import type { Icon } from "@/components/ui/icons";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: Icon;
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
