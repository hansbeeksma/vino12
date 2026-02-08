import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isFeatureEnabled("leaderboard.enabled")) {
    return NextResponse.json(
      { error: "Leaderboard is niet beschikbaar" },
      { status: 404 },
    );
  }
  const supabase = createServiceRoleClient();

  const { data: leaderboard, error } = await supabase
    .from("leaderboard")
    .select("*")
    .limit(25);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  // Anonymize names (show first name + first letter of last name)
  const entries = (leaderboard ?? []).map((entry, index) => ({
    rank: index + 1,
    name: entry.first_name ?? "Anoniem",
    total_points: entry.total_points,
    badge_count: entry.badge_count,
    review_count: entry.review_count,
  }));

  return NextResponse.json({ success: true, data: entries });
}
