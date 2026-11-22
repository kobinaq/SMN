"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/** Refreshes the server-rendered preview when the editor saves or autosaves a draft. */
export function LivePreviewRefresh() {
  const router = useRouter();
  const serverURL = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "") || window.location.origin;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}
