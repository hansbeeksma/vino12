import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    if (!body) {
      return NextResponse.json(
        { error: "Missing request body" },
        { status: 400 },
      );
    }

    // Mollie sends payment ID as form-encoded body: id=tr_xxxxxxxxxx
    const params = new URLSearchParams(body);
    const paymentId = params.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing payment ID" },
        { status: 400 },
      );
    }

    // Fetch payment from Mollie
    const { mollieClient } = await import("@/lib/mollie");
    const payment = await mollieClient.payments.get(paymentId);
    const metadata = payment.metadata as {
      order_id: string;
      order_number: string;
    };

    if (!metadata?.order_id) {
      return NextResponse.json(
        { error: "Invalid payment metadata" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();

    // Map Mollie status to our payment status
    const statusMap: Record<string, string> = {
      paid: "paid",
      failed: "failed",
      expired: "expired",
      canceled: "cancelled",
    };

    const paymentStatus = statusMap[payment.status] ?? "pending";

    // Map to order status
    const orderStatusMap: Record<string, string> = {
      paid: "confirmed",
      failed: "cancelled",
      expired: "cancelled",
      canceled: "cancelled",
    };

    const orderStatus = orderStatusMap[payment.status] ?? "pending";

    // Update order
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
      })
      .eq("id", metadata.order_id)
      .select("*, order_items:order_items(*)")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 },
      );
    }

    // Log event
    await supabase.from("order_events").insert({
      order_id: metadata.order_id,
      event_type: `payment_${paymentStatus}`,
      data: {
        mollie_status: payment.status,
        payment_id: paymentId,
        method: payment.method,
      },
    });

    // Send confirmation email on successful payment
    if (paymentStatus === "paid" && order.email) {
      await resend.emails.send({
        from: "VINO12 <noreply@vino12.com>",
        to: order.email,
        subject: `Bevestiging bestelling ${metadata.order_number}`,
        html: buildConfirmationEmail(order, metadata.order_number),
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

function buildConfirmationEmail(
  order: {
    total_cents: number;
    order_items: { wine_name: string; quantity: number; total_cents: number }[];
  },
  orderNumber: string,
): string {
  const totalEur = (order.total_cents / 100).toFixed(2).replace(".", ",");

  const items = order.order_items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.wine_name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.total_cents / 100).toFixed(2).replace(".", ",")}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:40px 20px">
      <h1 style="font-size:32px;margin:0">VINO<span style="color:#722F37">12</span></h1>
      <p style="color:#666;margin-top:8px">Bedankt voor je bestelling!</p>
      <hr style="border:2px solid #000;margin:24px 0" />
      <p><strong>Bestelnummer:</strong> ${orderNumber}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr>
            <th style="padding:8px;border-bottom:2px solid #000;text-align:left">Wijn</th>
            <th style="padding:8px;border-bottom:2px solid #000;text-align:center">Aantal</th>
            <th style="padding:8px;border-bottom:2px solid #000;text-align:right">Bedrag</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
      <p style="text-align:right;font-size:18px;font-weight:bold">Totaal: €${totalEur}</p>
      <hr style="border:2px solid #000;margin:24px 0" />
      <p style="color:#666;font-size:12px">Je bestelling wordt binnen 3-5 werkdagen bezorgd. Bij levering vindt een 18+ verificatie plaats.</p>
    </div>
  `;
}
