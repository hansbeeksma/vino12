"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function approveReview(reviewId: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("wine_reviews")
    .update({ is_approved: true })
    .eq("id", reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function rejectReview(reviewId: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("wine_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}
