import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createServiceRoleClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items:order_items(id)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        BESTELLINGEN
      </h1>

      <div className="border-2 border-ink bg-offwhite overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-ink bg-champagne">
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Bestelnr
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                E-mail
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Status
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Betaling
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Items
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Totaal
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Datum
              </th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr
                key={order.id}
                className="border-b border-ink/10 hover:bg-champagne/30"
              >
                <td className="font-display text-sm font-bold p-3">
                  {order.order_number}
                </td>
                <td className="font-body text-sm p-3">{order.email}</td>
                <td className="p-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-3">
                  <StatusBadge status={order.payment_status} />
                </td>
                <td className="font-body text-sm text-center p-3">
                  {order.order_items?.length ?? 0}
                </td>
                <td className="font-body text-sm font-bold text-right p-3">
                  {formatPrice(order.total_cents)}
                </td>
                <td className="font-body text-sm text-ink/50 text-right p-3">
                  {new Date(order.created_at).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!orders || orders.length === 0) && (
          <p className="font-body text-base text-ink/50 p-6 text-center">
            Nog geen bestellingen.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending: "bg-champagne text-ink border-ink/30",
    confirmed: "bg-emerald/20 text-emerald border-emerald/50",
    paid: "bg-emerald/20 text-emerald border-emerald/50",
    processing: "bg-wine/20 text-wine border-wine/50",
    shipped: "bg-emerald/30 text-emerald border-emerald/50",
    delivered: "bg-emerald text-champagne border-emerald",
    cancelled: "bg-ink/10 text-ink/50 border-ink/20",
    failed: "bg-wine/20 text-wine border-wine/50",
    expired: "bg-ink/10 text-ink/50 border-ink/20",
    refunded: "bg-ink/10 text-ink/50 border-ink/20",
  };

  return (
    <span
      className={`font-accent text-[9px] uppercase tracking-widest px-2 py-0.5 border ${colorMap[status] ?? "bg-ink/10 text-ink border-ink/20"}`}
    >
      {status}
    </span>
  );
}
