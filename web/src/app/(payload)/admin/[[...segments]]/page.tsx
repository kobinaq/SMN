import { redirect } from "next/navigation";

type Args = {
  params: Promise<{ segments?: string[] }>;
};

/** Retire Payload admin chrome; staff product lives at /staff. */
export default async function LegacyAdminRedirect({ params }: Args) {
  if (process.env.STAFF_LEGACY_ADMIN === "true") {
    const [{ RootPage }, configModule, importMapModule] = await Promise.all([
      import("@payloadcms/next/views"),
      import("@payload-config"),
      import("../importMap.js"),
    ]);
    return RootPage({
      config: configModule.default,
      params: params as Promise<{ segments: string[] }>,
      searchParams: Promise.resolve({}),
      importMap: importMapModule.importMap,
    });
  }

  const segments = (await params).segments || [];
  if (segments[0] === "login") redirect("/staff/login");
  redirect("/staff");
}
