import React from "react";

/** Full wordmark on the admin login / create-first-user screen */
export default function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/tsa-logo-full-white.png"
      alt="Think Social Academy"
      style={{
        width: "auto",
        height: "auto",
        maxWidth: "220px",
        maxHeight: "72px",
        objectFit: "contain",
      }}
    />
  );
}
