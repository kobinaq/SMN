import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return failJson("Sign in to upload a file.", 401);

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return failJson("Choose a PDF to upload.", 400);
    if (file.type && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      return failJson("Upload a PDF or image.", 400);
    }

    const created = await payload.create({
      collection: "media",
      data: { alt: file.name || "Assignment upload" },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type || "application/pdf",
        name: file.name,
        size: file.size,
      },
      overrideAccess: false,
      user,
    });

    return okJson({ ok: true, id: created.id, url: created.url }, 201);
  } catch (error) {
    logServerError("lms-upload", error);
    return failJson("Unable to upload that file.", 500);
  }
}
