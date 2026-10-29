import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a2f8f 0%, #0b0d12 65%)",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#7eb6ff",
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            {site.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "rgba(255,255,255,0.7)", maxWidth: 900 }}>
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
