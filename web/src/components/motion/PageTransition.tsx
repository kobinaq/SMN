"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    const cover = curtain.current;
    if (!el || reduce) return;

    const ctx = gsap.context(() => {
      if (cover) {
        gsap.fromTo(
          cover,
          { scaleY: 1, transformOrigin: "top" },
          { scaleY: 0, duration: 0.7, ease: "power4.inOut", delay: 0.05 },
        );
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.15 },
      );
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="relative">
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] origin-top bg-deep-blue"
        style={{ transform: "scaleY(0)" }}
      />
      <div ref={ref}>{children}</div>
    </div>
  );
}
