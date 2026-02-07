import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  getInventoryStats,
  getLowStockItems,
} from "@/features/fulfillment/supplier-service";
import { syncAllSupplierInventory } from "@/features/fulfillment/inventory-sync";
import { checkAndSendLowStockAlerts } from "@/features/fulfillment/low-stock-alerts";

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

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get("action");

  if (action === "stats") {
    const stats = await getInventoryStats();
    return NextResponse.json(stats);
  }

  if (action === "low-stock") {
    const threshold = Number(req.nextUrl.searchParams.get("threshold")) || 5;
    const items = await getLowStockItems(threshold);
    return NextResponse.json({ items });
  }

  // Default: return full inventory with wine and supplier details
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("*, wines(name, slug), suppliers(name, code)")
    .order("quantity_available", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 },
    );
  }

  return NextResponse.json({ inventory: data ?? [] });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "sync") {
    const results = await syncAllSupplierInventory();
    return NextResponse.json({ results });
  }

  if (action === "check-alerts") {
    const result = await checkAndSendLowStockAlerts();
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: "Unknown action. Use 'sync' or 'check-alerts'" },
    { status: 400 },
  );
}
