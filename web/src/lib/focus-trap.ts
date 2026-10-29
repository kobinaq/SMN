/**
 * Keyboard focus helpers for modal/drawer surfaces. Kept free of React so
 * unit tests can cover the Tab wrap logic without a DOM testing library.
 */

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function isRendered(el: HTMLElement): boolean {
  if (typeof window === "undefined") return true;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  // Explicitly collapsed controls (not "layout not measured yet").
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  if (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width === 0 &&
    height === 0 &&
    (style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden")
  ) {
    return false;
  }
  return true;
}

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    // Inputs can match the input: selector even with tabindex="-1" (honeypots).
    if (el.tabIndex < 0) return false;
    if (el.hasAttribute("hidden") || el.closest("[hidden]")) return false;
    if (el.closest("[inert]")) return false;
    if (el.getAttribute("aria-hidden") === "true" || el.closest('[aria-hidden="true"]')) return false;
    if (el.closest("fieldset[disabled]")) return false;
    if ("disabled" in el && Boolean((el as HTMLButtonElement).disabled)) return false;
    if (!isRendered(el)) return false;
    return true;
  });
}

/** Cycle Tab / Shift+Tab inside `container`. Returns true when it handled the key. */
export function trapTabKey(event: Pick<KeyboardEvent, "key" | "shiftKey" | "preventDefault">, container: ParentNode): boolean {
  if (event.key !== "Tab") return false;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return false;

  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  const active = typeof document !== "undefined" ? document.activeElement : null;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
      return true;
    }
    return false;
  }

  if (active === last || !container.contains(active)) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}

/**
 * After a mobile drawer navigation, move focus to the new page's h1 when
 * present, otherwise the main landmark. Ensures the heading is programmatically
 * focusable without changing its Tab order.
 */
export function focusMainContent(root: ParentNode = document): HTMLElement | null {
  const main =
    (root instanceof Document ? root.getElementById("main") : root.querySelector("#main")) ??
    root.querySelector("main");
  if (!(main instanceof HTMLElement)) return null;

  const heading = main.querySelector("h1");
  const target = heading instanceof HTMLElement ? heading : main;
  if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) {
    target.tabIndex = -1;
  }
  target.focus();
  return target;
}
