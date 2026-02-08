import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSocialProof, trackActivity } from "@/lib/gamification/social-proof";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const wineId = request.nextUrl.searchParams.get("wine_id");

  if (!wineId) {
    return NextResponse.json(
      { success: false, error: "wine_id parameter is required" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();
  const data = await getSocialProof(supabase, wineId);

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { wine_id, activity_type, session_id } = body;

  if (!wine_id || !activity_type) {
    return NextResponse.json(
      { success: false, error: "wine_id and activity_type are required" },
      { status: 400 },
    );
  }

  const validTypes = ["view", "purchase", "add_to_cart"] as const;
  if (!validTypes.includes(activity_type)) {
    return NextResponse.json(
      { success: false, error: "Invalid activity_type" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();
  await trackActivity(supabase, wine_id, activity_type, session_id);

  return NextResponse.json({ success: true }, { status: 201 });
}
