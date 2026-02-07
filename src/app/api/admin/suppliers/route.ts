import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const isAdmin =
    user.app_metadata?.role === "admin" ||
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .includes(user.email?.toLowerCase() ?? "");

  return isAdmin ? user : null;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: suppliers, error } = await supabase
    .from("suppliers")
    .select("*, inventory(count)")
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 },
    );
  }

  return NextResponse.json({ suppliers: suppliers ?? [] });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.code) {
    return NextResponse.json(
      { error: "Name and code are required" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: supplier, error } = await supabase
    .from("suppliers")
    .insert({
      name: body.name,
      code: body.code,
      api_endpoint: body.api_endpoint ?? null,
      contact_email: body.contact_email ?? null,
      is_active: body.is_active ?? true,
      lead_time_days: body.lead_time_days ?? 3,
      minimum_order_cents: body.minimum_order_cents ?? 0,
      shipping_cost_cents: body.shipping_cost_cents ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to create supplier: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ supplier }, { status: 201 });
}
