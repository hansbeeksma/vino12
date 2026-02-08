import type { SupabaseClient } from "@supabase/supabase-js";

interface BadgeCheckResult {
  badge_slug: string;
  earned: boolean;
  progress: number;
  target: number;
}

export async function checkBadgeEligibility(
  supabase: SupabaseClient,
  customerId: string,
): Promise<BadgeCheckResult[]> {
  const results: BadgeCheckResult[] = [];

  // Get all active badges
  const { data: badges } = await supabase
    .from("badge_definitions")
    .select("*")
    .eq("is_active", true);

  if (!badges) return results;

  // Get already earned badges
  const { data: earned } = await supabase
    .from("customer_badges")
    .select("badge_id")
    .eq("customer_id", customerId);

  const earnedIds = new Set((earned ?? []).map((e) => e.badge_id));

  for (const badge of badges) {
    if (earnedIds.has(badge.id)) continue;

    const progress = await getProgress(
      supabase,
      customerId,
      badge.requirement_type,
    );

    results.push({
      badge_slug: badge.slug,
      earned: progress >= badge.requirement_value,
      progress,
      target: badge.requirement_value,
    });
  }

  return results;
}

async function getProgress(
  supabase: SupabaseClient,
  customerId: string,
  requirementType: string,
): Promise<number> {
  switch (requirementType) {
    case "order_count": {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact" })
        .eq("customer_id", customerId)
        .eq("payment_status", "paid");
      return count ?? 0;
    }

    case "review_count": {
      const { count } = await supabase
        .from("wine_reviews")
        .select("id", { count: "exact" })
        .eq("customer_id", customerId)
        .eq("is_approved", true);
      return count ?? 0;
    }

    case "red_wine_count": {
      const { count } = await supabase
        .from("order_items")
        .select(
          "id, wines!inner(type), orders!inner(customer_id, payment_status)",
          {
            count: "exact",
          },
        )
        .eq("orders.customer_id", customerId)
        .eq("orders.payment_status", "paid")
        .eq("wines.type", "red");
      return count ?? 0;
    }

    case "white_wine_count": {
      const { count } = await supabase
        .from("order_items")
        .select(
          "id, wines!inner(type), orders!inner(customer_id, payment_status)",
          {
            count: "exact",
          },
        )
        .eq("orders.customer_id", customerId)
        .eq("orders.payment_status", "paid")
        .eq("wines.type", "white");
      return count ?? 0;
    }

    case "region_count": {
      const { data } = await supabase
        .from("order_items")
        .select(
          "wines!inner(region_id), orders!inner(customer_id, payment_status)",
        )
        .eq("orders.customer_id", customerId)
        .eq("orders.payment_status", "paid");
      const regions = new Set(
        (data ?? []).map(
          (d) => (d.wines as unknown as { region_id: string }).region_id,
        ),
      );
      return regions.size;
    }

    case "body_type_count": {
      const { data } = await supabase
        .from("order_items")
        .select("wines!inner(body), orders!inner(customer_id, payment_status)")
        .eq("orders.customer_id", customerId)
        .eq("orders.payment_status", "paid");
      const bodies = new Set(
        (data ?? [])
          .map((d) => (d.wines as unknown as { body: string | null }).body)
          .filter(Boolean),
      );
      return bodies.size;
    }

    default:
      return 0;
  }
}

export async function awardBadge(
  supabase: SupabaseClient,
  customerId: string,
  badgeSlug: string,
): Promise<boolean> {
  const { data: badge } = await supabase
    .from("badge_definitions")
    .select("id, points_reward, name")
    .eq("slug", badgeSlug)
    .single();

  if (!badge) return false;

  // Check if already earned
  const { data: existing } = await supabase
    .from("customer_badges")
    .select("id")
    .eq("customer_id", customerId)
    .eq("badge_id", badge.id)
    .maybeSingle();

  if (existing) return false;

  // Award badge
  const { error: badgeError } = await supabase
    .from("customer_badges")
    .insert({ customer_id: customerId, badge_id: badge.id });

  if (badgeError) return false;

  // Award bonus points
  if (badge.points_reward > 0) {
    await supabase.from("customer_points").insert({
      customer_id: customerId,
      points: badge.points_reward,
      reason: `Badge verdiend: ${badge.name}`,
      reference_type: "badge",
      reference_id: badge.id,
    });
  }

  return true;
}

export async function awardPoints(
  supabase: SupabaseClient,
  customerId: string,
  points: number,
  reason: string,
  referenceType?: string,
  referenceId?: string,
): Promise<void> {
  await supabase.from("customer_points").insert({
    customer_id: customerId,
    points,
    reason,
    reference_type: referenceType ?? null,
    reference_id: referenceId ?? null,
  });
}
