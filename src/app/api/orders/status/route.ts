import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("order");

  if (!orderNumber) {
    return NextResponse.json(
      { error: "Missing order number" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("order_number, status, payment_status")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { error: "Bestelling niet gevonden" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
  });
}
