import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = createServiceRoleClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "order_number, email, status, total_cents, shipping_name, shipping_city, shipping_postal_code, created_at",
    )
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return new NextResponse("Geen bestellingen gevonden", { status: 404 });
  }

  const headers = [
    "Bestelnummer",
    "Email",
    "Status",
    "Totaal (EUR)",
    "Naam",
    "Stad",
    "Postcode",
    "Datum",
  ];

  const rows = orders.map((o) => [
    escapeCSV(o.order_number),
    escapeCSV(o.email),
    escapeCSV(o.status),
    escapeCSV((o.total_cents / 100).toFixed(2)),
    escapeCSV(o.shipping_name),
    escapeCSV(o.shipping_city),
    escapeCSV(o.shipping_postal_code),
    escapeCSV(new Date(o.created_at).toLocaleDateString("nl-NL")),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vino12-orders-${date}.csv"`,
    },
  });
}
