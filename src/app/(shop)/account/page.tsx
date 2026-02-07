import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { BrutalButton } from "@/components/ui/BrutalButton";
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

  // Get customer record
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  // Get recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items:order_items(*)")
    .eq("email", user.email!)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-display-md text-ink">
            MIJN ACCOUNT
          </h1>
          <LogoutButton />
        </div>

        {/* Profile */}
        <div className="border-brutal border-ink bg-offwhite brutal-shadow p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Profiel
          </h2>
          <div className="space-y-2 font-body text-base">
            <p>
              <span className="text-ink/50">E-mail:</span>{" "}
              <span className="font-bold">{user.email}</span>
            </p>
            {customer && (
              <>
                <p>
                  <span className="text-ink/50">Naam:</span>{" "}
                  <span className="font-bold">
                    {customer.first_name} {customer.last_name}
                  </span>
                </p>
                {customer.phone && (
                  <p>
                    <span className="text-ink/50">Telefoon:</span>{" "}
                    <span className="font-bold">{customer.phone}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="border-brutal border-ink bg-offwhite brutal-shadow p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Bestellingen
          </h2>

          {!orders || orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-body text-base text-ink/50 mb-4">
                Je hebt nog geen bestellingen geplaatst.
              </p>
              <BrutalButton variant="primary" size="md" href="/wijnen">
                Bekijk wijnen →
              </BrutalButton>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-ink p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold">
                      {order.order_number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between font-body text-sm text-ink/60">
                    <span>
                      {new Date(order.created_at).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-bold text-ink">
                      {formatPrice(order.total_cents)}
                    </span>
                  </div>
                  <div className="font-body text-sm text-ink/50">
                    {order.order_items?.length ?? 0} item(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
