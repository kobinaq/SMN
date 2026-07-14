import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";

export const metadata = {
  ...siteMetadata,
  title: {
    default: "SMN Staff",
    template: "%s · SMN Staff",
  },
};
export const viewport = siteViewport;

export default function StaffRootLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>;
}
