import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const supabase = createServiceRoleClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("*, orders:orders(id, total_cents)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">KLANTEN</h1>

      <div className="border-2 border-ink bg-offwhite overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-ink bg-champagne">
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Naam
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                E-mail
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Telefoon
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Bestellingen
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Totaal besteed
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Lid sinds
              </th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((customer) => {
              const orderCount = customer.orders?.length ?? 0;
              const totalSpent = (customer.orders ?? []).reduce(
                (sum: number, o: { total_cents: number }) =>
                  sum + o.total_cents,
                0,
              );

              return (
                <tr
                  key={customer.id}
                  className="border-b border-ink/10 hover:bg-champagne/30"
                >
                  <td className="p-3">
                    <p className="font-display text-sm font-bold">
                      {customer.first_name} {customer.last_name}
                    </p>
                  </td>
                  <td className="font-body text-sm p-3">{customer.email}</td>
                  <td className="font-body text-sm text-ink/50 p-3">
                    {customer.phone ?? "—"}
                  </td>
                  <td className="font-body text-sm text-center p-3">
                    {orderCount}
                  </td>
                  <td className="font-body text-sm font-bold text-right p-3">
                    {formatPrice(totalSpent)}
                  </td>
                  <td className="font-body text-sm text-ink/50 text-right p-3">
                    {new Date(customer.created_at).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!customers || customers.length === 0) && (
          <p className="font-body text-base text-ink/50 p-6 text-center">
            Nog geen klanten.
          </p>
        )}
      </div>
    </div>
  );
}
