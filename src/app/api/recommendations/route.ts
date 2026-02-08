import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getGorseClient, type GorseScore } from "@/lib/gorse";

export const dynamic = "force-dynamic";

/**
 * GET /api/recommendations?userId=xxx&n=12
 *
 * Returns personalized wine recommendations. Falls back to popular items
 * when the user has no interaction history in Gorse.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const n = Math.min(50, Math.max(1, Number(searchParams.get("n") ?? 12)));

  const gorse = getGorseClient();
  const supabase = createServiceRoleClient();

  let scores: GorseScore[] = [];
  let source: "personalized" | "popular" = "personalized";

  try {
    if (userId) {
      scores = await gorse.getRecommendations(userId, n);
    }

    // Fallback to popular items when no personalized recommendations
    if (scores.length === 0) {
      scores = await gorse.getPopular(n);
      source = "popular";
    }
  } catch {
    // Gorse unavailable — fall back to popular items from Supabase
    const { data: fallback } = await supabase
      .from("wines")
      .select("id")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(n);

    if (fallback) {
      scores = fallback.map((w) => ({ Id: String(w.id), Score: 0 }));
    }
    source = "popular";
  }

  if (scores.length === 0) {
    return NextResponse.json({
      success: true,
      data: [],
      meta: { source, total: 0 },
    });
  }

  // Fetch full wine data from Supabase
  const wineIds = scores.map((s) => s.Id);
  const { data: wines, error } = await supabase
    .from("wines")
    .select("*, region:regions(id, name, country)")
    .in("id", wineIds)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  // Build a score lookup map
  const scoreMap = new Map(scores.map((s) => [s.Id, s.Score]));

  // Enrich wines with Gorse scores and sort by score descending
  const enriched = (wines ?? [])
    .map((wine) => ({
      ...wine,
      recommendationScore: scoreMap.get(String(wine.id)) ?? 0,
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  return NextResponse.json({
    success: true,
    data: enriched,
    meta: {
      source,
      total: enriched.length,
    },
  });
}
