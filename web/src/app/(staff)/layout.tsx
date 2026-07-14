import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata = {
  ...siteMetadata,
  title: {
    default: "SMN Staff",
    template: "%s · SMN Staff",
  },
};
export const viewport = siteViewport;

export default function StaffRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument>
      <AppProviders>{children}</AppProviders>
    </SiteDocument>
  );
}
