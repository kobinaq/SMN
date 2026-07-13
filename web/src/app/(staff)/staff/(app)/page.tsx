import Link from "next/link";
import { requireStaff, staffDisplayName } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getAdminOpsSnapshot } from "@/lib/admin-dashboard";
import { DashboardInlineQueues } from "@/components/payload/DashboardInlineQueues";
import { StaffEmpty, StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";

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

export default async function StaffHomePage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const staff = await requireStaff([], "/staff");
  const payload = await getPayloadClient();
  const snapshot = await getAdminOpsSnapshot(payload, staff);
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow={`SMN operations · ${(snapshot.role || "staff").replace("-", " ")}`}
        title={`Welcome back, ${staffDisplayName(staff)}.`}
        description="Priorities for your role, platform health, and the next useful action."
        action={{ href: "/", label: "View live site" }}
      />

      {params.denied ? (
        <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100" role="status">
          You do not have access to that area. Showing what you can manage instead.
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        {snapshot.health.map((item) => (
          <StaffPanel key={item.label} className={toneBorder[item.tone] || ""}>
            <b className="text-sm text-white">{item.label}</b>
            <p className="mt-2 text-xs text-white/50">{item.detail}</p>
          </StaffPanel>
        ))}
      </div>

      <StaffPanel>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Attention required</p>
            <h2 className="mt-1 font-display text-2xl text-white">What needs action</h2>
          </div>
          <small className="text-xs text-white/40">
            {snapshot.attention.length ? `${snapshot.attention.length} active queues` : "All clear"}
          </small>
        </div>
        {snapshot.attention.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {snapshot.attention.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border bg-near-black/40 p-4 transition hover:bg-white/[.03] ${toneBorder[item.tone] || "border-white/10"}`}
              >
                <strong className="text-3xl text-baby-blue">{item.value}</strong>
                <span>
                  <b className="block text-white">{item.label}</b>
                  <span className="mt-1 block text-xs text-white/45">{item.detail}</span>
                </span>
                <i className="text-xs not-italic text-white/35">Open →</i>
              </Link>
            ))}
          </div>
        ) : (
          <StaffEmpty>No tracked operational issues need attention for your role.</StaffEmpty>
        )}
      </StaffPanel>

      <div className="staff-inline-queues [&_.smn-dashboard-section]:rounded-2xl [&_.smn-dashboard-section]:border [&_.smn-dashboard-section]:border-white/10 [&_.smn-dashboard-section]:bg-surface [&_.smn-dashboard-section]:p-5 [&_.smn-ops-row]:rounded-xl [&_.smn-ops-row]:border [&_.smn-ops-row]:border-white/10 [&_.smn-ops-row]:p-3">
        <DashboardInlineQueues mentors={snapshot.inline.mentors} opportunities={snapshot.inline.opportunities} />
      </div>

      <StaffPanel>
        <div className="mb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Quick actions</p>
          <h2 className="mt-1 font-display text-2xl text-white">Keep things moving</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {snapshot.quickActions.map((action) => (
            <Button key={`${action.href}-${action.label}`} href={action.href} variant="secondary">
              {action.label}
            </Button>
          ))}
        </div>
      </StaffPanel>

      <StaffPanel>
        <div className="mb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Network health</p>
          <h2 className="mt-1 font-display text-2xl text-white">Decision metrics</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {snapshot.metrics.map((metric) => (
            <Link key={metric.label} href={metric.href} className="rounded-2xl border border-white/10 bg-near-black/30 p-4 transition hover:border-baby-blue/40">
              <strong className="block text-2xl text-baby-blue">{metric.value}</strong>
              <span className="mt-1 block text-xs text-white/45">{metric.label}</span>
            </Link>
          ))}
        </div>
      </StaffPanel>

      <StaffPanel>
        <div className="mb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Recent activity</p>
          <h2 className="mt-1 font-display text-2xl text-white">Meaningful changes</h2>
        </div>
        {snapshot.activities.length ? (
          <div className="space-y-1">
            {snapshot.activities.map((item) => (
              <Link key={`${item.label}-${item.href}-${item.at}`} href={item.href} className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[.03]">
                <span>
                  <b className="block text-sm text-white">{item.label}</b>
                  <small className="text-xs text-white/40">{item.detail}</small>
                </span>
                <time className="text-xs text-white/35" dateTime={item.at}>{readableDate(item.at)}</time>
              </Link>
            ))}
          </div>
        ) : (
          <StaffEmpty>No audited staff actions yet. Queue resolutions and overrides will appear here.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
