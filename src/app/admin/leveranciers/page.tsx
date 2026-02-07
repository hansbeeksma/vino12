import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leveranciers | VINO12 Admin",
};

interface SupplierRow {
  id: string;
  name: string;
  code: string;
  api_endpoint: string | null;
  contact_email: string | null;
  is_active: boolean;
  lead_time_days: number;
  minimum_order_cents: number;
  shipping_cost_cents: number;
}

export default async function SuppliersPage() {
  const supabase = createServiceRoleClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  const { data: lowStock } = await supabase
    .from("inventory")
    .select("id", { count: "exact" })
    .lte("quantity_available", 5)
    .eq("is_primary", true);

  const { data: syncLogs } = await supabase
    .from("inventory_sync_log")
    .select("*")
    .order("synced_at", { ascending: false })
    .limit(5);

  const typedSuppliers = (suppliers ?? []) as SupplierRow[];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-sm text-ink">Leveranciers</h1>
        <div className="flex gap-4 font-accent text-xs uppercase tracking-widest">
          <span className="px-3 py-1 bg-ink text-offwhite">
            {typedSuppliers.length} leveranciers
          </span>
          <span className="px-3 py-1 bg-wine text-offwhite">
            {lowStock?.length ?? 0} lage voorraad
          </span>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="border-brutal border-ink mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-ink bg-ink text-offwhite">
              <th className="p-3 text-left font-accent text-xs uppercase tracking-widest">
                Naam
              </th>
              <th className="p-3 text-left font-accent text-xs uppercase tracking-widest">
                Code
              </th>
              <th className="p-3 text-left font-accent text-xs uppercase tracking-widest">
                Contact
              </th>
              <th className="p-3 text-center font-accent text-xs uppercase tracking-widest">
                Levertijd
              </th>
              <th className="p-3 text-center font-accent text-xs uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {typedSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-ink/10">
                <td className="p-3 font-body font-bold">{supplier.name}</td>
                <td className="p-3 font-mono text-sm text-ink/60">
                  {supplier.code}
                </td>
                <td className="p-3 font-body text-sm">
                  {supplier.contact_email ?? (
                    <span className="text-ink/30">-</span>
                  )}
                </td>
                <td className="p-3 text-center font-body text-sm">
                  {supplier.lead_time_days}d
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      supplier.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </td>
              </tr>
            ))}
            {typedSuppliers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-ink/40 font-accent text-sm uppercase tracking-widest"
                >
                  Geen leveranciers geconfigureerd
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Sync Logs */}
      <h2 className="font-display text-xl text-ink mb-4">
        Recente synchronisaties
      </h2>
      <div className="border-brutal border-ink">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="p-3 text-left font-accent text-xs uppercase tracking-widest">
                Datum
              </th>
              <th className="p-3 text-left font-accent text-xs uppercase tracking-widest">
                Status
              </th>
              <th className="p-3 text-center font-accent text-xs uppercase tracking-widest">
                Gesynct
              </th>
              <th className="p-3 text-center font-accent text-xs uppercase tracking-widest">
                Fouten
              </th>
            </tr>
          </thead>
          <tbody>
            {(syncLogs ?? []).map(
              (log: {
                id: string;
                synced_at: string;
                status: string;
                items_synced: number;
                errors: string[] | null;
              }) => (
                <tr key={log.id} className="border-b border-ink/10">
                  <td className="p-3 font-mono text-sm">
                    {new Date(log.synced_at).toLocaleString("nl-NL")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-accent text-xs uppercase tracking-widest px-2 py-0.5 ${
                        log.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : log.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-center font-body">
                    {log.items_synced}
                  </td>
                  <td className="p-3 text-center font-body">
                    {log.errors?.length ?? 0}
                  </td>
                </tr>
              ),
            )}
            {(syncLogs ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-ink/40 font-accent text-sm uppercase tracking-widest"
                >
                  Nog geen synchronisaties uitgevoerd
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
