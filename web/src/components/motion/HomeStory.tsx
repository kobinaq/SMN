"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Orchestrates homepage scroll storytelling (Clapat-inspired). */
export function HomeStory({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const hero = el.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const parts = hero.querySelectorAll("[data-hero-item]");
        const pillars = hero.querySelectorAll("[data-pillar]");

        gsap.fromTo(
          parts,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.25,
          },
        );

        if (pillars.length) {
          gsap.fromTo(
            pillars,
            { autoAlpha: 0, y: 80, rotateY: -18 },
            {
              autoAlpha: 1,
              y: 0,
              rotateY: 0,
              duration: 1.4,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.15,
            },
          );
          gsap.to(pillars, {
            y: (i) => (i % 2 === 0 ? -18 : 14),
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.25,
            delay: 1.5,
          });
        }
      }

      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.14, yPercent: -6 },
          {
            scale: 1,
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-parallax-wrap]") || img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      el.querySelectorAll<HTMLElement>("[data-pin-chapter]").forEach((section) => {
        const lines = section.querySelectorAll("[data-line]");
        if (!lines.length) return;

        gsap.fromTo(
          lines,
          { autoAlpha: 0, y: 36, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll("[data-stagger-item]");
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 40, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.09,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
            },
          },
        );
      });

      // Horizontal rule / section dividers draw in
      el.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rule,
              start: "top 90%",
            },
          },
        );
      });

      // Soft section-to-section wash
      el.querySelectorAll<HTMLElement>("[data-section-fade]").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0.55 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="home-story">
      {children}
    </div>
  );
}
