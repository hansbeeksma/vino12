import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { shippingNotificationEmail } from "@/lib/email/templates";
import { z } from "zod";

const webhookSchema = z.object({
  event: z.enum([
    "order.accepted",
    "order.shipped",
    "order.delivered",
    "order.failed",
  ]),
  external_order_id: z.string().uuid(),
  supplier_order_id: z.string().optional(),
  tracking_number: z.string().optional(),
  tracking_url: z.string().url().optional(),
  carrier: z.string().optional(),
  failure_reason: z.string().optional(),
  timestamp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Verify API key
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = webhookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { event, external_order_id: orderId } = parsed.data;
  const supabase = createServiceRoleClient();

  // Log the webhook event
  await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: `supplier_${event}`,
    description: `Supplier webhook: ${event}`,
    metadata: parsed.data,
  });

  switch (event) {
    case "order.accepted": {
      await supabase
        .from("orders")
        .update({ status: "processing" })
        .eq("id", orderId);
      break;
    }

    case "order.shipped": {
      const updateData: Record<string, unknown> = {
        status: "shipped",
        shipped_at: new Date().toISOString(),
      };

      if (parsed.data.tracking_number) {
        updateData.tracking_number = parsed.data.tracking_number;
      }
      if (parsed.data.tracking_url) {
        updateData.tracking_url = parsed.data.tracking_url;
      }

      await supabase.from("orders").update(updateData).eq("id", orderId);

      // Send shipping notification email
      const { data: order } = await supabase
        .from("orders")
        .select("order_number, email")
        .eq("id", orderId)
        .single();

      if (order?.email) {
        await resend.emails
          .send({
            from: "VINO12 <noreply@vino12.com>",
            to: order.email,
            subject: `Je bestelling ${order.order_number} is verzonden!`,
            html: shippingNotificationEmail({
              orderNumber: order.order_number,
              trackingUrl: parsed.data.tracking_url ?? null,
              carrier: parsed.data.carrier ?? "Bezorgdienst",
            }),
          })
          .catch(() => {});
      }
      break;
    }

    case "order.delivered": {
      await supabase
        .from("orders")
        .update({
          status: "delivered",
          delivered_at: new Date().toISOString(),
        })
        .eq("id", orderId);
      break;
    }

    case "order.failed": {
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

      // Notify admin
      const adminEmail =
        process.env.ADMIN_ALERT_EMAIL ??
        process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
      if (adminEmail) {
        const { data: failedOrder } = await supabase
          .from("orders")
          .select("order_number")
          .eq("id", orderId)
          .single();

        await resend.emails
          .send({
            from: "VINO12 Systeem <noreply@vino12.com>",
            to: adminEmail,
            subject: `Fulfillment mislukt: ${failedOrder?.order_number ?? orderId}`,
            html: `<div style="font-family:monospace;padding:20px"><h2>VINO<span style="color:#722F37">12</span> Fulfillment Error</h2><p>Bestelling <strong>${failedOrder?.order_number ?? orderId}</strong> kon niet worden verwerkt door de leverancier.</p><p><strong>Reden:</strong> ${parsed.data.failure_reason ?? "Onbekend"}</p><p>Controleer het admin dashboard voor meer details.</p></div>`,
          })
          .catch(() => {});
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
