import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createServiceRoleClient();

  // Fetch stats
  const [ordersRes, customersRes, winesRes, recentOrdersRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select("total_cents, status")
        .in("status", ["confirmed", "processing", "shipped", "delivered"]),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("wines").select("id, stock_quantity").eq("is_active", true),
      supabase
        .from("orders")
        .select("id, order_number, email, total_cents, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const totalRevenue = (ordersRes.data ?? []).reduce(
    (sum, o) => sum + o.total_cents,
    0,
  );
  const orderCount = ordersRes.data?.length ?? 0;
  const customerCount = customersRes.count ?? 0;
  const lowStock = (winesRes.data ?? []).filter(
    (w) => w.stock_quantity < 10,
  ).length;
  const recentOrders = recentOrdersRes.data ?? [];

  const stats = [
    { label: "Totale omzet", value: formatPrice(totalRevenue) },
    { label: "Bestellingen", value: orderCount.toString() },
    { label: "Klanten", value: customerCount.toString() },
    { label: "Lage voorraad", value: lowStock.toString() },
  ];

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">DASHBOARD</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="border-2 border-ink bg-offwhite p-4">
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
              {stat.label}
            </p>
            <p className="font-display text-2xl font-bold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border-2 border-ink bg-offwhite p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Recente bestellingen
        </h2>

        {recentOrders.length === 0 ? (
          <p className="font-body text-base text-ink/50">
            Nog geen bestellingen.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="font-accent text-[10px] uppercase tracking-widest text-left pb-2">
                  Bestelnr
                </th>
                <th className="font-accent text-[10px] uppercase tracking-widest text-left pb-2">
                  E-mail
                </th>
                <th className="font-accent text-[10px] uppercase tracking-widest text-left pb-2">
                  Status
                </th>
                <th className="font-accent text-[10px] uppercase tracking-widest text-right pb-2">
                  Bedrag
                </th>
                <th className="font-accent text-[10px] uppercase tracking-widest text-right pb-2">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-ink/10">
                  <td className="font-display text-sm font-bold py-2">
                    {order.order_number}
                  </td>
                  <td className="font-body text-sm py-2">{order.email}</td>
                  <td className="font-accent text-[10px] uppercase tracking-widest py-2">
                    {order.status}
                  </td>
                  <td className="font-body text-sm font-bold text-right py-2">
                    {formatPrice(order.total_cents)}
                  </td>
                  <td className="font-body text-sm text-ink/50 text-right py-2">
                    {new Date(order.created_at).toLocaleDateString("nl-NL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
