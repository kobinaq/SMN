import { StaffEmptyState, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function StaffPostsPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/content/posts");
  const payload = await getPayloadClient();
  const posts = await listCollection(payload, staff, "posts", { limit: 100, sort: "-updatedAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Site"
        title="Posts"
        hint="Articles for the public insights feed."
        action={{ href: "/staff/content/posts/new", label: "New post" }}
      />
      <StaffPanel>
        {posts.docs.length ? (
          <StaffTable
            columns={["Title", "Category", "Status", "Updated"]}
            rows={posts.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/content/posts/${doc.id}`,
              cells: [
                doc.title,
                doc.category,
                doc.publishedAt ? "Published" : "Draft",
                doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString("en-GH") : "—",
              ],
            }))}
          />
        ) : (
          <StaffEmptyState
            title="No posts yet"
            steps={[
              { label: "Write a post", href: "/staff/content/posts/new", active: true },
              { label: "Add a cover" },
              { label: "Publish" },
            ]}
            action={{ href: "/staff/content/posts/new", label: "New post" }}
          />
        )}
      </StaffPanel>
    </div>
  );
}
