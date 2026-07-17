import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteSettingsProvider } from "@/components/layout/SiteSettingsProvider";
import {
  SiteDocument,
  siteMetadata,
  siteViewport,
} from "@/components/layout/SiteDocument";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/cms";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <SiteDocument>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: settings.name,
          url: settings.url,
          description: settings.description,
          email: settings.email,
          sameAs: [
            settings.social.instagram,
            settings.social.linkedin,
            settings.social.twitter,
          ].filter(Boolean),
        }}
      />
      <SiteSettingsProvider value={settings}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <PageTransition>
            <main id="main" className="flex-1">
              {children}
            </main>
          </PageTransition>
          <Footer site={settings} />
        </SmoothScroll>
      </SiteSettingsProvider>
    </SiteDocument>
  );
}
