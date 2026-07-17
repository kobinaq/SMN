"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Globe, LogOut, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import type { PortalIdentity, PortalNavGroup, PortalNavItem, PortalVariant } from "./types";

function isActivePath(pathname: string, href: string, exactRoots: string[]) {
  if (exactRoots.includes(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({
  item,
  level = 0,
  onNavigate,
  exactRoots,
}: {
  item: PortalNavItem;
  level?: number;
  onNavigate?: () => void;
  exactRoots: string[];
}) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;
  const childActive = hasChildren
    ? item.children!.some((child) => isActivePath(pathname, child.href, exactRoots))
    : false;
  const active = !hasChildren && isActivePath(pathname, item.href, exactRoots);
  const [isOpen, setIsOpen] = useState(childActive);

  // Expand the group when a child route becomes active (adjust state during
  // render via a stored previous value instead of a cascading effect).
  const [wasChildActive, setWasChildActive] = useState(childActive);
  if (childActive !== wasChildActive) {
    setWasChildActive(childActive);
    if (childActive) setIsOpen(true);
  }

  if (hasChildren) {
    return (
      <div className="flex w-full flex-col">
        <button
          type="button"
          className={cn(
            "group flex w-full cursor-pointer items-center justify-between rounded-[6px] px-2.5 py-[7px] transition-all duration-200 select-none",
            childActive
              ? "bg-white/10 font-medium text-white"
              : "text-white/50 hover:bg-white/5 hover:text-white/90",
          )}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                childActive ? "text-white" : "text-white/40 group-hover:text-white/70",
              )}
              strokeWidth={1.5}
            />
            <span className="truncate text-[13px] tracking-wide">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.badge ? (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-baby-blue/15 px-1.5 text-[10px] font-medium text-baby-blue">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            ) : null}
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-white/35 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
              strokeWidth={2}
            />
          </div>
        </button>
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="relative mt-0.5 flex min-h-0 flex-col gap-0.5 overflow-hidden">
            <div
              className="absolute top-0 bottom-0 border-l border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map((child) => (
              <NavItem
                key={child.href}
                item={child}
                level={level + 1}
                onNavigate={onNavigate}
                exactRoots={exactRoots}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex min-h-11 items-center justify-between rounded-[8px] px-2.5 py-[7px] transition-all duration-200 select-none md:min-h-0",
        "ease-[cubic-bezier(0.32,0.72,0,1)]",
        active
          ? "bg-white/[.08] font-medium text-white"
          : "text-white/50 hover:bg-white/5 hover:text-white/90",
      )}
      style={{ paddingLeft: `${level * 12 + 10}px` }}
    >
      {active ? (
        <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full bg-baby-blue" aria-hidden />
      ) : null}
      <div className="flex items-center gap-2.5">
        <item.icon
          className={cn(
            "h-4 w-4 transition-colors",
            active ? "text-baby-blue" : "text-white/40 group-hover:text-white/70",
          )}
          strokeWidth={1.5}
        />
        <span className="truncate text-[13px] tracking-wide">{item.label}</span>
      </div>
      {item.badge ? (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-baby-blue/15 px-1.5 text-[10px] font-medium text-baby-blue">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function PortalSidebar({
  variant,
  identity,
  groups,
  homeHref,
  logoutLabel = "Log out",
  loggingOut,
  onLogout,
  onNavigate,
  className,
}: {
  variant: PortalVariant;
  identity: PortalIdentity;
  groups: PortalNavGroup[];
  homeHref: string;
  logoutLabel?: string;
  loggingOut?: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}) {
  const exactRoots = variant === "member" ? ["/app"] : ["/staff"];
  const initial = identity.name.trim().slice(0, 1).toUpperCase();
  const portalLabel = variant === "member" ? "Member" : "Staff";

  return (
    <aside
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-white/10 bg-surface/90 p-3 font-sans backdrop-blur-md",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2 rounded-lg px-2 py-2">
        <Link
          href={homeHref}
          onClick={onNavigate}
          aria-label={`SMN ${portalLabel.toLowerCase()} home`}
          className="flex min-w-0 items-center gap-3 rounded-md transition hover:bg-white/5"
        >
          <BrandLogo width={96} height={24} className="h-5 shrink-0 sm:h-6" />
          <div className="flex min-w-0 flex-col overflow-hidden">
            <span className="truncate text-[13px] font-medium leading-none text-white">{portalLabel}</span>
            <span className="mt-1 truncate text-[11px] leading-none text-white/40">portal</span>
          </div>
        </Link>
      </div>

      <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[.03] px-2.5 py-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-baby-blue/15 text-[13px] font-semibold text-baby-blue ring-1 ring-inset ring-baby-blue/20">
          {identity.avatarUrl ? (
            <img src={identity.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial || <UserRound className="h-4 w-4" />
          )}
        </span>
        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="truncate text-[13px] font-medium leading-none text-white">{identity.name}</span>
          {identity.subtitle ? (
            <span className="mt-1 truncate text-[11px] leading-none text-white/40">{identity.subtitle}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-1 flex flex-1 flex-col gap-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, idx) => (
          <div key={group.heading ?? idx} className="flex flex-col gap-0.5">
            {group.heading ? (
              <span className="mb-1 px-2.5 text-[11px] font-semibold tracking-wider text-white/35 uppercase">
                {group.heading}
              </span>
            ) : null}
            {group.items.map((item) => (
              <NavItem
                key={item.href + item.label}
                item={item}
                onNavigate={onNavigate}
                exactRoots={exactRoots}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-white/10 pt-4">
        {variant === "staff" ? (
          <Link
            href="/"
            onClick={onNavigate}
            className="group flex items-center gap-2.5 rounded-[6px] px-2.5 py-[7px] text-white/50 transition hover:bg-white/5 hover:text-white/90"
          >
            <Globe className="h-4 w-4 text-white/40 group-hover:text-white/70" strokeWidth={1.5} />
            <span className="text-[13px] tracking-wide">Public website</span>
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="group flex items-center gap-2.5 rounded-[6px] px-2.5 py-[7px] text-left text-white/50 transition hover:bg-white/5 hover:text-white/90 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 text-white/40 group-hover:text-white/70" strokeWidth={1.5} />
          <span className="text-[13px] tracking-wide">{loggingOut ? "…" : logoutLabel}</span>
        </button>
      </div>
    </aside>
  );
}

export function flattenNavItems(groups: PortalNavGroup[]): PortalNavItem[] {
  const walk = (items: PortalNavItem[]): PortalNavItem[] =>
    items.reduce<PortalNavItem[]>((acc, item) => {
      acc.push(item);
      if (item.children) acc.push(...walk(item.children));
      return acc;
    }, []);
  return groups.flatMap((group) => walk(group.items));
}

export function findActiveNavTitle(
  pathname: string,
  groups: PortalNavGroup[],
  exactRoots: string[],
  fallback: string,
) {
  const flat = flattenNavItems(groups).filter((item) => !item.children?.length);
  const match = flat
    .filter((item) => isActivePath(pathname, item.href, exactRoots))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? fallback;
}
