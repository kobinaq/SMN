import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonAttachmentsEditor } from "@/components/staff/LessonAttachmentsEditor";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { lmsLessonFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "lms-lessons", id, 1);
  } catch {
    notFound();
  }

  const courseId = relationId(doc.course);
  const backHref = courseId ? `/staff/learning?course=${courseId}&tab=curriculum` : "/staff/learning?tab=curriculum";
  const rawAttachments = (doc.attachments || []) as Array<{
    label?: string | null;
    file?: { id?: string | number; url?: string | null } | string | number | null;
  }>;
  const attachments = rawAttachments.flatMap((item, index) => {
    const file = item?.file;
    const fileId =
      file && typeof file === "object" && file.id != null
        ? file.id
        : typeof file === "string" || typeof file === "number"
          ? file
          : null;
    if (fileId == null || fileId === "") return [];
    return [
      {
        key: `${fileId}-${index}`,
        label: String(item?.label || "Download"),
        fileId,
        url: file && typeof file === "object" ? String(file.url || "") : "",
      },
    ];
  });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Course Builder"
        title={String(doc.title || "Lesson")}
        description="Add video, reading text, article links, and downloadable documents — YouTube is optional, not required."
      />
      <p className="text-sm text-white/45">
        <Link href={backHref} className="text-baby-blue hover:underline">
          ← Back to curriculum
        </Link>
      </p>

      <StaffPanel>
        <div className="mb-5 rounded-2xl border border-baby-blue/25 bg-baby-blue/10 px-4 py-3 text-sm text-white/70">
          <p className="font-medium text-white">Learning materials for this lesson</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-white/60">
            <li>
              <b className="text-white/80">Lesson type</b> — choose Video, Reading/article, Download, or Assignment
            </li>
            <li>
              <b className="text-white/80">Lesson text</b> — paste or write the reading content / instructions
            </li>
            <li>
              <b className="text-white/80">External resource URL</b> — link to an article, Notion page, or Google Doc
            </li>
            <li>
              <b className="text-white/80">YouTube URL</b> — only if this lesson has a video
            </li>
            <li>
              <b className="text-white/80">Documents</b> — upload PDFs and files in the section below
            </li>
          </ul>
        </div>
        <StaffRecordForm
          collection="lms-lessons"
          action="update"
          id={doc.id}
          fields={lmsLessonFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            summary: doc.summary,
            lessonType: doc.lessonType,
            youtubeUrl: doc.youtubeUrl || "",
            durationMinutes: doc.durationMinutes ?? "",
            body: doc.body || "",
            resourceLabel: doc.resourceLabel || "",
            resourceUrl: doc.resourceUrl || "",
            status: doc.status || "draft",
          }}
          submitLabel="Save lesson"
          onSuccessHref={`/staff/learning/lessons/${doc.id}`}
        />
      </StaffPanel>

      <StaffPanel>
        <LessonAttachmentsEditor lessonId={doc.id} initial={attachments} />
      </StaffPanel>

      <StaffPanel>
        <StaffDeleteButton collection="lms-lessons" id={doc.id} redirectTo={backHref} />
      </StaffPanel>
    </div>
  );
}
