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

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest("[inert]") && el.getAttribute("aria-hidden") !== "true",
  );
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
