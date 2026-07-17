import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { staffEase, staffMotionClass } from "@/components/staff/motion";

export function StaffPageHeader({
  eyebrow,
  title,
  description,
  hint,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional one-line hint; preferred over long descriptions. */
  hint?: string;
  action?: { href: string; label: string };
}) {
  const sub = hint || description;
  return (
    <header className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", staffMotionClass.fadeIn)}>
      <div>
        {eyebrow ? <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">{eyebrow}</p> : null}
        <h1 className={cn("font-display text-3xl text-white sm:text-4xl", eyebrow ? "mt-2" : "")}>{title}</h1>
        {sub ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">{sub}</p> : null}
      </div>
      {action ? <Button href={action.href}>{action.label}</Button> : null}
    </header>
  );
}

export function StaffPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-surface p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function StaffEmpty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/45">{children}</p>;
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
      <h2 className="font-display text-xl text-white sm:text-2xl">{title}</h2>
      {aside ? <div className="shrink-0 text-xs text-white/40">{aside}</div> : null}
      {children}
    </div>
  );
}

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
  const toneBorder: Record<string, string> = {
    mint: "border-mint/35 hover:border-mint/55",
    amber: "border-amber-300/35 hover:border-amber-300/55",
    violet: "border-purple-300/35 hover:border-purple-300/55",
    red: "border-red-300/35 hover:border-red-300/55",
    blue: "border-baby-blue/35 hover:border-baby-blue/55",
  };
  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border bg-near-black/35 p-4 transition",
        "hover:bg-white/[.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue",
        staffMotionClass.press,
        toneBorder[tone] || toneBorder.blue,
      )}
      style={{ transitionTimingFunction: staffEase }}
    >
      <strong className="text-3xl tabular-nums text-baby-blue">{value}</strong>
      <span className="min-w-0">
        <b className="block text-sm text-white">{label}</b>
        {detail ? <span className="mt-1 block text-xs text-white/45">{detail}</span> : null}
      </span>
      <ChevronRight
        className="h-4 w-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/60"
        strokeWidth={1.5}
        style={{ transitionTimingFunction: staffEase }}
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
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[.02] px-5 py-10 text-center">
      <h3 className="font-display text-xl text-white">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-white/45">{description}</p> : null}
      {steps?.length ? (
        <ol className="mx-auto mt-6 flex max-w-lg flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center justify-center gap-2 sm:contents">
              {index > 0 ? <span className="hidden text-white/20 sm:mx-2 sm:inline">→</span> : null}
              {step.href && step.active !== false ? (
                <Link
                  href={step.href}
                  className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-3 py-1.5 text-xs text-baby-blue transition"
                >
                  {index + 1}. {step.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs",
                    step.active ? "border-baby-blue/40 bg-baby-blue/15 text-baby-blue" : "border-white/10 text-white/35",
                  )}
                >
                  {index + 1}. {step.label}
                </span>
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
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              active
                ? "border-baby-blue/45 bg-baby-blue/15 text-baby-blue"
                : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
            )}
            style={{ transitionTimingFunction: staffEase }}
          >
            {option.label}
            {typeof option.count === "number" ? (
              <span className={cn("ml-1.5 tabular-nums", active ? "text-baby-blue/80" : "text-white/35")}>{option.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function StaffMetricGrid({ items }: { items: Array<{ label: string; value: string | number }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-surface p-4">
          <strong className="block text-2xl text-baby-blue">{item.value}</strong>
          <span className="mt-1 block text-xs text-white/45">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function StaffTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<{ key: string; href?: string; cells: React.ReactNode[] }>;
}) {
  if (!rows.length) return <StaffEmpty>No records yet.</StaffEmpty>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[.03] text-xs uppercase tracking-wider text-white/40">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const content = (
              <>
                {row.cells.map((cell, index) => (
                  <td key={`${row.key}-${index}`} className="border-t border-white/5 px-4 py-3 text-white/75">
                    {cell}
                  </td>
                ))}
              </>
            );
            return row.href ? (
              <tr key={row.key} className="transition hover:bg-white/[.03]">
                <td colSpan={columns.length} className="p-0">
                  <Link href={row.href} className="grid" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
                    {row.cells.map((cell, index) => (
                      <span key={`${row.key}-link-${index}`} className="border-t border-white/5 px-4 py-3 text-white/75">
                        {cell}
                      </span>
                    ))}
                  </Link>
                </td>
              </tr>
            ) : (
              <tr key={row.key}>{content}</tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const staffFieldClass =
  "field mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

/** Styles Payload action/form chrome when reused on the staff portal. */
export const staffOpsChrome =
  "[&_.smn-ops-actions]:flex [&_.smn-ops-actions]:flex-wrap [&_.smn-ops-actions]:justify-end [&_.smn-ops-actions]:gap-1.5 " +
  "[&_.smn-ops-actions_button]:rounded-full [&_.smn-ops-actions_button]:border [&_.smn-ops-actions_button]:border-white/15 " +
  "[&_.smn-ops-actions_button]:bg-white/5 [&_.smn-ops-actions_button]:px-3 [&_.smn-ops-actions_button]:py-1.5 " +
  "[&_.smn-ops-actions_button]:text-xs [&_.smn-ops-actions_button]:text-white/80 " +
  "[&_.smn-ops-actions_button:hover:not(:disabled)]:border-baby-blue/40 [&_.smn-ops-actions_button:disabled]:opacity-40 " +
  "[&_.smn-ops-actions_span]:text-xs [&_.smn-ops-actions_span]:text-red-300 " +
  "[&_.smn-curriculum-actions]:flex [&_.smn-curriculum-actions]:flex-wrap [&_.smn-curriculum-actions]:items-center [&_.smn-curriculum-actions]:gap-1.5 " +
  "[&_.smn-curriculum-actions_button]:rounded-full [&_.smn-curriculum-actions_button]:border [&_.smn-curriculum-actions_button]:border-white/15 " +
  "[&_.smn-curriculum-actions_button]:bg-white/5 [&_.smn-curriculum-actions_button]:px-2.5 [&_.smn-curriculum-actions_button]:py-1 " +
  "[&_.smn-curriculum-actions_button]:text-xs [&_.smn-curriculum-actions_button]:text-white/80 " +
  "[&_.smn-curriculum-actions_select]:rounded-xl [&_.smn-curriculum-actions_select]:border [&_.smn-curriculum-actions_select]:border-white/15 " +
  "[&_.smn-curriculum-actions_select]:bg-near-black [&_.smn-curriculum-actions_select]:px-2 [&_.smn-curriculum-actions_select]:py-1 " +
  "[&_.smn-curriculum-actions_select]:text-xs [&_.smn-curriculum-actions_select]:text-white " +
  "[&_.smn-note-form]:space-y-3 [&_.smn-override-form]:space-y-3 " +
  "[&_.smn-note-form_label]:block [&_.smn-override-form_label]:block " +
  "[&_.smn-note-form_label]:text-sm [&_.smn-override-form_label]:text-sm " +
  "[&_.smn-note-form_label]:text-white/70 [&_.smn-override-form_label]:text-white/70 " +
  "[&_.smn-note-form_select]:mt-1 [&_.smn-override-form_select]:mt-1 " +
  "[&_.smn-note-form_select]:w-full [&_.smn-override-form_select]:w-full " +
  "[&_.smn-note-form_select]:rounded-2xl [&_.smn-override-form_select]:rounded-2xl " +
  "[&_.smn-note-form_select]:border [&_.smn-override-form_select]:border " +
  "[&_.smn-note-form_select]:border-white/10 [&_.smn-override-form_select]:border-white/10 " +
  "[&_.smn-note-form_select]:bg-white/5 [&_.smn-override-form_select]:bg-white/5 " +
  "[&_.smn-note-form_select]:px-4 [&_.smn-override-form_select]:px-4 " +
  "[&_.smn-note-form_select]:py-3 [&_.smn-override-form_select]:py-3 " +
  "[&_.smn-note-form_select]:text-white [&_.smn-override-form_select]:text-white " +
  "[&_.smn-note-form_textarea]:mt-1 [&_.smn-override-form_textarea]:mt-1 " +
  "[&_.smn-note-form_textarea]:w-full [&_.smn-override-form_textarea]:w-full " +
  "[&_.smn-note-form_textarea]:rounded-2xl [&_.smn-override-form_textarea]:rounded-2xl " +
  "[&_.smn-note-form_textarea]:border [&_.smn-override-form_textarea]:border " +
  "[&_.smn-note-form_textarea]:border-white/10 [&_.smn-override-form_textarea]:border-white/10 " +
  "[&_.smn-note-form_textarea]:bg-white/5 [&_.smn-override-form_textarea]:bg-white/5 " +
  "[&_.smn-note-form_textarea]:px-4 [&_.smn-override-form_textarea]:px-4 " +
  "[&_.smn-note-form_textarea]:py-3 [&_.smn-override-form_textarea]:py-3 " +
  "[&_.smn-note-form_textarea]:text-white [&_.smn-override-form_textarea]:text-white " +
  "[&_.smn-note-form_button]:mt-2 [&_.smn-override-form_button]:mt-2 " +
  "[&_.smn-note-form_button]:rounded-full [&_.smn-override-form_button]:rounded-full " +
  "[&_.smn-note-form_button]:border [&_.smn-override-form_button]:border " +
  "[&_.smn-note-form_button]:border-baby-blue/40 [&_.smn-override-form_button]:border-baby-blue/40 " +
  "[&_.smn-note-form_button]:bg-baby-blue/15 [&_.smn-override-form_button]:bg-baby-blue/15 " +
  "[&_.smn-note-form_button]:px-4 [&_.smn-override-form_button]:px-4 " +
  "[&_.smn-note-form_button]:py-2 [&_.smn-override-form_button]:py-2 " +
  "[&_.smn-note-form_button]:text-sm [&_.smn-override-form_button]:text-sm " +
  "[&_.smn-note-form_button]:text-baby-blue [&_.smn-override-form_button]:text-baby-blue " +
  "[&_.smn-certificate-list]:space-y-2 " +
  "[&_.smn-certificate-list_.smn-ops-row]:flex [&_.smn-certificate-list_.smn-ops-row]:items-start " +
  "[&_.smn-certificate-list_.smn-ops-row]:gap-3 [&_.smn-certificate-list_.smn-ops-row]:rounded-xl " +
  "[&_.smn-certificate-list_.smn-ops-row]:border [&_.smn-certificate-list_.smn-ops-row]:border-white/10 " +
  "[&_.smn-certificate-list_.smn-ops-row]:p-3 " +
  "[&_.smn-certificate-list_b]:block [&_.smn-certificate-list_b]:text-sm [&_.smn-certificate-list_b]:text-white " +
  "[&_.smn-certificate-list_small]:mt-1 [&_.smn-certificate-list_small]:block [&_.smn-certificate-list_small]:text-xs [&_.smn-certificate-list_small]:text-white/45 " +
  "[&_.smn-content-studio]:space-y-4 " +
  "[&_.smn-content-studio_label]:block [&_.smn-content-studio_label]:text-sm [&_.smn-content-studio_label]:text-white/70 " +
  "[&_.smn-content-studio_input]:mt-1 [&_.smn-content-studio_textarea]:mt-1 [&_.smn-content-studio_select]:mt-1 " +
  "[&_.smn-content-studio_input]:w-full [&_.smn-content-studio_textarea]:w-full [&_.smn-content-studio_select]:w-full " +
  "[&_.smn-content-studio_input]:rounded-2xl [&_.smn-content-studio_textarea]:rounded-2xl [&_.smn-content-studio_select]:rounded-2xl " +
  "[&_.smn-content-studio_input]:border [&_.smn-content-studio_textarea]:border [&_.smn-content-studio_select]:border " +
  "[&_.smn-content-studio_input]:border-white/10 [&_.smn-content-studio_textarea]:border-white/10 [&_.smn-content-studio_select]:border-white/10 " +
  "[&_.smn-content-studio_input]:bg-white/5 [&_.smn-content-studio_textarea]:bg-white/5 [&_.smn-content-studio_select]:bg-white/5 " +
  "[&_.smn-content-studio_input]:px-4 [&_.smn-content-studio_textarea]:px-4 [&_.smn-content-studio_select]:px-4 " +
  "[&_.smn-content-studio_input]:py-3 [&_.smn-content-studio_textarea]:py-3 [&_.smn-content-studio_select]:py-3 " +
  "[&_.smn-content-studio_input]:text-white [&_.smn-content-studio_textarea]:text-white [&_.smn-content-studio_select]:text-white " +
  "[&_.smn-content-studio_button]:rounded-full [&_.smn-content-studio_button]:border [&_.smn-content-studio_button]:border-white/15 " +
  "[&_.smn-content-studio_button]:bg-white/5 [&_.smn-content-studio_button]:px-3 [&_.smn-content-studio_button]:py-1.5 " +
  "[&_.smn-content-studio_button]:text-xs [&_.smn-content-studio_button]:text-white/80 " +
  "[&_.smn-analytics-grid]:grid [&_.smn-analytics-grid]:gap-3 [&_.smn-analytics-grid]:sm:grid-cols-2 [&_.smn-analytics-grid]:lg:grid-cols-4 " +
  "[&_.smn-analytics-grid>div]:rounded-2xl [&_.smn-analytics-grid>div]:border [&_.smn-analytics-grid>div]:border-white/10 " +
  "[&_.smn-analytics-grid>div]:bg-surface [&_.smn-analytics-grid>div]:p-4 " +
  "[&_.smn-analytics-grid_strong]:block [&_.smn-analytics-grid_strong]:text-2xl [&_.smn-analytics-grid_strong]:text-baby-blue " +
  "[&_.smn-analytics-grid_span]:mt-1 [&_.smn-analytics-grid_span]:block [&_.smn-analytics-grid_span]:text-xs [&_.smn-analytics-grid_span]:text-white/45 " +
  "[&_.smn-workspace-grid]:grid [&_.smn-workspace-grid]:gap-4 [&_.smn-workspace-grid]:md:grid-cols-2 " +
  "[&_.smn-workspace-grid_article]:rounded-2xl [&_.smn-workspace-grid_article]:border [&_.smn-workspace-grid_article]:border-white/10 " +
  "[&_.smn-workspace-grid_article]:bg-near-black/30 [&_.smn-workspace-grid_article]:p-4 " +
  "[&_.smn-empty]:text-sm [&_.smn-empty]:text-white/45";

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
    <div className="flex flex-col gap-3 border-b border-white/5 py-3 transition last:border-0 hover:bg-white/[.02] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <b className="block text-sm text-white">{title}</b>
        {detail ? <span className="mt-1 block text-xs text-white/45">{detail}</span> : null}
      </div>
      {children ? <div className={`shrink-0 ${staffOpsChrome}`}>{children}</div> : null}
    </div>
  );
}

export function StaffFormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-white/70">
      {label}
      {children}
    </label>
  );
}
