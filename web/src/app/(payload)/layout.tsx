/* Payload admin shell — no marketing chrome */
import type { ReactNode } from "react";
import "@payloadcms/next/css";

type Args = {
  children: ReactNode;
};

const Layout = ({ children }: Args) => {
  return children;
};

export default Layout;
