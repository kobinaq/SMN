import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { AppProviders } from "@/components/providers/AppProviders";
import { pageTitle } from "@/lib/brand";

export const metadata = {
  ...siteMetadata,
  title: pageTitle("Member", { area: "portal" }),
  robots: { index: false, follow: false },
};
export const viewport = siteViewport;

/** Document shell for /app/* — chrome is in app/layout.tsx */
export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteDocument>
      <AppProviders>{children}</AppProviders>
    </SiteDocument>
  );
}
