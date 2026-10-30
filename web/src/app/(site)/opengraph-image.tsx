import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

/** Stacked TSA lockup, white, 558x320 (public/brand, T12). */
const LOGO = { width: 558, height: 320 };

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/tsa-logo-full-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #2b4c7f 0%, #1d355b 100%)",
          padding: "64px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={logoSrc}
          alt={site.name}
          width={LOGO.width * 0.4}
          height={LOGO.height * 0.4}
          style={{ display: "flex" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            {site.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.75)", maxWidth: 960 }}>
            {site.description}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.55)" }}>
          {site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
