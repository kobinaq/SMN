export type HeaderTone = "light" | "ink";

/**
 * Transparent header over the dark home hero needs the light logo and light
 * type from the first render. Scroll and the open mobile menu both put a
 * light bar behind the header, which uses the ink tokens.
 */
export function headerTone(pathname: string, scrolled: boolean, menuOpen: boolean): HeaderTone {
  return pathname === "/" && !scrolled && !menuOpen ? "light" : "ink";
}

export function logoTone(tone: HeaderTone): "white" | "blue" {
  return tone === "light" ? "white" : "blue";
}

/** Exact for `/` and `/connect` so nested routes do not mark the parent current. */
export function pathMatches(pathname: string, href: string) {
  if (href === "/" || href === "/connect") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
