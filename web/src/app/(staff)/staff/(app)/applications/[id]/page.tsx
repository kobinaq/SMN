import Link from "next/link";
import { notFound } from "next/navigation";
import { AdmitActions } from "@/components/staff/AdmitActions";
import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getCollectionDoc, relationId, staffAccess } from "@/lib/staff/records";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "support", "analyst", "learning"], "/staff/applications");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "cohort-applications", id, 1);
  } catch {
    notFound();
  }

  const courses = await payload.find({
    collection: "lms-courses",
    depth: 0,
    limit: 100,
    sort: "title",
    ...staffAccess(staff),
  });

  const course = doc.course && typeof doc.course === "object" ? doc.course : null;
  const courseId = relationId(doc.course);
  const member = doc.member && typeof doc.member === "object" ? doc.member : null;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Applications"
        title={String(doc.name || "Application")}
        hint="Grant portal access now, or email a Paystack link first."
      />
      <p className="text-sm text-white/45">
        <Link href="/staff/applications" className="text-baby-blue hover:underline">
          ← All applications
        </Link>
      </p>

      <StaffPanel>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Email</dt>
            <dd className="mt-1 text-white">{doc.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Phone</dt>
            <dd className="mt-1 text-white">{doc.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Role / level</dt>
            <dd className="mt-1 text-white">
              {doc.role || "—"} · {doc.level || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Course</dt>
            <dd className="mt-1 text-white">{course?.title || "Not attached"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Member</dt>
            <dd className="mt-1 text-white">
              {member ? (
                <Link href={`/staff/members?member=${member.id}`} className="text-baby-blue hover:underline">
                  {member.name || member.email || member.id}
                </Link>
              ) : (
                "Will be created on admit"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">Status</dt>
            <dd className="mt-1 text-white">{doc.status || "received"}</dd>
          </div>
        </dl>
        {doc.goals ? (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-white/40">Goals</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/65">{doc.goals}</p>
          </div>
        ) : null}
      </StaffPanel>

      <StaffPanel>
        <h2 className="font-display text-xl text-white">Admit</h2>
        <p className="mt-2 mb-4 text-sm text-white/55">
          Granting access creates the enrollment immediately. A payment link uses the same Paystack fulfillment as
          buy-now once the fee is confirmed.
        </p>
        <AdmitActions
          applicationId={doc.id}
          courseId={courseId || undefined}
          courses={courses.docs.map((item) => ({ id: item.id, title: String(item.title) }))}
        />
      </StaffPanel>

      <StaffPanel>
        <h2 className="mb-4 font-display text-xl text-white">Record</h2>
        <StaffRecordForm
          collection="cohort-applications"
          action="update"
          id={doc.id}
          submitLabel="Save application"
          fields={[
            {
              name: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { label: "Received", value: "received" },
                { label: "Reviewing", value: "reviewing" },
                { label: "Accepted", value: "accepted" },
                { label: "Waitlisted", value: "waitlisted" },
                { label: "Declined", value: "declined" },
              ],
            },
            {
              name: "course",
              label: "Course",
              type: "select",
              options: [
                { label: "None", value: "" },
                ...courses.docs.map((item) => ({ label: String(item.title), value: String(item.id) })),
              ],
            },
            { name: "staffNotes", label: "Staff notes", type: "textarea" },
          ]}
          initial={{
            status: doc.status || "received",
            course: courseId,
            staffNotes: doc.staffNotes || "",
          }}
        />
      </StaffPanel>
    </div>
  );
}
