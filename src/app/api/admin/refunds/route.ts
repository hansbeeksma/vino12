import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const refundRequestSchema = z.object({
  order_id: z.string().uuid(),
  amount_cents: z.number().int().positive().optional(),
  reason: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = refundRequestSchema.parse(body);

    const supabase = createServiceRoleClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, order_number, mollie_payment_id, total_cents, payment_status",
      )
      .eq("id", data.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Bestelling niet gevonden" },
        { status: 404 },
      );
    }

    if (!order.mollie_payment_id) {
      return NextResponse.json(
        { error: "Geen betaling gevonden voor deze bestelling" },
        { status: 400 },
      );
    }

    if (order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Alleen betaalde bestellingen kunnen worden terugbetaald" },
        { status: 400 },
      );
    }

    const { mollieClient } = await import("@/lib/mollie");
    const refundAmountCents = data.amount_cents ?? order.total_cents;
    const refundAmountEur = (refundAmountCents / 100).toFixed(2);

    const refund = await mollieClient.paymentRefunds.create({
      paymentId: order.mollie_payment_id,
      amount: { currency: "EUR", value: refundAmountEur },
      description: `Terugbetaling ${order.order_number}: ${data.reason}`,
    });

    const isPartial = refundAmountCents < order.total_cents;

    await supabase
      .from("orders")
      .update({
        payment_status: isPartial ? "partially_refunded" : "refunded",
        status: isPartial ? "processing" : "refunded",
      })
      .eq("id", order.id);

    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: isPartial ? "partial_refund" : "refund",
      data: {
        refund_id: refund.id,
        amount_cents: refundAmountCents,
        reason: data.reason,
      },
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amountCents: refundAmountCents,
      isPartial,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ongeldige gegevens", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Er ging iets mis bij de terugbetaling" },
      { status: 500 },
    );
  }
}
