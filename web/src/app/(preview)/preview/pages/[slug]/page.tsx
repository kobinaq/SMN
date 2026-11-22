import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsFooter, CmsHeader, type FooterData, type HeaderData } from "@/components/page-blocks/CmsChrome";
import { LivePreviewRefresh } from "@/components/page-blocks/LivePreviewRefresh";
import { RenderBlocks } from "@/components/page-blocks/RenderBlocks";
import type { PageBlock } from "@/components/page-blocks/types";
import { getStaff } from "@/lib/auth/staff";
import { isPageEditorEnabled } from "@/lib/page-editor";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Page preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  // Gate first: production and non-content visitors get a plain 404, with no data read.
  if (!isPageEditorEnabled()) notFound();
  const staff = await getStaff();
  if (!staff || !canStaff(staff, "content")) notFound();

  const { slug } = await params;
  const payload = await getPayloadClient();

  const [pages, header, footer] = await Promise.all([
    payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      draft: true,
      depth: 2,
      limit: 1,
      overrideAccess: true,
    }),
    payload.findGlobal({ slug: "header", draft: true, depth: 1, overrideAccess: true }).catch(() => null),
    payload.findGlobal({ slug: "footer", draft: true, depth: 1, overrideAccess: true }).catch(() => null),
  ]);

  const page = pages.docs[0] as { layout?: PageBlock[] | null } | undefined;
  if (!page && slug !== "home") notFound();
  const headerData = header as unknown as HeaderData;

  return (
    <>
      <LivePreviewRefresh />
      <CmsHeader header={headerData} />
      <main id="main" className="min-h-[40vh]">
        {page ? (
          <RenderBlocks blocks={page.layout} />
        ) : (
          <p className="container-wide py-16 text-sm text-text-3">
            There is no home page yet. Create a page with the slug “home” to see it here.
          </p>
        )}
      </main>
      <CmsFooter footer={footer as unknown as FooterData} sections={headerData?.sections} />
    </>
  );
}
