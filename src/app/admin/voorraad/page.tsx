import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const supabase = createServiceRoleClient();

  const { data: wines } = await supabase
    .from("wines")
    .select("id, name, slug, type, sku, stock_quantity, is_active")
    .order("stock_quantity", { ascending: true });

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, code, is_active, lead_time_days")
    .order("name", { ascending: true });

  const { data: inventory } = await supabase
    .from("inventory")
    .select(
      "wine_id, supplier_id, quantity_available, is_primary, last_synced_at",
    )
    .order("wine_id");

  const inventoryByWine = (inventory ?? []).reduce(
    (acc, row) => {
      if (!acc[row.wine_id]) acc[row.wine_id] = [];
      acc[row.wine_id]!.push(row);
      return acc;
    },
    {} as Record<string, NonNullable<typeof inventory>>,
  );

  const supplierList = suppliers ?? [];
  const supplierMap = supplierList.reduce(
    (acc, s) => {
      acc[s.id] = s;
      return acc;
    },
    {} as Record<string, (typeof supplierList)[number]>,
  );

  const lowStockThreshold = 10;
  const outOfStock = (wines ?? []).filter((w) => w.stock_quantity === 0);
  const lowStock = (wines ?? []).filter(
    (w) => w.stock_quantity > 0 && w.stock_quantity < lowStockThreshold,
  );

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">VOORRAAD</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Uitverkocht"
          value={outOfStock.length.toString()}
          variant={outOfStock.length > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Lage voorraad (<10)"
          value={lowStock.length.toString()}
          variant={lowStock.length > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Leveranciers actief"
          value={(suppliers ?? []).filter((s) => s.is_active).length.toString()}
          variant="default"
        />
      </div>

      {/* Inventory table */}
      <div className="border-2 border-ink bg-offwhite overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-ink bg-champagne">
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Wijn
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Eigen voorraad
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Leverancier
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Actief
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Laatste sync
              </th>
            </tr>
          </thead>
          <tbody>
            {(wines ?? []).map((wine) => {
              const wineInventory = inventoryByWine[wine.id] ?? [];
              const primarySupplier = wineInventory.find((i) => i.is_primary);

              return (
                <tr
                  key={wine.id}
                  className="border-b border-ink/10 hover:bg-champagne/30"
                >
                  <td className="p-3">
                    <p className="font-display text-sm font-bold">
                      {wine.name}
                    </p>
                    {wine.sku && (
                      <p className="font-accent text-[9px] uppercase tracking-widest text-ink/40">
                        {wine.sku}
                      </p>
                    )}
                  </td>
                  <td className="text-center p-3">
                    <StockBadge quantity={wine.stock_quantity} />
                  </td>
                  <td className="text-center p-3">
                    {primarySupplier ? (
                      <div>
                        <p className="font-accent text-[10px] uppercase tracking-widest">
                          {supplierMap[primarySupplier.supplier_id]?.name ??
                            "Onbekend"}
                        </p>
                        <p className="font-body text-xs text-ink/50">
                          {primarySupplier.quantity_available} beschikbaar
                        </p>
                      </div>
                    ) : (
                      <span className="font-body text-xs text-ink/30">
                        Geen leverancier
                      </span>
                    )}
                  </td>
                  <td className="text-center p-3">
                    <span
                      className={`text-sm ${wine.is_active ? "text-emerald" : "text-ink/20"}`}
                    >
                      {wine.is_active ? "●" : "○"}
                    </span>
                  </td>
                  <td className="font-body text-xs text-ink/50 text-right p-3">
                    {primarySupplier?.last_synced_at
                      ? new Date(
                          primarySupplier.last_synced_at,
                        ).toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!wines || wines.length === 0) && (
          <p className="font-body text-base text-ink/50 p-6 text-center">
            Geen wijnen gevonden.
          </p>
        )}
      </div>

      {/* Suppliers */}
      {suppliers && suppliers.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Leveranciers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="border-2 border-ink bg-offwhite p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-display text-sm font-bold">
                    {supplier.name}
                  </p>
                  <span
                    className={`text-sm ${supplier.is_active ? "text-emerald" : "text-ink/20"}`}
                  >
                    {supplier.is_active ? "●" : "○"}
                  </span>
                </div>
                <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                  Code: {supplier.code}
                </p>
                <p className="font-body text-xs text-ink/50">
                  Levertijd: {supplier.lead_time_days} dagen
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "default" | "warning" | "danger";
}) {
  const bg =
    variant === "danger"
      ? "bg-wine/10 border-wine/50"
      : variant === "warning"
        ? "bg-amber-50 border-amber-300"
        : "bg-offwhite border-ink";

  const textColor =
    variant === "danger"
      ? "text-wine"
      : variant === "warning"
        ? "text-amber-700"
        : "text-ink";

  return (
    <div className={`border-2 p-4 ${bg}`}>
      <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
        {label}
      </p>
      <p className={`font-display text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <span className="font-accent text-[9px] uppercase tracking-widest px-2 py-0.5 border bg-wine/20 text-wine border-wine/50">
        Uitverkocht
      </span>
    );
  }

  if (quantity < 10) {
    return (
      <span className="font-accent text-[9px] uppercase tracking-widest px-2 py-0.5 border bg-amber-50 text-amber-700 border-amber-300">
        {quantity}
      </span>
    );
  }

  return (
    <span className="font-body text-sm text-ink font-bold">{quantity}</span>
  );
}
