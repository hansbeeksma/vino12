import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const trackingSchema = z.object({
  order_id: z.string().uuid(),
  tracking_number: z.string().min(1),
  tracking_url: z.string().url().optional(),
  carrier: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = trackingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { order_id, tracking_number, tracking_url } = parsed.data;
  const supabase = createServiceRoleClient();

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      tracking_number,
      tracking_url: tracking_url ?? null,
      status: "shipped",
      shipped_at: new Date().toISOString(),
    })
    .eq("id", order_id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update order", details: updateError.message },
      { status: 500 },
    );
  }

  await supabase.from("order_events").insert({
    order_id,
    event_type: "shipped",
    description: `Tracking: ${tracking_number}`,
    metadata: { tracking_number, tracking_url, carrier: parsed.data.carrier },
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("order");

  if (!orderNumber) {
    return NextResponse.json(
      { error: "Missing order parameter" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "order_number, status, tracking_number, tracking_url, shipped_at, delivered_at",
    )
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    order_number: order.order_number,
    status: order.status,
    tracking_number: order.tracking_number,
    tracking_url: order.tracking_url,
    shipped_at: order.shipped_at,
    delivered_at: order.delivered_at,
  });
}
