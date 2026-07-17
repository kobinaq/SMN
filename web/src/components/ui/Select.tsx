"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> & {
  children?: ReactNode;
  options?: SelectOption[];
  /** Compact trigger for toolbars / inline filters */
  size?: "md" | "sm";
};

function optionsFromChildren(children: ReactNode): SelectOption[] {
  const items: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== "option") return;
    const props = child.props as {
      value?: string | number;
      disabled?: boolean;
      children?: ReactNode;
    };
    const label = Children.toArray(props.children)
      .map((part) => (typeof part === "string" || typeof part === "number" ? String(part) : ""))
      .join("")
      .trim();
    const value = props.value != null ? String(props.value) : label;
    items.push({ value, label: label || value, disabled: Boolean(props.disabled) });
  });
  return items;
}

export function Select({
  children,
  options: optionsProp,
  className,
  value,
  defaultValue,
  onChange,
  name,
  id,
  required,
  disabled,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  size = "md",
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const triggerId = id || `${generatedId}-trigger`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hiddenRef = useRef<HTMLSelectElement>(null);

  const options = useMemo(
    () => (optionsProp?.length ? optionsProp : optionsFromChildren(children)),
    [optionsProp, children],
  );

  const enabledIndexes = useMemo(
    () => options.map((item, index) => (!item.disabled ? index : -1)).filter((index) => index >= 0),
    [options],
  );

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() =>
    defaultValue != null ? String(defaultValue) : options.find((item) => !item.disabled)?.value || "",
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = isControlled ? String(value) : uncontrolled;
  const selected = options.find((item) => item.value === current);
  const displayLabel = selected?.label || "Select…";
  const isPlaceholder = !selected || (selected.value === "" && !selected.label);

  function openList() {
    const selectedIndex = options.findIndex((item) => item.value === current && !item.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndexes[0] ?? 0);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function commit(next: string) {
    if (!isControlled) setUncontrolled(next);
    if (hiddenRef.current) hiddenRef.current.value = next;
    onChange?.({
      target: { value: next, name: name || "" },
      currentTarget: { value: next, name: name || "" },
    } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  function moveActive(delta: number) {
    if (!enabledIndexes.length) return;
    const position = enabledIndexes.indexOf(activeIndex);
    const next =
      enabledIndexes[(position < 0 ? 0 : position + delta + enabledIndexes.length) % enabledIndexes.length];
    setActiveIndex(next);
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative min-w-0",
        !className && "w-full rounded-2xl border border-white/10 bg-white/5",
        className,
        open && "border-baby-blue/50",
      )}
    >
      <select
        ref={hiddenRef}
        id={id ? `${id}-native` : undefined}
        name={name}
        required={required}
        disabled={disabled}
        value={current}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
        onChange={() => {
          /* driven by commit() */
        }}
        {...rest}
      >
        {options.map((item) => (
          <option key={`${item.value}-${item.label}`} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          "flex w-full items-center justify-between gap-3 bg-transparent text-left text-white outline-none transition active:scale-[0.99]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
          size === "sm" ? "min-h-0 px-3 py-1.5 text-xs" : "px-4 py-3 text-sm",
        )}
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else openList();
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openList();
            else moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openList();
            else {
              const item = options[activeIndex];
              if (item && !item.disabled) commit(item.value);
            }
          } else if (event.key === "Home" && open) {
            event.preventDefault();
            setActiveIndex(enabledIndexes[0] ?? 0);
          } else if (event.key === "End" && open) {
            event.preventDefault();
            setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? 0);
          }
        }}
      >
        <span className={cn("truncate", isPlaceholder || current === "" ? "font-normal text-white/40" : "font-medium text-white")}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-white/45 transition", open && "rotate-180 text-baby-blue")}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-2xl border border-white/12 bg-[#12161f] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/5"
        >
          {options.map((item, index) => {
            const isSelected = item.value === current;
            const isActive = index === activeIndex;
            return (
              <li
                key={`${item.value}-${item.label}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={item.disabled || undefined}
                data-index={index}
                className={cn(
                  "cursor-pointer rounded-xl px-3 py-2.5 text-sm transition",
                  item.disabled && "cursor-not-allowed text-white/25",
                  !item.disabled && isActive && "bg-baby-blue/15 text-white",
                  !item.disabled && !isActive && "text-white/75 hover:bg-white/5 hover:text-white",
                  isSelected && !item.disabled && "font-medium text-baby-blue",
                )}
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(index);
                }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!item.disabled) commit(item.value);
                }}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
