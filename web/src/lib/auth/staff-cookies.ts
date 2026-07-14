import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/member";

const isProduction = process.env.NODE_ENV === "production";

export async function setStaffTokenCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const store = await cookies();
  store.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    maxAge: maxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
}

export async function clearStaffTokenCookie() {
  const store = await cookies();
  store.set(ADMIN_TOKEN_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
}
