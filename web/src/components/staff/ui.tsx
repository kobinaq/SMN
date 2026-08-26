import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Chip, type ChipTone } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/**
 * Staff-side chrome. These wrap the shared primitives in Surface/Chip rather
 * than defining a second visual language — the staff app and the member app
 * are the same product, and previously they only looked related by accident.
 */

export function StaffPageHeader({
  eyebrow,
  title,
  description,
  hint,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional one-line hint; preferred over long descriptions. */
  hint?: string;
  action?: { href: string; label: string };
  /** Richer actions (buttons, menus) when a single link is not enough. */
  children?: React.ReactNode;
}) {
  const sub = hint || description;
  return (
    <header className="rise mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
        <h1 className={cn("font-display text-2xl text-text-1 sm:text-3xl", eyebrow && "mt-2")}>{title}</h1>
        {sub ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-2">{sub}</p> : null}
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
      ) : action ? (
        <Button href={action.href}>{action.label}</Button>
      ) : null}
    </header>
  );
}

export function StaffPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card as="section" className={className}>
      {children}
    </Card>
  );
}

export function StaffEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[var(--radius-lg)] border border-dashed border-edge px-4 py-8 text-center text-sm text-text-3">
      {children}
    </p>
  );
}

export function StaffSection({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-3", className)}>
      <h2 className="font-display text-xl text-text-1">{title}</h2>
      {aside ? <div className="shrink-0 text-xs text-text-3">{aside}</div> : null}
      {children}
    </div>
  );
}

/**
 * Queue tile on the Today screen. Tone marks urgency, so the eye lands on what
 * actually needs a decision rather than reading every tile in order.
 */
export function StaffActionCard({
  href,
  value,
  label,
  detail,
  tone = "blue",
}: {
  href: string;
  value: string | number;
  label: string;
  detail?: string;
  tone?: "mint" | "amber" | "violet" | "red" | "blue";
}) {
  const toneRing: Record<string, string> = {
    mint: "border-ai/30 hover:border-ai/50",
    amber: "border-warn/30 hover:border-warn/50",
    violet: "border-accent/30 hover:border-accent/50",
    red: "border-danger/30 hover:border-danger/50",
    blue: "border-accent/30 hover:border-accent/50",
  };
  const toneText: Record<string, string> = {
    mint: "text-ai",
    amber: "text-warn",
    violet: "text-accent",
    red: "text-danger",
    blue: "text-accent",
  };
  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[var(--radius-lg)] border bg-raised p-4",
        "transition-[transform,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)] motion-reduce:hover:translate-y-0",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        toneRing[tone] || toneRing.blue,
      )}
    >
      <strong className={cn("tnum font-display text-3xl", toneText[tone] || toneText.blue)}>{value}</strong>
      <span className="min-w-0">
        <b className="block text-sm font-semibold text-text-1">{label}</b>
        {detail ? <span className="mt-1 block text-xs text-text-3">{detail}</span> : null}
      </span>
      <ChevronRight
        className="h-4 w-4 text-text-3 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}

export function StaffEmptyState({
  title,
  description,
  action,
  steps,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  steps?: Array<{ label: string; href?: string; active?: boolean }>;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-edge bg-raised px-5 py-10 text-center">
      <h3 className="font-display text-xl text-text-1">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-text-2">{description}</p> : null}
      {steps?.length ? (
        <ol className="mx-auto mt-6 flex max-w-lg flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center justify-center gap-2 sm:contents">
              {index > 0 ? <span className="hidden text-text-3 sm:mx-2 sm:inline">→</span> : null}
              {step.href && step.active !== false ? (
                <Link href={step.href}>
                  <Chip tone="accent">
                    {index + 1}. {step.label}
                  </Chip>
                </Link>
              ) : (
                <Chip tone={step.active ? "accent" : "neutral"}>
                  {index + 1}. {step.label}
                </Chip>
              )}
            </li>
          ))}
        </ol>
      ) : null}
      {action ? (
        <div className="mt-6">
          <Button href={action.href}>{action.label}</Button>
        </div>
      ) : null}
    </div>
  );
}

export function StaffFilterChips({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string; count?: number }>;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button key={option.id} type="button" role="tab" aria-selected={active} onClick={() => onChange(option.id)}>
            <Chip tone={active ? "accent" : "neutral"}>
              {option.label}
              {typeof option.count === "number" ? <span className="tnum opacity-70">{option.count}</span> : null}
            </Chip>
          </button>
        );
      })}
    </div>
  );
}

export function StaffMetricGrid({
  items,
}: {
  items: Array<{ label: string; value: string | number; tone?: "default" | "accent" | "ai" | "warn" }>;
}) {
  const tones = {
    default: "text-text-1",
    accent: "text-accent",
    ai: "text-ai",
    warn: "text-warn",
  } as const;
  return (
    <div className="rise-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          style={{ "--i": index } as React.CSSProperties}
          className="rounded-[var(--radius-md)] border border-edge-subtle bg-raised px-4 py-3"
        >
          <strong className={cn("tnum block font-display text-2xl leading-none", tones[item.tone ?? "accent"])}>
            {item.value}
          </strong>
          <span className="mt-1.5 block text-xs text-text-3">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Row-linked table. Uses a real <table> with a link inside the first cell
 * rather than nesting a grid inside a colspan cell — the previous version
 * broke column alignment whenever a row had an href and its neighbour didn't.
 */
export function StaffTable({
  columns,
  rows,
  empty = "No records yet.",
}: {
  columns: string[];
  rows: Array<{ key: string; href?: string; cells: React.ReactNode[] }>;
  empty?: string;
}) {
  if (!rows.length) return <StaffEmpty>{empty}</StaffEmpty>;
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-edge-subtle">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-inset text-xs text-text-3">
          <tr>
            {columns.map((column) => (
              <th key={column} className="eyebrow px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="transition-colors duration-[var(--dur-fast)] hover:bg-inset">
              {row.cells.map((cell, index) => (
                <td key={`${row.key}-${index}`} className="border-t border-edge-subtle px-4 py-3 text-text-2">
                  {index === 0 && row.href ? (
                    <Link href={row.href} className="font-medium text-text-1 transition-colors hover:text-accent">
                      {cell}
                    </Link>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Status pill for staff records. Maps common record states onto chip tones. */
export function StaffStatus({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone: ChipTone =
    normalized === "published" || normalized === "valid" || normalized === "approved" || normalized === "confirmed" || normalized === "active"
      ? "ai"
      : normalized === "draft" || normalized === "pending" || normalized === "new" || normalized === "reviewing"
        ? "warn"
        : normalized === "revoked" || normalized === "rejected" || normalized === "cancelled" || normalized === "declined"
          ? "danger"
          : "neutral";
  return <Chip tone={tone}>{value}</Chip>;
}

/**
 * Shared control styling for staff forms. Defined once here so every staff
 * form matches the member app's Input without each one re-declaring it.
 */
export const staffFieldClass =
  "field mt-2 w-full rounded-[var(--radius-md)] border border-edge bg-inset px-3.5 py-2.5 text-base text-text-1 " +
  "placeholder:text-text-3 transition-[border-color,box-shadow] duration-[var(--dur-fast)] " +
  "hover:border-edge-strong focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-bg sm:text-sm";

/**
 * Styles the bare markup rendered by the Payload-side components in
 * components/payload/*. Those render semantic HTML with `smn-*` hooks rather
 * than Tailwind classes, so the styling has to reach them from a parent.
 */
export const staffOpsChrome = [
  // Action button rows
  "[&_.smn-ops-actions]:flex [&_.smn-ops-actions]:flex-wrap [&_.smn-ops-actions]:justify-end [&_.smn-ops-actions]:gap-1.5",
  "[&_.smn-ops-actions_button]:rounded-full [&_.smn-ops-actions_button]:border [&_.smn-ops-actions_button]:border-edge",
  "[&_.smn-ops-actions_button]:bg-inset [&_.smn-ops-actions_button]:px-3 [&_.smn-ops-actions_button]:py-1.5",
  "[&_.smn-ops-actions_button]:text-xs [&_.smn-ops-actions_button]:text-text-1",
  "[&_.smn-ops-actions_button:hover:not(:disabled)]:border-accent/40 [&_.smn-ops-actions_button:disabled]:opacity-40",
  "[&_.smn-ops-actions_span]:text-xs [&_.smn-ops-actions_span]:text-danger",
  // Curriculum reorder controls
  "[&_.smn-curriculum-actions]:flex [&_.smn-curriculum-actions]:flex-wrap [&_.smn-curriculum-actions]:items-center [&_.smn-curriculum-actions]:gap-1.5",
  "[&_.smn-curriculum-actions_button]:rounded-full [&_.smn-curriculum-actions_button]:border [&_.smn-curriculum-actions_button]:border-edge",
  "[&_.smn-curriculum-actions_button]:bg-inset [&_.smn-curriculum-actions_button]:px-2.5 [&_.smn-curriculum-actions_button]:py-1",
  "[&_.smn-curriculum-actions_button]:text-xs [&_.smn-curriculum-actions_button]:text-text-1",
  "[&_.smn-curriculum-actions_select]:rounded-[var(--radius-sm)] [&_.smn-curriculum-actions_select]:border [&_.smn-curriculum-actions_select]:border-edge",
  "[&_.smn-curriculum-actions_select]:bg-overlay [&_.smn-curriculum-actions_select]:px-2 [&_.smn-curriculum-actions_select]:py-1",
  "[&_.smn-curriculum-actions_select]:text-xs [&_.smn-curriculum-actions_select]:text-text-1",
  // Inline forms (member notes, progress overrides, content studio)
  "[&_.smn-note-form]:space-y-3 [&_.smn-override-form]:space-y-3 [&_.smn-content-studio]:space-y-4",
  "[&_.smn-note-form_label]:block [&_.smn-override-form_label]:block [&_.smn-content-studio_label]:block",
  "[&_.smn-note-form_label]:text-sm [&_.smn-override-form_label]:text-sm [&_.smn-content-studio_label]:text-sm",
  "[&_.smn-note-form_label]:text-text-2 [&_.smn-override-form_label]:text-text-2 [&_.smn-content-studio_label]:text-text-2",
  "[&_.smn-ops-form-control]:mt-1.5 [&_.smn-ops-form-control]:w-full",
  // Every control inside those forms shares one look
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:mt-1.5",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:mt-1.5",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:mt-1.5",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:w-full",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:w-full",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:w-full",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:rounded-[var(--radius-md)]",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:rounded-[var(--radius-md)]",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:rounded-[var(--radius-md)]",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:border",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:border",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:border",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:border-edge",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:border-edge",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:border-edge",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:bg-inset",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:bg-inset",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:bg-inset",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:px-3.5",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:px-3.5",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:px-3.5",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:py-2.5",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:py-2.5",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:py-2.5",
  "[&_.smn-note-form_select,&_.smn-note-form_textarea,&_.smn-note-form_input]:text-text-1",
  "[&_.smn-override-form_select,&_.smn-override-form_textarea,&_.smn-override-form_input]:text-text-1",
  "[&_.smn-content-studio_select,&_.smn-content-studio_textarea,&_.smn-content-studio_input]:text-text-1",
  // Submit buttons in those forms
  "[&_.smn-note-form_button,&_.smn-override-form_button]:mt-2",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:rounded-full",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:bg-accent-strong",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:px-4",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:py-2",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:text-sm",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:font-semibold",
  "[&_.smn-note-form_button,&_.smn-override-form_button]:text-[#08111f]",
  "[&_.smn-content-studio_button]:rounded-full [&_.smn-content-studio_button]:border [&_.smn-content-studio_button]:border-edge",
  "[&_.smn-content-studio_button]:bg-inset [&_.smn-content-studio_button]:px-3 [&_.smn-content-studio_button]:py-1.5",
  "[&_.smn-content-studio_button]:text-xs [&_.smn-content-studio_button]:text-text-1",
  // Certificate + dashboard rows
  "[&_.smn-certificate-list]:space-y-2",
  "[&_.smn-certificate-list_.smn-ops-row]:flex [&_.smn-certificate-list_.smn-ops-row]:items-start",
  "[&_.smn-certificate-list_.smn-ops-row]:gap-3 [&_.smn-certificate-list_.smn-ops-row]:rounded-[var(--radius-md)]",
  "[&_.smn-certificate-list_.smn-ops-row]:border [&_.smn-certificate-list_.smn-ops-row]:border-edge-subtle",
  "[&_.smn-certificate-list_.smn-ops-row]:p-3",
  "[&_.smn-certificate-list_b]:block [&_.smn-certificate-list_b]:text-sm [&_.smn-certificate-list_b]:text-text-1",
  "[&_.smn-certificate-list_small]:mt-1 [&_.smn-certificate-list_small]:block [&_.smn-certificate-list_small]:text-xs [&_.smn-certificate-list_small]:text-text-3",
  // Analytics + workspace grids
  "[&_.smn-analytics-grid]:grid [&_.smn-analytics-grid]:gap-3 [&_.smn-analytics-grid]:sm:grid-cols-2 [&_.smn-analytics-grid]:lg:grid-cols-4",
  "[&_.smn-analytics-grid>div]:rounded-[var(--radius-md)] [&_.smn-analytics-grid>div]:border [&_.smn-analytics-grid>div]:border-edge-subtle",
  "[&_.smn-analytics-grid>div]:bg-raised [&_.smn-analytics-grid>div]:px-4 [&_.smn-analytics-grid>div]:py-3",
  "[&_.smn-analytics-grid_strong]:block [&_.smn-analytics-grid_strong]:font-display [&_.smn-analytics-grid_strong]:text-2xl [&_.smn-analytics-grid_strong]:text-accent",
  "[&_.smn-analytics-grid_span]:mt-1.5 [&_.smn-analytics-grid_span]:block [&_.smn-analytics-grid_span]:text-xs [&_.smn-analytics-grid_span]:text-text-3",
  "[&_.smn-workspace-grid]:grid [&_.smn-workspace-grid]:gap-4 [&_.smn-workspace-grid]:md:grid-cols-2",
  "[&_.smn-workspace-grid_article]:rounded-[var(--radius-lg)] [&_.smn-workspace-grid_article]:border [&_.smn-workspace-grid_article]:border-edge-subtle",
  "[&_.smn-workspace-grid_article]:bg-raised [&_.smn-workspace-grid_article]:p-4",
  "[&_.smn-empty]:text-sm [&_.smn-empty]:text-text-3",
].join(" ");

export function StaffOpsRow({
  title,
  detail,
  children,
}: {
  title: React.ReactNode;
  detail?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-edge-subtle py-3 transition-colors last:border-0 hover:bg-inset sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <b className="block text-sm font-semibold text-text-1">{title}</b>
        {detail ? <span className="mt-1 block text-xs text-text-3">{detail}</span> : null}
      </div>
      {children ? <div className={cn("shrink-0", staffOpsChrome)}>{children}</div> : null}
    </div>
  );
}

export function StaffFormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-text-2">
      {label}
      {children}
    </label>
  );
}
