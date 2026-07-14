import { MediaCopyButton } from "@/components/staff/MediaCopyButton";
import { MediaUploadForm } from "@/components/staff/MediaUploadForm";
import { StaffDeleteButton } from "@/components/staff/StaffRecordForm";
import { StaffEmpty, StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function StaffMediaPage() {
  const staff = await requireStaff(["content", "learning", "analyst"], "/staff/content/media");
  const payload = await getPayloadClient();
  const media = await listCollection(payload, staff, "media", { limit: 100, sort: "-createdAt", depth: 0 });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Content"
        title="Media library"
        description="Upload images and PDFs, then reference them by ID on posts, resources, and website pages."
      />
      <StaffPanel>
        <MediaUploadForm />
      </StaffPanel>
      <StaffPanel>
        {media.docs.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.docs.map((doc) => {
              const url = typeof doc.url === "string" ? doc.url : "";
              const isImage = typeof doc.mimeType === "string" && doc.mimeType.startsWith("image/");
              return (
                <article key={doc.id} className="overflow-hidden rounded-2xl border border-white/10 bg-near-black/30">
                  <div className="flex aspect-video items-center justify-center bg-white/[.03]">
                    {isImage && url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={doc.alt || "Media"} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-white/40">{doc.mimeType || "File"}</span>
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <b className="block text-sm text-white">{doc.alt || "Untitled"}</b>
                      <small className="mt-1 block text-xs text-white/40">ID {doc.id}</small>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {url ? <MediaCopyButton url={url} /> : null}
                      <StaffDeleteButton collection="media" id={doc.id} redirectTo="/staff/content/media" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <StaffEmpty>No media uploaded yet. Add the first image or PDF above.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
