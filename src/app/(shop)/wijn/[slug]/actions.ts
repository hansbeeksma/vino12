"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface ReviewState {
  success: boolean;
  error?: string;
}

export async function submitReview(
  prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Je moet ingelogd zijn om een review te plaatsen.",
    };
  }

  const wineId = formData.get("wine_id") as string;
  const slug = formData.get("slug") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const title = (formData.get("title") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || null;

  if (!wineId || !rating || rating < 1 || rating > 5) {
    return {
      success: false,
      error: "Vul een geldige beoordeling in (1-5 sterren).",
    };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    return { success: false, error: "Vul eerst je profiel in." };
  }

  // Check if user has purchased this wine (verified purchase)
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, order:orders!inner(email)")
    .eq("wine_id", wineId)
    .eq("order.email", user.email!)
    .limit(1);

  const isVerifiedPurchase = (orderItems?.length ?? 0) > 0;

  const { error } = await supabase.from("wine_reviews").upsert(
    {
      wine_id: wineId,
      customer_id: customer.id,
      rating,
      title,
      body,
      is_verified_purchase: isVerifiedPurchase,
      is_approved: false,
    },
    { onConflict: "wine_id,customer_id" },
  );

  if (error) {
    return { success: false, error: "Er ging iets mis. Probeer het opnieuw." };
  }

  revalidatePath(`/wijn/${slug}`);

  return { success: true };
}
