import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";

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

  const { data: customer } = await serviceClient
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
  }

  // Get total points
  const { data: totalData } = await serviceClient
    .from("customer_total_points")
    .select("total_points, transaction_count")
    .eq("customer_id", customer.id)
    .single();

  // Get recent transactions
  const { data: recent } = await serviceClient
    .from("customer_points")
    .select("points, reason, created_at")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    success: true,
    data: {
      total_points: totalData?.total_points ?? 0,
      transaction_count: totalData?.transaction_count ?? 0,
      recent: recent ?? [],
    },
  });
}
