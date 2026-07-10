import { getPayload } from "payload";
import config from "@payload-config";

export async function getPayloadClient() {
  return getPayload({ config });
}

/** Fetch CMS data with graceful fallback when DB isn't ready. */
export async function safePayloadQuery<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.warn("[payload] query failed, using fallback content", error);
    return fallback;
  }
}
