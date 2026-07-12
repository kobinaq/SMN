import { cookies } from "next/headers";
import { MEMBER_TOKEN_COOKIE } from "@/lib/auth/member";

const isProduction = process.env.NODE_ENV === "production";

export async function setMemberTokenCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 14) {
  const store = await cookies();
  store.set(MEMBER_TOKEN_COOKIE, token, {
    httpOnly: true,
    maxAge: maxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
}

export async function clearMemberTokenCookie() {
  const store = await cookies();
  store.set(MEMBER_TOKEN_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
}
