import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
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
        eyebrow="Content"
        title="Posts"
        description="Publish articles for the public insights feed. Leave publish time blank to keep a draft."
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
          <StaffEmpty>No posts yet. Create the first article for the insights feed.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
