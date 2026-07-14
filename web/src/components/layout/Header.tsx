"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import { nav } from "@/lib/site";
import { cta } from "@/lib/cta";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function Header() {
  const site = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointer = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [openMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        "pt-[env(safe-area-inset-top)]",
        scrolled || open
          ? "border-b border-white/10 bg-near-black/90 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      {site.announcementBanner ? (
        <div className="border-b border-white/10 bg-deep-blue/90 px-4 py-2 text-center text-xs text-white/80">
          {site.announcementBanner}
        </div>
      ) : null}
      <div className="container-wide flex h-14 items-center justify-between gap-3 sm:h-16 md:h-20">
        <Link href="/" className="relative z-10 flex min-w-0 shrink items-center gap-3">
          <BrandLogo className="h-7 sm:h-8 md:h-9" priority />
        </Link>

        <nav
          ref={navRef}
          className="hidden items-center gap-5 xl:gap-7 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) =>
            "children" in item && item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-1 text-sm text-white/75 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  aria-controls={`${menuId}-${item.label}`}
                  onClick={() =>
                    setOpenMenu((current) => (current === item.label ? null : item.label))
                  }
                  onFocus={() => setOpenMenu(item.label)}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
                <div
                  id={`${menuId}-${item.label}`}
                  className={cn(
                    "absolute left-0 top-full min-w-[220px] pt-3 transition",
                    openMenu === item.label
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                >
                  <div
                    className="rounded-2xl border border-white/10 bg-surface p-2 shadow-2xl"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:outline-none"
                        onClick={() => setOpenMenu(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center text-sm text-white/75 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            href={cta.memberSignIn.href}
            variant="ghost"
            className="px-3 py-2 text-white/70"
            onClick={() => trackEvent("member_signin_click", { location: "header" })}
          >
            {cta.memberSignIn.label}
          </Button>
          <Button
            href={cta.applyCohort.href}
            className="px-5 py-2.5"
            onClick={() => trackEvent("primary_cta_click", { location: "header" })}
          >
            {cta.applyCohort.shortLabel}
          </Button>
        </div>

        <div className="relative z-10 flex items-center gap-2 lg:hidden">
          <Button
            href={cta.applyCohort.href}
            className="min-h-10 px-3 py-2 text-xs sm:px-4 sm:text-sm"
            onClick={() => trackEvent("primary_cta_click", { location: "header_mobile" })}
          >
            Apply
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-near-black transition lg:hidden",
          "top-[calc(3.5rem+env(safe-area-inset-top))] sm:top-[calc(4rem+env(safe-area-inset-top))]",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-white/10 py-1">
              <Link
                href={item.href}
                className="flex min-h-12 items-center font-display text-xl text-white sm:text-2xl"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {"children" in item && item.children ? (
                <div className="mb-3 space-y-1 pl-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="flex min-h-11 items-center text-sm text-white/55"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <div className="mt-auto flex flex-col gap-3 pt-8" onClick={() => setOpen(false)}>
            <Button
              href={cta.applyCohort.href}
              className="w-full"
              onClick={() => trackEvent("primary_cta_click", { location: "mobile_nav" })}
            >
              {cta.applyCohort.label}
            </Button>
            <Button href={cta.memberSignIn.href} variant="ghost" className="w-full">
              {cta.memberSignIn.label}
            </Button>
            <Button
              href={site.whatsappInvite}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              className="w-full"
              onClick={() => trackEvent("whatsapp_click", { location: "mobile_nav" })}
            >
              {cta.whatsapp.communityLabel}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
