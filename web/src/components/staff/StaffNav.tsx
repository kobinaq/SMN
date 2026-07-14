"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

export type StaffNavLink = {
  href: string;
  label: string;
  count?: number;
  group?: string;
};

const fallbackLinks: StaffNavLink[] = [
  { href: "/staff", label: "Home", group: "Home" },
  { href: "/staff/learning", label: "Courses", group: "Learning" },
  { href: "/staff/members", label: "Members", group: "Members" },
  { href: "/staff/mentorship", label: "Mentorship", group: "Mentorship" },
  { href: "/staff/opportunities", label: "Opportunities", group: "Opportunities" },
  { href: "/staff/certificates", label: "Certificates", group: "Credentials" },
  { href: "/staff/content/posts", label: "Posts", group: "Content" },
  { href: "/staff/content/resources", label: "Resources", group: "Content" },
  { href: "/staff/content/media", label: "Media", group: "Content" },
  { href: "/staff/website/courses", label: "Catalogue", group: "Website" },
  { href: "/staff/website/events", label: "Events", group: "Website" },
  { href: "/staff/website/stories", label: "Stories", group: "Website" },
  { href: "/staff/website/settings", label: "Site settings", group: "Website" },
  { href: "/staff/system/users", label: "Staff users", group: "System" },
  { href: "/staff/system/audit", label: "Audit log", group: "System" },
];

export function StaffNav({
  staffName,
  staffRole,
  links = fallbackLinks,
}: {
  staffName: string;
  staffRole: string;
  links?: StaffNavLink[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/staff-auth/logout", { method: "POST", credentials: "include" });
    } finally {
      router.push("/staff/login");
      router.refresh();
    }
  }

  const primary = links.filter((link) =>
    ["/staff", "/staff/learning", "/staff/members", "/staff/mentorship", "/staff/opportunities", "/staff/certificates"].includes(link.href)
    || link.href === "/staff",
  );
  const more = links.filter((link) => !primary.includes(link));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-near-black/90 shadow-[0_8px_32px_rgba(0,0,0,.18)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link href="/staff" aria-label="SMN staff home" className="flex shrink-0 items-center rounded-xl p-1.5 transition hover:bg-white/5">
            <BrandLogo width={110} height={28} className="h-6 sm:h-7" />
          </Link>
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Operational workspaces">
            {primary.map((link) => {
              const active = link.href === "/staff" ? pathname === "/staff" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition",
                    active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/[.04] hover:text-white",
                  )}
                >
                  {link.label}
                  {link.count ? <em className="rounded-full bg-baby-blue/15 px-1.5 text-[10px] font-semibold not-italic text-baby-blue">{link.count > 99 ? "99+" : link.count}</em> : null}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 sm:flex">
            <span className="max-w-[140px] truncate text-sm text-white/75">{staffName}</span>
            <span className="text-xs capitalize text-white/35">{staffRole}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="hidden rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white sm:inline-flex"
          >
            {loggingOut ? "…" : "Log out"}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/5 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-white/10 px-4 py-3 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Staff menu">
            {[...primary, ...more].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
              >
                <span>{link.label}</span>
                {link.count ? <em className="rounded-full bg-baby-blue/15 px-2 text-[10px] font-semibold not-italic text-baby-blue">{link.count}</em> : null}
              </Link>
            ))}
            <button type="button" onClick={logout} className="rounded-xl px-3 py-3 text-left text-sm text-white/50">
              Log out
            </button>
          </nav>
        </div>
      ) : null}
      <div className="hidden border-t border-white/5 xl:block">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {more.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition",
                  active ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/[.04] hover:text-white/70",
                )}
              >
                {link.label}
                {link.count ? ` · ${link.count}` : ""}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
