"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top bar during App Router client navigations. Avoids the layout shift
 * that a full-page loading.tsx caused, and skips animation when the user
 * prefers reduced motion.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Defer the first paint so setState is not synchronous inside the effect
    // (react-hooks/set-state-in-effect).
    const start = window.setTimeout(() => {
      setVisible(true);
      setWidth(15);
    }, 0);
    const grow = window.setTimeout(() => setWidth(72), 90);
    const finish = window.setTimeout(() => setWidth(100), 320);
    const hide = window.setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 520);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(grow);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent"
      role="presentation"
      aria-hidden
    >
      <div
        className="h-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
