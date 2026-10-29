/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { FOCUSABLE_SELECTOR, getFocusableElements, trapTabKey } from "./focus-trap";

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

  it("skips tabindex=-1 honeypots even when they match the input selector", () => {
    const root = mount(`
      <input name="website" class="hidden" tabindex="-1" autocomplete="off" />
      <button type="button">Topic</button>
      <input name="goal" />
    `);
    // Tailwind "hidden" is display:none; also force it for happy-dom.
    root.querySelector<HTMLElement>('input[name="website"]')!.style.display = "none";

    const found = getFocusableElements(root).map((el) => el.getAttribute("name") || el.textContent);
    expect(found).toEqual(["Topic", "goal"]);
  });

  it("skips explicitly collapsed and visibility-hidden controls", () => {
    const root = mount(`
      <button type="button" id="ok">OK</button>
      <button type="button" id="ghost">Ghost</button>
      <a href="/v" id="invisible">V</a>
    `);
    const ghost = root.querySelector<HTMLElement>("#ghost")!;
    ghost.style.width = "0px";
    ghost.style.height = "0px";
    ghost.style.overflow = "hidden";
    const invisible = root.querySelector<HTMLElement>("#invisible")!;
    invisible.style.visibility = "hidden";

    expect(getFocusableElements(root).map((el) => el.id)).toEqual(["ok"]);
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

  it("skips honeypots when finding the wrap targets", () => {
    const root = mount(`
      <input name="website" tabindex="-1" />
      <button type="button" id="first">First</button>
      <button type="button" id="last">Last</button>
    `);
    root.querySelector<HTMLElement>('input[name="website"]')!.style.display = "none";
    const last = root.querySelector<HTMLElement>("#last")!;
    last.focus();

    const preventDefault = vi.fn();
    trapTabKey({ key: "Tab", shiftKey: false, preventDefault }, root);
    expect(document.activeElement).toBe(root.querySelector("#first"));
  });
});
