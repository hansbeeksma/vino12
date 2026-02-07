import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ReviewRow {
  id: string;
  wine_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  customer: { first_name: string; last_name: string } | null;
}

export async function getApprovedReviews(wineId: string): Promise<ReviewRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wine_reviews")
    .select("*, customer:customers(first_name, last_name)")
    .eq("wine_id", wineId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  return (data ?? []) as ReviewRow[];
}

export async function getReviewStats(
  wineId: string,
): Promise<{ average: number; count: number }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wine_reviews")
    .select("rating")
    .eq("wine_id", wineId)
    .eq("is_approved", true);

  if (error) {
    return { average: 0, count: 0 };
  }

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / data.length) * 10) / 10,
    count: data.length,
  };
}

export async function getUserReview(
  wineId: string,
  customerId: string,
): Promise<ReviewRow | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wine_reviews")
    .select("*, customer:customers(first_name, last_name)")
    .eq("wine_id", wineId)
    .eq("customer_id", customerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    return null;
  }

  return data as ReviewRow;
}
