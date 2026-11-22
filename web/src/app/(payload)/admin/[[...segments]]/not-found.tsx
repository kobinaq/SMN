import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isPageEditorEnabled } from "@/lib/page-editor";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Next gives not-found no route params, so the path cannot be checked here.
 * It does not need to be: page.tsx redirects every non-allowlisted path, so a
 * not-found only happens inside the legacy admin or the page editor routes.
 */
async function showsPayloadAdmin() {
  return process.env.STAFF_LEGACY_ADMIN === "true" || isPageEditorEnabled();
}

export async function generateMetadata(args: Args): Promise<Metadata> {
  if (await showsPayloadAdmin()) {
    const [{ generatePageMetadata }, config] = await Promise.all([
      import("@payloadcms/next/views"),
      import("@payload-config"),
    ]);
    return generatePageMetadata({ config: config.default, params: args.params, searchParams: args.searchParams });
  }
  return { title: "Staff" };
}

export default async function LegacyAdminNotFound(args: Args) {
  if (await showsPayloadAdmin()) {
    const [{ NotFoundPage }, config, importMapModule] = await Promise.all([
      import("@payloadcms/next/views"),
      import("@payload-config"),
      import("../importMap.js"),
    ]);
    return NotFoundPage({
      config: config.default,
      params: args.params,
      searchParams: args.searchParams,
      importMap: importMapModule.importMap,
    });
  }
  redirect("/staff");
}
