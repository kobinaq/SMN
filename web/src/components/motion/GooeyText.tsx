"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const filterId = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    if (!texts.length) return;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let raf = 0;
    let cancelled = false;

    const setMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;

      const f = Math.max(fraction, 0.0001);
      text2Ref.current.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
      text2Ref.current.style.opacity = String(Math.pow(f, 0.4));

      const inv = Math.max(1 - fraction, 0.0001);
      text1Ref.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      text1Ref.current.style.opacity = String(Math.pow(inv, 0.4));
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "none";
        text2Ref.current.style.opacity = "1";
        text1Ref.current.style.filter = "none";
        text1Ref.current.style.opacity = "0";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts[1 % texts.length];
      text1Ref.current.style.opacity = "0";
      text2Ref.current.style.opacity = "1";
      text1Ref.current.style.filter = "none";
      text2Ref.current.style.filter = "none";
    }

    function animate() {
      if (cancelled) return;
      raf = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [texts, morphTime, cooldownTime]);

  const layerClass = cn(
    "absolute inset-0 flex items-center justify-center",
    "select-none text-center whitespace-nowrap",
    "text-6xl md:text-[60pt]",
    "text-white",
    textClassName,
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="relative h-full w-full"
        style={{ filter: `url(#${filterId})` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Invisible sizer so the box keeps height of the longest word */}
        <span
          className={cn(layerClass, "relative invisible pointer-events-none")}
          aria-hidden
        >
          {texts.reduce((a, b) => (a.length >= b.length ? a : b), "")}
        </span>
        <span ref={text1Ref} className={layerClass} />
        <span ref={text2Ref} className={layerClass} />
      </div>
    </div>
  );
}
