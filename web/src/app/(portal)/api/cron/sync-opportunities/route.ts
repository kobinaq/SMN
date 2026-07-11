import { getPayloadClient } from "@/lib/payload";
import { syncAllOpportunitySources } from "@/lib/opportunity-sync";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await getPayloadClient();
  const results = await syncAllOpportunitySources(payload);
  return Response.json({ ok: true, results });
}