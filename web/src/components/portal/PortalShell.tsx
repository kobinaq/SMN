"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "@/components/ui/icons";
import { focusMainContent, getFocusableElements, trapTabKey } from "@/lib/focus-trap";
import { cn } from "@/lib/utils";
import {
  PortalSidebar,
  findActiveNavTitle,
} from "./PortalSidebar";
import { buildMemberNavGroups, buildStaffNavGroups, type StaffLinkInput } from "./nav-config";
import type { PortalIdentity, PortalVariant } from "./types";

export function PortalShell({
  variant,
  identity,
  staffLinks,
  careerCoachEnabled = false,
  children,
  maxWidth = "6xl",
}: {
  variant: PortalVariant;
  identity: PortalIdentity;
  /** Serializable staff nav links; icons are mapped on the client. */
  staffLinks?: StaffLinkInput[];
  careerCoachEnabled?: boolean;
  children: React.ReactNode;
  maxWidth?: "6xl" | "7xl";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  // Pathname when a drawer link was chosen. Non-null means restore focus to
  // main/h1 after close (once the route settles, or immediately for same-href).
  // Escape / backdrop / menu toggle leave this null so focus returns to the button.
  const pendingNavFocusFromPathRef = useRef<string | null>(null);
  const mobileDrawerTitleId = useId();
  const mobileNavId = useId();

  const groups = useMemo(
    () =>
      variant === "staff"
        ? buildStaffNavGroups(staffLinks ?? [])
        : buildMemberNavGroups({ careerCoachEnabled }),
    [variant, staffLinks, careerCoachEnabled],
  );

  const homeHref = variant === "member" ? "/app" : "/staff";
  const portalLabel = variant === "member" ? "Member" : "Staff";
  const exactRoots = variant === "member" ? ["/app"] : ["/staff"];
  const logoutEndpoint =
    variant === "member" ? "/api/member-auth/logout" : "/api/staff-auth/logout";
  const logoutRedirect = variant === "member" ? "/login" : "/staff/login";
  const activeTitle = findActiveNavTitle(pathname, groups, exactRoots, "Dashboard");

  // Close the mobile drawer whenever the route changes (adjust state during
  // render via a stored previous value — avoids a cascading effect render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const menuButton = mobileMenuButtonRef.current;
    const drawer = mobileDrawerRef.current;
    const firstFocusable = drawer ? getFocusableElements(drawer)[0] : null;
    firstFocusable?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        pendingNavFocusFromPathRef.current = null;
        setMobileOpen(false);
        return;
      }
      if (drawer) trapTabKey(event, drawer);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (pendingNavFocusFromPathRef.current !== null) {
        // Navigating: the effect below moves focus to main/h1 after close.
        return;
      }
      // Prefer the menu button when it is still mounted; fall back to whatever
      // held focus before the drawer opened.
      (menuButton ?? previous)?.focus();
    };
  }, [mobileOpen]);

  // After a drawer link navigation, move focus once the route has changed so
  // the new page's main/h1 is in the DOM.
  useEffect(() => {
    const fromPath = pendingNavFocusFromPathRef.current;
    if (fromPath === null || pathname === fromPath) return;
    pendingNavFocusFromPathRef.current = null;
    focusMainContent();
  }, [pathname]);

  // Same-href drawer links never update pathname; focus main after close.
  useEffect(() => {
    if (mobileOpen) return;
    const fromPath = pendingNavFocusFromPathRef.current;
    if (fromPath === null || pathname !== fromPath) return;
    const timer = window.setTimeout(() => {
      if (pendingNavFocusFromPathRef.current !== fromPath) return;
      pendingNavFocusFromPathRef.current = null;
      focusMainContent();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [mobileOpen, pathname]);

  function closeMobileDrawer() {
    pendingNavFocusFromPathRef.current = null;
    setMobileOpen(false);
  }

  function handleDrawerNavigate() {
    pendingNavFocusFromPathRef.current = pathname;
    setMobileOpen(false);
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch(logoutEndpoint, { method: "POST", credentials: "include" });
    } finally {
      router.push(logoutRedirect);
      router.refresh();
    }
  }

  return (
    <div className="flex h-svh overflow-hidden bg-canvas">
      <a href="#main" className="skip-link" inert={mobileOpen}>
        Skip to content
      </a>

      <div
        className={cn(
          "hidden h-full shrink-0 self-stretch overflow-hidden border-r border-edge-subtle md:block",
          "transition-[width,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          sidebarOpen ? "w-[260px] opacity-100" : "pointer-events-none w-0 border-none opacity-0",
        )}
        aria-hidden={!sidebarOpen || mobileOpen}
        inert={!sidebarOpen || mobileOpen}
      >
        <PortalSidebar
          variant={variant}
          identity={identity}
          groups={groups}
          homeHref={homeHref}
          loggingOut={loggingOut}
          onLogout={logout}
          className="w-[260px] border-none bg-raised"
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-canvas/70 backdrop-blur-md animate-[staff-fade-in_200ms_var(--ease-out)_both]"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={closeMobileDrawer}
          />
          <div
            ref={mobileDrawerRef}
            id={mobileNavId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={mobileDrawerTitleId}
            className="absolute inset-y-0 left-0 w-[260px] shadow-2xl ring-1 ring-white/10 animate-[staff-drawer-in_280ms_cubic-bezier(0.32,0.72,0,1)_both]"
          >
            <h2 id={mobileDrawerTitleId} className="sr-only">
              {portalLabel} navigation
            </h2>
            <PortalSidebar
              variant={variant}
              identity={identity}
              groups={groups}
              homeHref={homeHref}
              loggingOut={loggingOut}
              onLogout={logout}
              onNavigate={handleDrawerNavigate}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-edge-subtle bg-canvas/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] p-1.5 text-text-3 transition-colors hover:bg-inset hover:text-text-1 md:inline-flex"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((value) => !value)}
              inert={mobileOpen}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.5} />
              ) : (
                <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.5} />
              )}
            </button>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-edge text-text-1 transition-colors hover:bg-inset md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobileNavId}
              onClick={() => {
                if (mobileOpen) {
                  closeMobileDrawer();
                  return;
                }
                setMobileOpen(true);
              }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-2 text-sm text-text-3"
              inert={mobileOpen}
            >
              <span className="truncate">{portalLabel}</span>
              <span className="text-text-3/50" aria-hidden>
                /
              </span>
              <span className="truncate font-medium text-text-1" aria-current="page">
                {activeTitle}
              </span>
            </nav>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" inert={mobileOpen}>
          <main
            id="main"
            tabIndex={-1}
            className={cn(
              "mx-auto w-full px-4 py-8 sm:px-6 sm:py-10",
              // No fill-mode "both": retaining the keyframe transform on <main>
              // creates a containing block, so fixed tutor UI scrolls with content.
              "animate-[staff-fade-in_280ms_cubic-bezier(0.32,0.72,0,1)]",
              maxWidth === "7xl" ? "max-w-7xl" : "max-w-6xl",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
