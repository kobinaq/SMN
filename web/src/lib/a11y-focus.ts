/**
 * Helpers for modal focus management. Pure cycle logic is separated so unit
 * tests can cover wrap behaviour without a browser environment.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((node) => {
    if (node.getAttribute("aria-hidden") === "true") return false;
    if (node.tabIndex < 0) return false;
    if (node.closest("[inert]")) return false;
    const style = typeof window !== "undefined" ? window.getComputedStyle(node) : null;
    if (style && (style.visibility === "hidden" || style.display === "none")) return false;
    return true;
  });
}

/**
 * Returns the item that should receive focus when Tab would leave the trap,
 * or null when the browser should move focus normally inside the list.
 */
export function resolveTabWrapTarget<T>(
  items: T[],
  activeIndex: number,
  shiftKey: boolean,
): T | null {
  if (!items.length) return null;
  if (shiftKey && activeIndex <= 0) return items[items.length - 1];
  if (!shiftKey && (activeIndex < 0 || activeIndex >= items.length - 1)) return items[0];
  return null;
}

/** Imperative Tab wrap used by dialogs. Returns true when focus was moved. */
export function trapTabKey(
  root: ParentNode,
  event: { key: string; shiftKey: boolean; preventDefault: () => void },
  active: Element | null,
): boolean {
  if (event.key !== "Tab") return false;
  const focusables = getFocusableElements(root);
  if (!focusables.length) return false;
  const activeIndex = active instanceof HTMLElement ? focusables.indexOf(active) : -1;
  const target = resolveTabWrapTarget(focusables, activeIndex, event.shiftKey);
  if (!target) return false;
  event.preventDefault();
  target.focus();
  return true;
}
