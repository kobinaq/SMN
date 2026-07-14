import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata(args: Args): Promise<Metadata> {
  if (process.env.STAFF_LEGACY_ADMIN === "true") {
    const [{ generatePageMetadata }, config] = await Promise.all([
      import("@payloadcms/next/views"),
      import("@payload-config"),
    ]);
    return generatePageMetadata({ config: config.default, params: args.params, searchParams: args.searchParams });
  }
  return { title: "Staff" };
}

export default async function LegacyAdminNotFound(args: Args) {
  if (process.env.STAFF_LEGACY_ADMIN === "true") {
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
