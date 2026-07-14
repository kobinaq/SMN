import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { postFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, lexicalToPlainText, relationId, toDateTimeLocal } from "@/lib/staff/records";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/content/posts");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "posts", id, 0);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Content" title={doc.title} description={`Slug · ${doc.slug}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="posts"
          action="update"
          id={doc.id}
          fields={postFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            category: doc.category,
            excerpt: doc.excerpt,
            contentText: lexicalToPlainText(doc.content),
            cover: relationId(doc.cover),
            publishedAt: toDateTimeLocal(doc.publishedAt),
            readTime: doc.readTime || "",
          }}
          submitLabel="Save post"
          onSuccessHref={`/staff/content/posts/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="posts" id={doc.id} redirectTo="/staff/content/posts" />
        </div>
      </StaffPanel>
    </div>
  );
}
