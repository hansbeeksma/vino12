import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

function getRevenueByDay(
  orders: { total_cents: number; created_at: string }[],
): { date: string; revenue: number; count: number }[] {
  const byDay = new Map<string, { revenue: number; count: number }>();

  for (const order of orders) {
    const date = order.created_at.split("T")[0];
    const existing = byDay.get(date) ?? { revenue: 0, count: 0 };
    byDay.set(date, {
      revenue: existing.revenue + order.total_cents,
      count: existing.count + 1,
    });
  }

  return Array.from(byDay.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Last 14 days
}

function getThirtyDaysAgo(): string {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
}

export default async function AdminDashboard() {
  const supabase = createServiceRoleClient();

  const thirtyDaysAgo = getThirtyDaysAgo();

  // Fetch stats
  const [ordersRes, recentMonthRes, customersRes, winesRes, recentOrdersRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select("total_cents, status")
        .in("status", ["confirmed", "processing", "shipped", "delivered"]),
      supabase
        .from("orders")
        .select("total_cents, created_at")
        .in("status", ["confirmed", "processing", "shipped", "delivered"])
        .gte("created_at", thirtyDaysAgo),
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
  const monthRevenue = (recentMonthRes.data ?? []).reduce(
    (sum, o) => sum + o.total_cents,
    0,
  );
  const orderCount = ordersRes.data?.length ?? 0;
  const monthOrderCount = recentMonthRes.data?.length ?? 0;
  const customerCount = customersRes.count ?? 0;
  const lowStock = (winesRes.data ?? []).filter(
    (w) => w.stock_quantity < 10,
  ).length;
  const recentOrders = recentOrdersRes.data ?? [];
  const dailyRevenue = getRevenueByDay(recentMonthRes.data ?? []);
  const avgOrderValue =
    orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  const stats = [
    { label: "Totale omzet", value: formatPrice(totalRevenue) },
    { label: "Omzet (30d)", value: formatPrice(monthRevenue) },
    { label: "Bestellingen", value: orderCount.toString() },
    { label: "Orders (30d)", value: monthOrderCount.toString() },
    { label: "Gem. orderwaarde", value: formatPrice(avgOrderValue) },
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

      {/* Revenue chart (last 14 days) */}
      {dailyRevenue.length > 0 && (
        <div className="border-2 border-ink bg-offwhite p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Omzet (afgelopen 14 dagen)
          </h2>
          <div className="flex items-end gap-1 h-32">
            {dailyRevenue.map((day) => {
              const maxRevenue = Math.max(
                ...dailyRevenue.map((d) => d.revenue),
              );
              const height =
                maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-wine/80 hover:bg-wine transition-colors"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${day.date}: ${formatPrice(day.revenue)} (${day.count} orders)`}
                  />
                  <span className="font-accent text-[7px] text-ink/40 -rotate-45 origin-top-left whitespace-nowrap">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-ink">
          Recente bestellingen
        </h2>
        <Link
          href="/api/admin/export/orders"
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine border border-ink/20 px-3 py-1"
        >
          CSV Export
        </Link>
      </div>

      <div className="border-2 border-ink bg-offwhite p-6">
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
