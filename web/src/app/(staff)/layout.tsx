import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { AppProviders } from "@/components/providers/AppProviders";
import { pageTitle } from "@/lib/brand";

export const metadata = {
  ...siteMetadata,
  title: pageTitle("Staff", { staff: true }),
  robots: { index: false, follow: false },
};
export const viewport = siteViewport;

export default function StaffRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument>
      <AppProviders>{children}</AppProviders>
    </SiteDocument>
  );
}
