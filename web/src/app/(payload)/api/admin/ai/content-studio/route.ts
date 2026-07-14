import { NextResponse } from "next/server";

/** Legacy path — Content Studio now lives under /api/staff/ai/content-studio. */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint moved. Use /api/staff/ai/content-studio." },
    { status: 410 },
  );
}
