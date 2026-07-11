import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument>
      <SmoothScroll>
        <Header />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </SiteDocument>
  );
}
