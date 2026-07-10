"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

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

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      <div className="container-wide flex h-14 items-center justify-between gap-3 sm:h-16 md:h-20">
        <Link href="/" className="relative z-10 flex min-w-0 shrink items-center gap-3">
          <Image
            src="/images/Logos/Logo on white.png"
            alt={site.name}
            width={314}
            height={161}
            className="h-7 w-auto sm:h-8 md:h-9"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {nav.map((item) =>
            "children" in item && item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setProgramsOpen(true)}
                onMouseLeave={() => setProgramsOpen(false)}
              >
                <button
                  className="inline-flex min-h-10 items-center gap-1 text-sm text-white/75 transition hover:text-white"
                  aria-expanded={programsOpen}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[220px] pt-3 transition",
                    programsOpen
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                >
                  <div className="rounded-2xl border border-white/10 bg-surface p-2 shadow-2xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
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
                className="inline-flex min-h-10 items-center text-sm text-white/75 transition hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/community" variant="ghost" className="px-4 py-2">
            Join Discord
          </Button>
          <Button href="/apply" className="px-5 py-2.5">
            Apply Now
          </Button>
        </div>

        <div className="relative z-10 flex items-center gap-2 lg:hidden">
          <Button href="/apply" className="min-h-10 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Apply
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-near-black transition lg:hidden",
          "top-[calc(3.5rem+env(safe-area-inset-top))] sm:top-[calc(4rem+env(safe-area-inset-top))]",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
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
            <Button href="/apply" className="w-full">
              Apply Now
            </Button>
            <Button href="/community" variant="secondary" className="w-full">
              Join Discord
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
