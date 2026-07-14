"use client";

import { createContext, useContext } from "react";
import { site as fallbackSite, type SiteConfig } from "@/lib/site";

const SiteSettingsContext = createContext<SiteConfig>(fallbackSite);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteConfig {
  return useContext(SiteSettingsContext);
}
