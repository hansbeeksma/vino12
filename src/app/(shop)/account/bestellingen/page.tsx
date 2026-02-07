import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bestellingen | Mijn Account | VINO12",
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "*, order_items:order_items(id, wine_name, quantity, unit_price_cents, total_cents)",
    )
    .eq("email", user.email!)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        BESTELLINGEN
      </h1>

      {!orders || orders.length === 0 ? (
        <div className="border-2 border-ink bg-offwhite p-8 text-center">
          <p className="font-body text-base text-ink/50 mb-2">
            Je hebt nog geen bestellingen.
          </p>
          <a
            href="/wijnen"
            className="font-display text-sm font-bold text-wine hover:underline"
          >
            Bekijk onze wijnen →
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border-2 border-ink bg-offwhite">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b-2 border-ink">
                <div>
                  <span className="font-display text-base font-bold">
                    {order.order_number}
                  </span>
                  <span className="font-body text-sm text-ink/50 ml-3">
                    {new Date(order.created_at).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-display text-base font-bold">
                    {formatPrice(order.total_cents)}
                  </span>
                </div>
              </div>

              {/* Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="p-4 space-y-2">
                  {order.order_items.map(
                    (item: {
                      id: string;
                      wine_name: string;
                      quantity: number;
                      unit_price_cents: number;
                      total_cents: number;
                    }) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between font-body text-sm"
                      >
                        <span>
                          {item.quantity}x {item.wine_name}
                        </span>
                        <span className="font-bold">
                          {formatPrice(item.total_cents)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Tracking */}
              {order.tracking_url && (
                <div className="px-4 pb-4">
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-accent text-[10px] uppercase tracking-widest text-wine hover:underline"
                  >
                    Track & Trace →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "In behandeling", color: "bg-champagne text-ink" },
    confirmed: { label: "Bevestigd", color: "bg-emerald/20 text-emerald" },
    processing: { label: "Wordt verwerkt", color: "bg-wine/20 text-wine" },
    shipped: { label: "Verzonden", color: "bg-emerald/30 text-emerald" },
    delivered: { label: "Bezorgd", color: "bg-emerald text-champagne" },
    cancelled: { label: "Geannuleerd", color: "bg-ink/10 text-ink/50" },
    refunded: { label: "Terugbetaald", color: "bg-ink/10 text-ink/50" },
  };

  const info = statusMap[status] ?? {
    label: status,
    color: "bg-ink/10 text-ink",
  };

  return (
    <span
      className={`font-accent text-[10px] uppercase tracking-widest px-2 py-1 border border-ink ${info.color}`}
    >
      {info.label}
    </span>
  );
}
