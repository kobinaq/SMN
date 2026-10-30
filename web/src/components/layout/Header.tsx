"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown } from "@/components/ui/icons";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import { nav } from "@/lib/site";
import { cta } from "@/lib/cta";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { getFocusableElements, trapTabKey } from "@/lib/focus-trap";

function pathMatches(pathname: string, href: string) {
  // Exact for `/` and `/connect` so /connect/mentors marks Mentors only.
  if (href === "/" || href === "/connect") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Same pattern as ConfirmDialog: settle on the first client render without setState-in-effect. */
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function Header() {
  const site = useSiteSettings();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const mounted = useMounted();
  const menuId = useId();
  const panelId = useId();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    const first = panel ? getFocusableElements(panel)[0] : null;
    first?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (panel) trapTabKey(event, panel);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      (toggle ?? previous)?.focus();
    };
  }, [open]);

  // Close the drawer after client navigation.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  const mobilePanel =
    mounted &&
    createPortal(
      <div
        ref={panelRef}
        id={panelId}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] bg-canvas transition lg:hidden",
          "top-[calc(3.5rem+env(safe-area-inset-top))] sm:top-[calc(4rem+env(safe-area-inset-top))]",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="Mobile menu"
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-edge px-4 text-sm text-text-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden />
              Close menu
            </button>
          </div>
          <nav aria-label="Mobile">
            {nav.map((item) => {
              const pageCurrent =
                "children" in item && item.children
                  ? pathname === item.href
                  : pathMatches(pathname, item.href);
              return (
                <div key={item.label} className="border-b border-edge-subtle py-1">
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center font-display text-xl text-text-1 sm:text-2xl"
                    aria-current={pageCurrent ? "page" : undefined}
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
                          className="flex min-h-11 items-center text-sm text-text-2"
                          aria-current={pathMatches(pathname, child.href) ? "page" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
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
            {site.whatsappInvite ? (
              <a
                href={site.whatsappInvite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-3 text-center text-xs text-text-3 underline-offset-2 hover:underline"
                onClick={() => trackEvent("whatsapp_click", { location: "mobile_nav" })}
              >
                {cta.whatsapp.communityLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition duration-300",
          "pt-[env(safe-area-inset-top)]",
          scrolled || open
            ? "border-b border-edge-subtle bg-canvas/90 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        {site.announcementBanner ? (
          <div className="border-b border-edge-subtle bg-accent-strong/90 px-4 py-2 text-center text-xs text-text-2">
            {site.announcementBanner}
          </div>
        ) : null}
        <div className="container-wide flex h-14 items-center justify-between gap-3 sm:h-16 md:h-20">
          <Link href="/" className="relative z-10 flex min-h-11 min-w-0 shrink items-center gap-3">
            <BrandLogo className="h-10 sm:h-11 md:h-14" priority />
          </Link>

          <nav
            ref={navRef}
            className="hidden items-center gap-4 xl:gap-7 lg:flex"
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
                    className="inline-flex min-h-11 items-center gap-1 text-sm text-text-2 transition hover:text-text-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                    aria-controls={`${menuId}-${item.label}`}
                    aria-current={pathname === item.href ? "page" : undefined}
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
                      className=" border border-edge-subtle bg-raised p-2 shadow-2xl"
                      role="menu"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          className="flex min-h-11 items-center px-4 py-3 text-sm text-text-2 transition hover:bg-inset hover:text-text-1 focus-visible:bg-inset focus-visible:outline-none"
                          aria-current={pathMatches(pathname, child.href) ? "page" : undefined}
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
                  className="inline-flex min-h-11 items-center text-sm text-text-2 transition hover:text-text-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-current={pathMatches(pathname, item.href) ? "page" : undefined}
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
              className="px-3 py-2 text-text-2"
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
              className="min-h-11 px-3 py-2 text-xs sm:px-4 sm:text-sm"
              onClick={() => trackEvent("primary_cta_click", { location: "header_mobile" })}
            >
              {cta.applyCohort.shortLabel}
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-edge text-text-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      {mobilePanel}
    </>
  );
}
