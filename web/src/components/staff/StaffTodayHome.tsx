"use client";

import Link from "next/link";
import { useState } from "react";
import {
  StaffActionCard,
  StaffEmptyState,
  StaffMetricGrid,
  StaffPageHeader,
  StaffPanel,
  StaffSection,
  staffOpsChrome,
} from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";
import { DashboardInlineQueues } from "@/components/payload/DashboardInlineQueues";

type AttentionItem = {
  key: string;
  label: string;
  detail: string;
  value: number;
  href: string;
  tone: string;
};

type Metric = { label: string; value: string | number; href: string };
type Health = { label: string; detail: string; tone: string };
type Activity = { label: string; detail: string; href: string; at: string };
type QuickAction = { href: string; label: string };
type MentorItem = { id: string | number; title: string; detail: string };
type OpportunityItem = { id: string | number; title: string; detail: string; status: string };

function readableDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

const toneBorder: Record<string, string> = {
  mint: "border-mint/40",
  amber: "border-amber-300/40",
  violet: "border-purple-300/40",
  red: "border-red-300/40",
  blue: "border-baby-blue/40",
};

export function StaffTodayHome({
  name,
  roleLabel,
  denied,
  attention,
  metrics,
  health,
  activities,
  quickActions,
  inline,
}: {
  name: string;
  roleLabel: string;
  denied?: boolean;
  attention: AttentionItem[];
  metrics: Metric[];
  health: Health[];
  activities: Activity[];
  quickActions: QuickAction[];
  inline: { mentors: MentorItem[]; opportunities: OpportunityItem[] };
}) {
  const primary = attention.slice(0, 3);
  const hasWork = primary.length > 0;
  const [moreOpen, setMoreOpen] = useState(!hasWork);

  const showMentorQueue = primary.some((item) => item.key === "mentors" || item.key === "mentorship-requests");
  const showOppQueue = primary.some(
    (item) => item.key === "opportunities" || item.key === "expiring" || item.key === "sources",
  );

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow={roleLabel}
        title={`Today, ${name}`}
        hint={hasWork ? "Start with what needs a decision." : "Nothing waiting — you're clear."}
        action={{ href: "/", label: "View live site" }}
      />

      {denied ? (
        <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100" role="status">
          Your role can’t open that area. Here’s what you can manage.
        </p>
      ) : null}

      <StaffPanel>
        <StaffSection title="Do next" aside={hasWork ? `${attention.length} waiting` : "All clear"} />
        {hasWork ? (
          <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-3">
            {primary.map((item) => (
              <StaffActionCard
                key={item.key}
                href={item.href}
                value={item.value}
                label={item.label}
                detail={item.detail}
                tone={item.tone as "mint" | "amber" | "violet" | "red" | "blue"}
              />
            ))}
          </div>
        ) : (
          <StaffEmptyState
            title="You're clear"
            description="No queues need a decision right now."
            action={quickActions[0] ? { href: quickActions[0].href, label: quickActions[0].label } : undefined}
          />
        )}
        {!hasWork && quickActions.length > 1 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action) => (
              <Button key={`${action.href}-${action.label}`} href={action.href} variant="secondary">
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </StaffPanel>

      {hasWork && (showMentorQueue || showOppQueue) ? (
        <div
          className={`staff-inline-queues ${staffOpsChrome} [&_.smn-dashboard-section]:rounded-2xl [&_.smn-dashboard-section]:border [&_.smn-dashboard-section]:border-white/10 [&_.smn-dashboard-section]:bg-surface [&_.smn-dashboard-section]:p-5 [&_.smn-ops-row]:rounded-xl [&_.smn-ops-row]:border [&_.smn-ops-row]:border-white/10 [&_.smn-ops-row]:p-3`}
        >
          <StaffPanel>
            <StaffSection title="Resolve here" />
            <DashboardInlineQueues
              mentors={showMentorQueue ? inline.mentors : []}
              opportunities={showOppQueue ? inline.opportunities : []}
            />
          </StaffPanel>
        </div>
      ) : null}

      <div>
        <button
          type="button"
          className="mb-3 text-xs font-medium tracking-wide text-white/45 transition hover:text-white/70"
          onClick={() => setMoreOpen((value) => !value)}
          aria-expanded={moreOpen}
        >
          {moreOpen ? "Hide more today" : "Show more today"}
        </button>
        {moreOpen ? (
          <div className="space-y-6 animate-[staff-fade-in_220ms_cubic-bezier(0.32,0.72,0,1)_both]">
            <div className="grid gap-3 md:grid-cols-3" aria-label="Platform health">
              {health.map((item) => (
                <StaffPanel key={item.label} className={toneBorder[item.tone] || ""}>
                  <b className="text-sm text-white">{item.label}</b>
                  <p className="mt-2 text-xs text-white/50">{item.detail}</p>
                </StaffPanel>
              ))}
            </div>

            <StaffPanel>
              <StaffSection title="Network health" />
              <StaffMetricGrid
                items={metrics.slice(0, 8).map((metric) => ({
                  label: metric.label,
                  value: metric.value,
                }))}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {metrics.slice(0, 4).map((metric) => (
                  <Link
                    key={metric.label}
                    href={metric.href}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/45 transition hover:border-baby-blue/35 hover:text-white"
                  >
                    {metric.label}
                  </Link>
                ))}
              </div>
            </StaffPanel>

            <StaffPanel>
              <StaffSection title="Recent activity" />
              {activities.length ? (
                <div className="space-y-1">
                  {activities.map((item) => (
                    <Link
                      key={`${item.label}-${item.href}-${item.at}`}
                      href={item.href}
                      className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                    >
                      <span>
                        <b className="block text-sm text-white">{item.label}</b>
                        <small className="text-xs text-white/40">{item.detail}</small>
                      </span>
                      <time className="text-xs text-white/35" dateTime={item.at}>
                        {readableDate(item.at)}
                      </time>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/45">No audited staff actions yet.</p>
              )}
            </StaffPanel>
          </div>
        ) : null}
      </div>
    </div>
  );
}
