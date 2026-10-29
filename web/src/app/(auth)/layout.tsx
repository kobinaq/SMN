import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";

export const metadata = {
  ...siteMetadata,
  robots: { index: false, follow: false },
};
export const viewport = siteViewport;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>;
}
