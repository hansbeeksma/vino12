import type { SupabaseClient } from "@supabase/supabase-js";
import type { SocialProofData } from "./types";

export async function getSocialProof(
  supabase: SupabaseClient,
  wineId: string,
): Promise<SocialProofData> {
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000,
  ).toISOString();

  // Recent viewers (last 24h)
  const { count: recentViewers } = await supabase
    .from("wine_activity")
    .select("id", { count: "exact" })
    .eq("wine_id", wineId)
    .eq("activity_type", "view")
    .gte("created_at", twentyFourHoursAgo);

  // Recent purchases (last 24h)
  const { count: recentPurchases } = await supabase
    .from("wine_activity")
    .select("id", { count: "exact" })
    .eq("wine_id", wineId)
    .eq("activity_type", "purchase")
    .gte("created_at", twentyFourHoursAgo);

  // Average rating
  const { data: reviews } = await supabase
    .from("wine_reviews")
    .select("rating")
    .eq("wine_id", wineId)
    .eq("is_approved", true);

  const ratings = (reviews ?? []).map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  return {
    recent_viewers: recentViewers ?? 0,
    recent_purchases: recentPurchases ?? 0,
    average_rating: Math.round(averageRating * 10) / 10,
    total_reviews: ratings.length,
  };
}

export async function trackActivity(
  supabase: SupabaseClient,
  wineId: string,
  activityType: "view" | "purchase" | "add_to_cart",
  sessionId?: string,
): Promise<void> {
  await supabase.from("wine_activity").insert({
    wine_id: wineId,
    activity_type: activityType,
    session_id: sessionId ?? null,
  });
}
