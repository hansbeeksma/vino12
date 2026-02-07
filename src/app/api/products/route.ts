import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement product listing with Supabase
  return NextResponse.json({
    success: true,
    data: [],
    meta: { total: 0, page: 1, limit: 20 },
  });
}
