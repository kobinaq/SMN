import Link from "next/link";
import type { ServerProps } from "payload";

type Metric = { label: string; value: number; href: string; tone: string };

export default async function AdminDashboard({ payload, user }: ServerProps) {
  const [members, mentors, opportunities, requests] = await Promise.all([
    payload.count({ collection: "members", overrideAccess: true }),
    payload.count({ collection: "mentors", overrideAccess: true, where: { status: { equals: "draft" } } }),
    payload.count({ collection: "opportunities", overrideAccess: true, where: { status: { equals: "pending" } } }),
    payload.count({ collection: "mentorship-requests", overrideAccess: true, where: { status: { equals: "new" } } }),
  ]);
  const metrics: Metric[] = [
    { label: "Members", value: members.totalDocs, href: "/admin/collections/members", tone: "blue" },
    { label: "Mentors to review", value: mentors.totalDocs, href: "/admin/collections/mentors?where[status][equals]=draft", tone: "mint" },
    { label: "Jobs to review", value: opportunities.totalDocs, href: "/admin/collections/opportunities?where[status][equals]=pending", tone: "amber" },
    { label: "New mentor requests", value: requests.totalDocs, href: "/admin/collections/mentorship-requests?where[status][equals]=new", tone: "violet" },
  ];
  const email = user && "email" in user ? String(user.email || "") : "";
  const name = user && "name" in user && user.name ? String(user.name) : email.split("@")[0] || "team";
  return (
    <div className="smn-dashboard">
      <section className="smn-dashboard-hero">
        <div><span className="smn-eyebrow">SMN operations</span><h1>Welcome back, {name}.</h1><p>Here is what needs attention across the Network today.</p></div>
        <Link className="smn-site-link" href="/" target="_blank" rel="noreferrer">View live site <span aria-hidden="true">↗</span></Link>
      </section>
      <section className="smn-metrics" aria-label="Operational overview">
        {metrics.map((metric) => <Link className={`smn-metric smn-metric--${metric.tone}`} href={metric.href} key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>Open queue →</small></Link>)}
      </section>
      <section className="smn-quick-actions">
        <div><span className="smn-eyebrow">Quick actions</span><h2>Keep things moving</h2></div>
        <nav aria-label="Quick actions">
          <Link href="/admin/collections/opportunities/create">Add opportunity</Link>
          <Link href="/admin/collections/opportunity-sources/create">Add job source</Link>
          <Link href="/admin/collections/posts/create">Write insight</Link>
          <Link href="/admin/collections/events/create">Create event</Link>
        </nav>
      </section>
    </div>
  );
}