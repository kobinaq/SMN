import React from "react";

/** Compact mark in the admin nav / browser tab area */
export default function Icon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        background: "#0A2F8F",
        color: "#FFFFFF",
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}
      aria-label="SMN"
    >
      SMN
    </span>
  );
}
