import Link from "next/link";
import type { ServerProps } from "payload";
import { getAdminOpsSnapshot } from "@/lib/admin-dashboard";
import { DashboardInlineQueues } from "./DashboardInlineQueues";

function readableDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminDashboard({ payload, user }: ServerProps) {
  const snapshot = await getAdminOpsSnapshot(payload, user);
  const email = user && "email" in user ? String(user.email || "") : "";
  const name = user && "name" in user && user.name ? String(user.name) : email.split("@")[0] || "team";
  const roleLabel = snapshot.role ? snapshot.role.replace("-", " ") : "staff";

  return (
    <main className="smn-dashboard">
      <section className="smn-dashboard-hero">
        <div>
          <span className="smn-eyebrow">SMN operations · {roleLabel}</span>
          <h1>Welcome back, {name}.</h1>
          <p>Priorities for your role, platform health, and the next useful action—without collection hopping.</p>
        </div>
        <Link className="smn-site-link" href="/" target="_blank">
          View live site ↗
        </Link>
      </section>

      <section className="smn-health-strip" aria-label="Platform health">
        {snapshot.health.map((item) => (
          <div className={`smn-health-chip smn-health-chip--${item.tone}`} key={item.label}>
            <b>{item.label}</b>
            <span>{item.detail}</span>
          </div>
        ))}
      </section>

      <section className="smn-dashboard-section">
        <div className="smn-section-heading">
          <div>
            <span className="smn-eyebrow">Attention required</span>
            <h2>What needs action</h2>
          </div>
          <small>
            {snapshot.attention.length
              ? `${snapshot.attention.length} active queues · sorted by urgency`
              : "All tracked queues are clear"}
          </small>
        </div>
        {snapshot.attention.length ? (
          <div className="smn-attention-grid">
            {snapshot.attention.map((item) => (
              <Link className={`smn-attention smn-attention--${item.tone}`} href={item.href} key={item.key}>
                <strong>{item.value}</strong>
                <div>
                  <b>{item.label}</b>
                  <span>{item.detail}</span>
                </div>
                <i>Open workspace →</i>
              </Link>
            ))}
          </div>
        ) : (
          <p className="smn-empty">No tracked operational issues need attention for your role.</p>
        )}
      </section>

      <DashboardInlineQueues mentors={snapshot.inline.mentors} opportunities={snapshot.inline.opportunities} />

      <section className="smn-quick-actions">
        <div>
          <span className="smn-eyebrow">Quick actions</span>
          <h2>Keep things moving</h2>
        </div>
        <nav aria-label="Quick actions">
          {snapshot.quickActions.map((action) => (
            <Link href={action.href} key={`${action.href}-${action.label}`}>
              {action.label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="smn-dashboard-section">
        <div className="smn-section-heading">
          <div>
            <span className="smn-eyebrow">Platform overview</span>
            <h2>Network health</h2>
          </div>
          <small>Decision metrics · last 30 days where noted</small>
        </div>
        <div className="smn-overview-grid">
          {snapshot.metrics.map((metric) => (
            <Link className="smn-overview-metric" href={metric.href} key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="smn-dashboard-section">
        <div className="smn-section-heading">
          <div>
            <span className="smn-eyebrow">Recent activity</span>
            <h2>Meaningful changes</h2>
          </div>
          <small>Audited staff actions</small>
        </div>
        {snapshot.activities.length ? (
          <div className="smn-activity-list">
            {snapshot.activities.map((item) => (
              <Link href={item.href} key={`${item.label}-${item.href}-${item.at}`}>
                <span>
                  <b>{item.label}</b>
                  <small>{item.detail}</small>
                </span>
                <time dateTime={item.at}>{readableDate(item.at)}</time>
              </Link>
            ))}
          </div>
        ) : (
          <p className="smn-empty">No audited staff actions yet. Queue resolutions and overrides will appear here.</p>
        )}
      </section>
    </main>
  );
}
