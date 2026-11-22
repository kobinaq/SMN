import { NextResponse } from "next/server";
import { getProgramsCatalogue } from "@/lib/programs/catalogue";

export async function GET() {
  try {
    const catalogue = await getProgramsCatalogue();
    return NextResponse.json(
      { ok: true, ...catalogue },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    console.error("[programs] catalogue request failed");
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
