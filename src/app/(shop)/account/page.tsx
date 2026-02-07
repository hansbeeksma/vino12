import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mijn Account | VINO12",
};

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: customer }, { data: orders }, { data: addresses }] =
    await Promise.all([
      supabase
        .from("customers")
        .select("*")
        .eq("auth_user_id", user.id)
        .single(),
      supabase
        .from("orders")
        .select("id, order_number, status, total_cents, created_at")
        .eq("email", user.email!)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("addresses")
        .select("id")
        .eq(
          "customer_id",
          (
            await supabase
              .from("customers")
              .select("id")
              .eq("auth_user_id", user.id)
              .single()
          ).data?.id ?? "",
        ),
    ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-ink">MIJN ACCOUNT</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-ink bg-offwhite p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
            Naam
          </p>
          <p className="font-display text-lg font-bold text-ink">
            {customer?.first_name && customer?.last_name
              ? `${customer.first_name} ${customer.last_name}`
              : "Niet ingesteld"}
          </p>
        </div>
        <div className="border-2 border-ink bg-offwhite p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
            E-mail
          </p>
          <p className="font-display text-lg font-bold text-ink truncate">
            {user.email}
          </p>
        </div>
        <div className="border-2 border-ink bg-offwhite p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
            Bestellingen
          </p>
          <p className="font-display text-lg font-bold text-ink">
            {orders?.length ?? 0}
          </p>
        </div>
        <div className="border-2 border-ink bg-offwhite p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
            Adressen
          </p>
          <p className="font-display text-lg font-bold text-ink">
            {addresses?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/account/profiel"
          className="border-2 border-ink bg-offwhite p-4 hover:bg-champagne transition-colors group"
        >
          <p className="font-display text-base font-bold text-ink group-hover:text-wine">
            Profiel bewerken →
          </p>
          <p className="font-body text-sm text-ink/50">
            Naam, telefoon, voorkeuren
          </p>
        </Link>
        <Link
          href="/account/adressen"
          className="border-2 border-ink bg-offwhite p-4 hover:bg-champagne transition-colors group"
        >
          <p className="font-display text-base font-bold text-ink group-hover:text-wine">
            Adresboek →
          </p>
          <p className="font-body text-sm text-ink/50">
            Bezorgadressen beheren
          </p>
        </Link>
        <Link
          href="/account/bestellingen"
          className="border-2 border-ink bg-offwhite p-4 hover:bg-champagne transition-colors group"
        >
          <p className="font-display text-base font-bold text-ink group-hover:text-wine">
            Bestellingen →
          </p>
          <p className="font-body text-sm text-ink/50">Ordergeschiedenis</p>
        </Link>
      </div>

      {/* Recent orders preview */}
      {orders && orders.length > 0 && (
        <div className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Recente bestellingen
          </h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-ink/10 pb-3 last:border-0"
              >
                <div>
                  <span className="font-display text-sm font-bold">
                    {order.order_number}
                  </span>
                  <span className="font-body text-sm text-ink/50 ml-3">
                    {new Date(order.created_at).toLocaleDateString("nl-NL")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-body text-sm font-bold">
                    {formatPrice(order.total_cents)}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
