import Link from "next/link";
import type { ServerProps } from "payload";
import { getAdminWorkspaceBadges } from "@/lib/admin-dashboard";

export default async function AdminWorkspaceNav(props: ServerProps) {
  const workspaces = props.payload && props.user
    ? await getAdminWorkspaceBadges(props.payload, props.user)
    : [
        { href: "/admin", label: "Overview", count: 0 },
        { href: "/admin/course-builder", label: "Course Builder", count: 0 },
        { href: "/admin/member-360", label: "Member 360", count: 0 },
        { href: "/admin/mentorship-operations", label: "Mentorship", count: 0 },
        { href: "/admin/opportunity-operations", label: "Opportunities", count: 0 },
        { href: "/admin/certificate-issuing", label: "Certificates", count: 0 },
      ];

  return (
    <section className="smn-admin-workspaces" aria-labelledby="smn-admin-workspaces-title">
      <b id="smn-admin-workspaces-title">Workspaces</b>
      <nav aria-label="Operational workspaces">
        {workspaces.map((item) => (
          <Link href={item.href} key={item.href}>
            <span>{item.label}</span>
            {item.count > 0 ? <em aria-label={`${item.count} awaiting action`}>{item.count > 99 ? "99+" : item.count}</em> : null}
          </Link>
        ))}
      </nav>
    </section>
  );
}
