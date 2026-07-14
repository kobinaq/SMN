"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PortalSidebar,
  findActiveNavTitle,
} from "./PortalSidebar";
import { buildStaffNavGroups, memberNavGroups, type StaffLinkInput } from "./nav-config";
import type { PortalIdentity, PortalVariant } from "./types";

export function PortalShell({
  variant,
  identity,
  staffLinks,
  children,
  maxWidth = "6xl",
}: {
  variant: PortalVariant;
  identity: PortalIdentity;
  /** Serializable staff nav links; icons are mapped on the client. */
  staffLinks?: StaffLinkInput[];
  children: React.ReactNode;
  maxWidth?: "6xl" | "7xl";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const groups = useMemo(
    () => (variant === "staff" ? buildStaffNavGroups(staffLinks ?? []) : memberNavGroups),
    [variant, staffLinks],
  );

  const homeHref = variant === "member" ? "/app" : "/staff";
  const portalLabel = variant === "member" ? "Member" : "Staff";
  const exactRoots = variant === "member" ? ["/app"] : ["/staff"];
  const logoutEndpoint =
    variant === "member" ? "/api/member-auth/logout" : "/api/staff-auth/logout";
  const logoutRedirect = variant === "member" ? "/login" : "/staff/login";
  const activeTitle = findActiveNavTitle(pathname, groups, exactRoots, "Dashboard");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <div className="flex min-h-svh bg-near-black">
      <div
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 overflow-hidden border-r border-white/10 transition-all duration-300 ease-in-out md:block",
          sidebarOpen ? "w-[260px] opacity-100" : "pointer-events-none w-0 border-none opacity-0",
        )}
        aria-hidden={!sidebarOpen}
      >
        <PortalSidebar
          variant={variant}
          identity={identity}
          groups={groups}
          homeHref={homeHref}
          loggingOut={loggingOut}
          onLogout={logout}
          className="w-[260px] border-none bg-surface/90"
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-near-black/60 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px] shadow-2xl ring-1 ring-white/10">
            <PortalSidebar
              variant={variant}
              identity={identity}
              groups={groups}
              homeHref={homeHref}
              loggingOut={loggingOut}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-near-black/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="hidden rounded-md p-1.5 text-white/50 transition hover:bg-white/5 hover:text-white md:inline-flex"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setSidebarOpen((value) => !value)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.5} />
              ) : (
                <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white transition hover:bg-white/5 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm text-white/45">
              <span className="truncate">{portalLabel}</span>
              <span>/</span>
              <span className="truncate font-medium text-white">{activeTitle}</span>
            </div>
          </div>
        </header>

        <main
          className={cn(
            "mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10",
            maxWidth === "7xl" ? "max-w-7xl" : "max-w-6xl",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
