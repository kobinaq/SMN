import { redirect } from "next/navigation";
import { isPageEditorAdminPath, isPageEditorEnabled } from "@/lib/page-editor";

type Args = {
  params: Promise<{ segments?: string[] }>;
};

/**
 * Retire Payload admin chrome; staff product lives at /staff. Two exceptions:
 * STAFF_LEGACY_ADMIN=true, and the page editor routes outside production.
 */
export default async function LegacyAdminRedirect({ params }: Args) {
  const segments = (await params).segments || [];

  if (process.env.STAFF_LEGACY_ADMIN === "true" || (isPageEditorEnabled() && isPageEditorAdminPath(segments))) {
    const [{ RootPage }, configModule, importMapModule] = await Promise.all([
      import("@payloadcms/next/views"),
      import("@payload-config"),
      import("../importMap.js"),
    ]);
    return RootPage({
      config: configModule.default,
      params: Promise.resolve({ segments }),
      searchParams: Promise.resolve({}),
      importMap: importMapModule.importMap,
    });
  }

  if (segments[0] === "login") redirect("/staff/login");
  redirect("/staff");
}
