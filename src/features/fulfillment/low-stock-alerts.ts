import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { getLowStockItems } from "./supplier-service";

const LOW_STOCK_THRESHOLD = 5;
const OUT_OF_STOCK_THRESHOLD = 0;

export async function checkAndSendLowStockAlerts(): Promise<{
  lowStockCount: number;
  outOfStockCount: number;
  alertSent: boolean;
}> {
  const lowStockItems = await getLowStockItems(LOW_STOCK_THRESHOLD);

  if (lowStockItems.length === 0) {
    return { lowStockCount: 0, outOfStockCount: 0, alertSent: false };
  }

  const outOfStock = lowStockItems.filter(
    (item) => item.quantity_available <= OUT_OF_STOCK_THRESHOLD,
  );
  const lowStock = lowStockItems.filter(
    (item) => item.quantity_available > OUT_OF_STOCK_THRESHOLD,
  );

  const adminEmail =
    process.env.ADMIN_ALERT_EMAIL ??
    process.env.ADMIN_EMAILS?.split(",")[0]?.trim();

  if (!adminEmail) {
    return {
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      alertSent: false,
    };
  }

  const outOfStockRows = outOfStock
    .map(
      (item) =>
        `<tr style="background:#FEE2E2"><td style="padding:6px 12px;border-bottom:1px solid #eee">${item.wine_name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${item.supplier_name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:bold;color:#DC2626">0</td></tr>`,
    )
    .join("");

  const lowStockRows = lowStock
    .map(
      (item) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${item.wine_name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${item.supplier_name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:bold;color:#D97706">${item.quantity_available}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="margin:0">VINO<span style="color:#722F37">12</span> Voorraad Alert</h2>
      <p style="color:#666">${new Date().toLocaleDateString("nl-NL", { dateStyle: "full" })}</p>

      ${
        outOfStock.length > 0
          ? `
        <h3 style="color:#DC2626;margin-top:24px">Uitverkocht (${outOfStock.length})</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th style="padding:6px 12px;text-align:left;border-bottom:2px solid #000">Wijn</th><th style="padding:6px 12px;text-align:left;border-bottom:2px solid #000">Leverancier</th><th style="padding:6px 12px;text-align:center;border-bottom:2px solid #000">Voorraad</th></tr></thead>
          <tbody>${outOfStockRows}</tbody>
        </table>
      `
          : ""
      }

      ${
        lowStock.length > 0
          ? `
        <h3 style="color:#D97706;margin-top:24px">Lage voorraad (${lowStock.length})</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th style="padding:6px 12px;text-align:left;border-bottom:2px solid #000">Wijn</th><th style="padding:6px 12px;text-align:left;border-bottom:2px solid #000">Leverancier</th><th style="padding:6px 12px;text-align:center;border-bottom:2px solid #000">Voorraad</th></tr></thead>
          <tbody>${lowStockRows}</tbody>
        </table>
      `
          : ""
      }
    </div>
  `;

  await resend.emails.send({
    from: "VINO12 Systeem <noreply@vino12.com>",
    to: adminEmail,
    subject: `Voorraad alert: ${outOfStock.length} uitverkocht, ${lowStock.length} lage voorraad`,
    html,
  });

  // Log alert
  const supabase = createServiceRoleClient();
  await supabase.from("order_events").insert({
    order_id: null,
    event_type: "low_stock_alert",
    description: `Low stock alert sent: ${outOfStock.length} out of stock, ${lowStock.length} low stock`,
    metadata: {
      out_of_stock: outOfStock.map((i) => i.wine_name),
      low_stock: lowStock.map((i) => ({
        name: i.wine_name,
        quantity: i.quantity_available,
      })),
    },
  });

  return {
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    alertSent: true,
  };
}
