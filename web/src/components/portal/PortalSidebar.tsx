"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Globe, LogOut, UserRound } from "@/components/ui/icons";
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
            "group flex w-full cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-2 select-none",
            "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
            childActive
              ? "bg-inset font-medium text-text-1"
              : "text-text-2 hover:bg-inset hover:text-text-1",
          )}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                childActive ? "text-text-1" : "text-text-3 group-hover:text-text-2",
              )}
              strokeWidth={1.5}
            />
            <span className="truncate text-[13px] tracking-wide">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.badge ? (
              <span className="tnum flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-bg px-1.5 text-[10px] font-semibold text-accent">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            ) : null}
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-text-3 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]",
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
              className="absolute top-0 bottom-0 border-l border-edge-subtle"
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
        "group relative flex min-h-11 items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-2 select-none md:min-h-0",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
        active
          ? "bg-accent-bg font-medium text-text-1"
          : "text-text-2 hover:bg-inset hover:text-text-1",
      )}
      style={{ paddingLeft: `${level * 12 + 10}px` }}
    >
      {active ? (
        <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent" aria-hidden />
      ) : null}
      <div className="flex items-center gap-2.5">
        <item.icon
          className={cn(
            "h-4 w-4 transition-colors",
            active ? "text-accent" : "text-text-3 group-hover:text-text-2",
          )}
          strokeWidth={1.5}
        />
        <span className="truncate text-[13px] tracking-wide">{item.label}</span>
      </div>
      {item.badge ? (
        <span className="tnum flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-bg px-1.5 text-[10px] font-semibold text-accent">
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
        "flex h-full max-h-full w-[260px] flex-col border-r border-edge-subtle bg-raised p-3 font-sans",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-2 rounded-lg px-2 py-2">
        <Link
          href={homeHref}
          onClick={onNavigate}
          aria-label={`SMN ${portalLabel.toLowerCase()} home`}
          className="flex min-w-0 items-center gap-3 rounded-[var(--radius-sm)] p-1 transition-colors hover:bg-inset"
        >
          <BrandLogo width={96} height={24} className="h-5 shrink-0 sm:h-6" />
          <div className="flex min-w-0 flex-col overflow-hidden">
            <span className="truncate text-[13px] font-medium leading-none text-text-1">{portalLabel}</span>
            <span className="mt-1 truncate text-[11px] leading-none text-text-3">portal</span>
          </div>
        </Link>
      </div>

      <div className="mb-3 flex shrink-0 items-center gap-2.5 rounded-[var(--radius-md)] border border-edge-subtle bg-inset px-2.5 py-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-accent-bg text-[13px] font-semibold text-accent">
          {identity.avatarUrl ? (
            <img src={identity.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial || <UserRound className="h-4 w-4" />
          )}
        </span>
        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="truncate text-[13px] font-medium leading-none text-text-1">{identity.name}</span>
          {identity.subtitle ? (
            <span className="mt-1 truncate text-[11px] leading-none text-text-3">{identity.subtitle}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, idx) => (
          <div key={group.heading ?? idx} className="flex flex-col gap-0.5">
            {group.heading ? (
              <span className="eyebrow mb-1.5 px-2.5 text-text-3">
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

      <div className="mt-auto flex shrink-0 flex-col gap-0.5 border-t border-edge-subtle pt-4">
        {variant === "staff" ? (
          <Link
            href="/"
            onClick={onNavigate}
            className="group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-text-2 transition-colors hover:bg-inset hover:text-text-1"
          >
            <Globe className="h-4 w-4 text-text-3 group-hover:text-text-2" strokeWidth={1.5} />
            <span className="text-[13px] tracking-wide">Public website</span>
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-text-2 transition-colors hover:bg-inset hover:text-text-1 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 text-text-3 group-hover:text-text-2" strokeWidth={1.5} />
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
  // Parents stay in the pool (not just leaves): a page under a parent's own
  // href but not any specific child — e.g. /staff/learning/courses/2 under
  // Learning's Self-paced/Cohorts split — still needs a title. Sorting by
  // href length still prefers the more specific child when one matches.
  const flat = flattenNavItems(groups);
  const match = flat
    .filter((item) => isActivePath(pathname, item.href, exactRoots))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? fallback;
}
