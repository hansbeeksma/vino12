import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { checkBadgeEligibility, awardBadge } from "@/lib/gamification/badges";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceRoleClient();

  // Get customer
  const { data: customer } = await serviceClient
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
  }

  // Get all badges with earned status
  const { data: allBadges } = await serviceClient
    .from("badge_definitions")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const { data: earnedBadges } = await serviceClient
    .from("customer_badges")
    .select("badge_id, earned_at")
    .eq("customer_id", customer.id);

  const earnedMap = new Map(
    (earnedBadges ?? []).map((b) => [b.badge_id, b.earned_at]),
  );

  // Check eligibility for unearned badges
  const eligibility = await checkBadgeEligibility(serviceClient, customer.id);
  const eligibilityMap = new Map(eligibility.map((e) => [e.badge_slug, e]));

  const badges = (allBadges ?? []).map((badge) => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earned_at: earnedMap.get(badge.id) ?? null,
    progress:
      eligibilityMap.get(badge.slug)?.progress ?? badge.requirement_value,
    target: badge.requirement_value,
  }));

  return NextResponse.json({ success: true, data: badges });
}

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceRoleClient();

  const { data: customer } = await serviceClient
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
  }

  // Check and award eligible badges
  const eligible = await checkBadgeEligibility(serviceClient, customer.id);
  const awarded: string[] = [];

  for (const badge of eligible) {
    if (badge.earned) {
      const success = await awardBadge(
        serviceClient,
        customer.id,
        badge.badge_slug,
      );
      if (success) awarded.push(badge.badge_slug);
    }
  }

  return NextResponse.json({
    success: true,
    data: { awarded, checked: eligible.length },
  });
}
