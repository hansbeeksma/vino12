import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const reviewSchema = z.object({
  wine_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const wineId = req.nextUrl.searchParams.get("wine_id");

  if (!wineId) {
    return NextResponse.json(
      { error: "Missing wine_id parameter" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: reviews, error } = await supabase
    .from("wine_reviews")
    .select(
      "id, rating, title, body, is_verified_purchase, created_at, customers(first_name)",
    )
    .eq("wine_id", wineId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }

  // Calculate average rating
  const ratings = (reviews ?? []).map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  return NextResponse.json({
    reviews: (reviews ?? []).map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      is_verified_purchase: review.is_verified_purchase,
      author:
        (review.customers as unknown as { first_name: string } | null)
          ?.first_name ?? "Anoniem",
      created_at: review.created_at,
    })),
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: ratings.length,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatie mislukt", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const serviceClient = createServiceRoleClient();

  // Check if user already reviewed this wine
  const { data: existing } = await serviceClient
    .from("wine_reviews")
    .select("id")
    .eq("wine_id", parsed.data.wine_id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Je hebt deze wijn al beoordeeld" },
      { status: 409 },
    );
  }

  // Check if user purchased this wine (verified purchase)
  const { data: purchaseCheck } = await serviceClient
    .from("order_items")
    .select("id, orders!inner(customer_id, payment_status)")
    .eq("wine_id", parsed.data.wine_id)
    .eq("orders.customer_id", user.id)
    .eq("orders.payment_status", "paid")
    .limit(1);

  const isVerifiedPurchase = (purchaseCheck ?? []).length > 0;

  const { data: review, error } = await serviceClient
    .from("wine_reviews")
    .insert({
      wine_id: parsed.data.wine_id,
      customer_id: user.id,
      rating: parsed.data.rating,
      title: parsed.data.title ?? null,
      body: parsed.data.body ?? null,
      is_verified_purchase: isVerifiedPurchase,
      is_approved: true,
    })
    .select("id, rating, title, body, is_verified_purchase, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Review niet aangemaakt: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ review }, { status: 201 });
}
