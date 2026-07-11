"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app", label: "Home" },
  { href: "/app/learning", label: "Learning" },
  { href: "/app/mentors", label: "Mentors" },
  { href: "/app/opportunities", label: "Opportunities" },
  { href: "/app/profile", label: "Profile" },
] as const;

export function AppNav({ memberName }: { memberName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/members/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-near-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex shrink-0 items-center">
            <BrandLogo width={110} height={28} className="h-6 sm:h-7" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active =
                link.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden max-w-[140px] truncate text-sm text-white/50 sm:inline">
            {memberName}
          </span>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white sm:inline-flex"
          >
            {loggingOut ? "…" : "Log out"}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={logout}
              className="rounded-xl px-3 py-3 text-left text-sm text-white/50"
            >
              Log out
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
