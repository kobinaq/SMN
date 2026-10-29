/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FOCUSABLE_SELECTOR,
  focusMainContent,
  getFocusableElements,
  trapTabKey,
} from "./focus-trap";

function mount(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFocusableElements", () => {
  it("collects interactive descendants and skips inert or aria-hidden ones", () => {
    const root = mount(`
      <a href="/a">A</a>
      <button type="button">B</button>
      <div inert><a href="/hidden">Hidden</a></div>
      <a href="/c" aria-hidden="true">C</a>
      <button type="button" disabled>D</button>
      <input type="hidden" />
      <a href="/e">E</a>
    `);

    const found = getFocusableElements(root).map((el) => el.textContent);
    expect(found).toEqual(["A", "B", "E"]);
    expect(FOCUSABLE_SELECTOR).toContain("button:not([disabled])");
  });
});

describe("trapTabKey", () => {
  it("wraps forward Tab from the last focusable to the first", () => {
    const root = mount(`
      <button type="button" id="first">First</button>
      <a href="/last" id="last">Last</a>
    `);
    const last = root.querySelector<HTMLElement>("#last")!;
    last.focus();

    const preventDefault = vi.fn();
    const handled = trapTabKey({ key: "Tab", shiftKey: false, preventDefault }, root);

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(root.querySelector("#first"));
  });

  it("wraps Shift+Tab from the first focusable to the last", () => {
    const root = mount(`
      <button type="button" id="first">First</button>
      <a href="/last" id="last">Last</a>
    `);
    const first = root.querySelector<HTMLElement>("#first")!;
    first.focus();

    const preventDefault = vi.fn();
    const handled = trapTabKey({ key: "Tab", shiftKey: true, preventDefault }, root);

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(root.querySelector("#last"));
  });

  it("ignores non-Tab keys", () => {
    const root = mount(`<button type="button">Only</button>`);
    const preventDefault = vi.fn();
    expect(trapTabKey({ key: "Escape", shiftKey: false, preventDefault }, root)).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});

describe("focusMainContent", () => {
  it("focuses the h1 inside #main when present", () => {
    mount(`
      <main id="main" tabindex="-1">
        <h1>Dashboard</h1>
        <p>Body</p>
      </main>
    `);

    const focused = focusMainContent();
    const heading = document.querySelector("h1");
    expect(focused).toBe(heading);
    expect(document.activeElement).toBe(heading);
    expect(heading?.getAttribute("tabindex")).toBe("-1");
  });

  it("falls back to #main when there is no h1", () => {
    mount(`<main id="main" tabindex="-1"><p>Body</p></main>`);

    const main = document.getElementById("main");
    expect(focusMainContent()).toBe(main);
    expect(document.activeElement).toBe(main);
  });
});
