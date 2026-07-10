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
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-near-black/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image
            src="/brand/logo-on-blue.png"
            alt={site.name}
            width={160}
            height={48}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) =>
            "children" in item && item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setProgramsOpen(true)}
                onMouseLeave={() => setProgramsOpen(false)}
              >
                <button
                  className="inline-flex items-center gap-1 text-sm text-white/75 transition hover:text-white"
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
                className="text-sm text-white/75 transition hover:text-white"
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

        <button
          type="button"
          className="relative z-10 rounded-full border border-white/15 p-2 text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 bg-near-black/98 backdrop-blur-xl transition lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="container-page flex h-[calc(100dvh-4rem)] flex-col gap-2 overflow-y-auto py-8">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-white/10 py-3">
              <Link
                href={item.href}
                className="font-display text-2xl text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {"children" in item && item.children ? (
                <div className="mt-3 space-y-2 pl-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block text-sm text-white/60"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <div className="mt-6 flex flex-col gap-3" onClick={() => setOpen(false)}>
            <Button href="/apply">Apply Now</Button>
            <Button href="/community" variant="secondary">
              Join Discord
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
