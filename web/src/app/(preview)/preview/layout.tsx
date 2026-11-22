import type { Metadata } from "next";
import { SiteDocument, siteViewport } from "@/components/layout/SiteDocument";

export const viewport = siteViewport;
export const metadata: Metadata = {
  title: "Page preview",
  robots: { index: false, follow: false },
};

/**
 * Own root layout: the (site) layout injects the code header and footer, and the
 * preview must show the CMS ones. Same document shell and global styles.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>;
}
