export const ADMIN_COOKIE_PREFIX = "smn-admin";
export const ADMIN_TOKEN_COOKIE = `${ADMIN_COOKIE_PREFIX}-token`;
export const MEMBER_TOKEN_COOKIE = "smn-member-token";

export function splitCookieHeader(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function cookieValue(parts: string[], name: string) {
  const prefix = `${name}=`;
  const part = parts.find((item) => item.startsWith(prefix));
  return part ? part.slice(prefix.length) : "";
}

export function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function incomingHeaders(source: Headers | HeadersInit): Headers {
  return source instanceof Headers ? new Headers(source) : new Headers(source);
}

/** Rewrite the member cookie onto the admin cookie name Payload Local API expects. */
export function memberSessionHeaders(source: Headers | HeadersInit): Headers {
  const headers = incomingHeaders(source);
  const parts = splitCookieHeader(headers.get("cookie") || "");
  const memberToken = cookieValue(parts, MEMBER_TOKEN_COOKIE);
  const filtered = parts.filter(
    (part) =>
      !part.startsWith(`${ADMIN_TOKEN_COOKIE}=`) && !part.startsWith(`${MEMBER_TOKEN_COOKIE}=`),
  );
  if (memberToken) filtered.push(`${ADMIN_TOKEN_COOKIE}=${memberToken}`);
  if (filtered.length) headers.set("cookie", filtered.join("; "));
  else headers.delete("cookie");
  return headers;
}

/** Drop the member cookie and promote the staff JWT so CSRF Origin checks cannot swallow the session. */
export function staffSessionHeaders(source: Headers | HeadersInit): Headers {
  const incoming = incomingHeaders(source);
  const parts = splitCookieHeader(incoming.get("cookie") || "").filter(
    (part) => !part.startsWith(`${MEMBER_TOKEN_COOKIE}=`),
  );
  const token = decodeCookieValue(cookieValue(parts, ADMIN_TOKEN_COOKIE));
  const headers = new Headers();
  if (parts.length) headers.set("cookie", parts.join("; "));
  if (token) headers.set("Authorization", `JWT ${token}`);
  return headers;
}
