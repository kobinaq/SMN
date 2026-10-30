"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Same-origin internal navigations only: not new-tab, modifiers, hash-only, or same URL. */
function isInternalNavClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const anchor = target.closest("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  // Same URL (path + query): do not start the bar.
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }
  return true;
}

/**
 * Watches the route. Lives inside Suspense because useSearchParams would
 * otherwise opt the site layout out of static rendering. That boundary can
 * mount later than the rest of the page, so it only reports route changes;
 * the click listener lives in the outer component.
 */
function RouteChangeWatcher({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  const first = useRef(true);
  const callback = useRef(onRouteChange);

  useEffect(() => {
    callback.current = onRouteChange;
  }, [onRouteChange]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Defer finish so a same-tick start (query-only soft nav) can paint first.
    const frame = window.requestAnimationFrame(() => {
      callback.current();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search]);

  return null;
}

/**
 * Thin top bar during App Router client navigations. Starts on internal link
 * click and finishes when the pathname or searchParams change. With
 * prefers-reduced-motion, shows a static indicator instead of nothing.
 *
 * The click listener is attached here, outside the Suspense boundary, so it
 * is live as soon as the layout hydrates. Once attached it sets
 * data-navigation-ready on <html>, which e2e tests wait for before clicking.
 */
export function NavigationProgress() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [staticBar, setStaticBar] = useState(false);
  const navigating = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const startProgress = useCallback(() => {
    clearTimers();
    navigating.current = true;
    const reduced = prefersReducedMotion();
    setStaticBar(reduced);
    setVisible(true);
    if (reduced) {
      setWidth(100);
      return;
    }
    setWidth(15);
    timers.current.push(window.setTimeout(() => setWidth(72), 90));
  }, [clearTimers]);

  const finishProgress = useCallback(() => {
    if (!navigating.current) return;
    navigating.current = false;
    clearTimers();
    const reduced = prefersReducedMotion();
    setStaticBar(reduced);
    setVisible(true);
    setWidth(100);
    timers.current.push(
      window.setTimeout(
        () => {
          setVisible(false);
          setWidth(0);
          setStaticBar(false);
        },
        reduced ? 180 : 220,
      ),
    );
  }, [clearTimers]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isInternalNavClick(event)) startProgress();
    };
    const root = document.documentElement;
    document.addEventListener("click", onClick, true);
    root.setAttribute("data-navigation-ready", "");
    return () => {
      document.removeEventListener("click", onClick, true);
      root.removeAttribute("data-navigation-ready");
      clearTimers();
    };
  }, [clearTimers, startProgress]);

  return (
    <>
      <Suspense fallback={null}>
        <RouteChangeWatcher onRouteChange={finishProgress} />
      </Suspense>
      {visible ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent"
          role="progressbar"
          aria-hidden
          data-navigation-progress=""
          data-reduced-motion={staticBar ? "true" : undefined}
        >
          <div
            className={
              staticBar
                ? "h-full w-full bg-accent"
                : "h-full bg-accent transition-[width] duration-300 ease-out"
            }
            style={staticBar ? undefined : { width: `${width}%` }}
          />
        </div>
      ) : null}
    </>
  );
}
