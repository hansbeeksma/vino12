import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceRoleClient();

  // Fetch all user data
  const [customerResult, ordersResult, verificationsResult] = await Promise.all(
    [
      serviceClient
        .from("customers")
        .select("*, addresses(*)")
        .eq("auth_user_id", user.id)
        .maybeSingle(),
      serviceClient
        .from("orders")
        .select("*, order_items(*)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false }),
      serviceClient
        .from("age_verifications")
        .select("method, verified, created_at")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false }),
    ],
  );

  const exportData = {
    export_date: new Date().toISOString(),
    account: {
      email: user.email,
      created_at: user.created_at,
    },
    customer: customerResult.data
      ? {
          first_name: customerResult.data.first_name,
          last_name: customerResult.data.last_name,
          email: customerResult.data.email,
          phone: customerResult.data.phone,
          addresses: customerResult.data.addresses,
        }
      : null,
    orders: ordersResult.data ?? [],
    age_verifications: verificationsResult.data ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="vino12-data-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
