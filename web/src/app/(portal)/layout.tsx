import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata = siteMetadata;
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
