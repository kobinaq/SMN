"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * GrowthX Club–inspired exclusive hero:
 * pure black canvas, blue geometric panels, centered typography, single CTA.
 */
export function HeroExclusive() {
  return (
    <section
      data-hero
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-black pt-20"
    >
      {/* Geometry backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero-geometry.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
        />
        <div className="image-matte-strong" />
      </div>

      {/* Decorative 3D pillars (CSS + GSAP) for depth if image is soft */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[4%] hidden w-[18%] perspective-[900px] md:block"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <div
            key={`l-${i}`}
            data-pillar
            className="absolute bottom-[12%] rounded-md bg-gradient-to-b from-[#3b82f6] via-[#0a2f8f] to-[#04153f] shadow-[0_0_60px_rgba(10,47,143,0.45)]"
            style={{
              left: `${i * 28}%`,
              width: `${42 - i * 6}%`,
              height: `${48 + i * 12}%`,
              opacity: 0.55 - i * 0.08,
              transform: `rotateY(22deg) translateZ(${i * 12}px)`,
            }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-[4%] hidden w-[18%] perspective-[900px] md:block"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <div
            key={`r-${i}`}
            data-pillar
            className="absolute bottom-[12%] right-0 rounded-md bg-gradient-to-b from-[#60a5fa] via-[#0a2f8f] to-[#030d28] shadow-[0_0_60px_rgba(126,182,255,0.25)]"
            style={{
              right: `${i * 28}%`,
              width: `${42 - i * 6}%`,
              height: `${48 + i * 12}%`,
              opacity: 0.55 - i * 0.08,
              transform: `rotateY(-22deg) translateZ(${i * 12}px)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <p
          data-hero-item
          className="mb-6 text-[11px] font-medium uppercase tracking-[0.32em] text-baby-blue/90"
        >
          Social Marketers Network
        </p>
        <h1
          data-hero-item
          className="font-display max-w-4xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-7xl lg:text-[5.25rem]"
        >
          application-based
          <br />
          membership
        </h1>
        <p
          data-hero-item
          className="mt-6 max-w-xl text-sm leading-relaxed text-white/65 md:text-base"
        >
          Strategy, AI, community, and real client work. Not just another course platform.
        </p>
        <div data-hero-item className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/apply" className="min-w-[180px] px-8 py-3.5 text-[13px] tracking-wide">
            Apply for the next cohort
          </Button>
          <Button href="/programs/cohort" variant="secondary" className="min-w-[160px]">
            View cohort
          </Button>
        </div>
        <p data-hero-item className="mt-10 text-xs tracking-[0.18em] text-white/35 uppercase">
          Next cohort {site.cohort.startDate} · {site.cohort.seats} seats · {site.cohort.duration}
        </p>

        <div
          data-hero-item
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-white/40"
        >
          <span>Strategy</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          <span>AI</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          <span>Community</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          <span>Careers</span>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container-wide flex flex-col gap-2 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-white/40">
            Courses on SMN · Live sessions on Google Classroom · Community on WhatsApp
          </p>
          <p className="text-xs text-white/30">Africa-first · Global diaspora welcome</p>
        </div>
      </div>
    </section>
  );
}
