import { createServiceRoleClient } from "@/lib/supabase/server";
import { formatPrice, typeLabel, bodyLabel } from "@/lib/utils";
import type { WineType, WineBody } from "@/lib/schemas/wine";

export const dynamic = "force-dynamic";

export default async function AdminWinesPage() {
  const supabase = createServiceRoleClient();

  const { data: wines } = await supabase
    .from("wines")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">WIJNEN</h1>

      <div className="border-2 border-ink bg-offwhite overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b-2 border-ink bg-champagne">
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Naam
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Type
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-left p-3">
                Body
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Jaar
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Voorraad
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-right p-3">
                Prijs
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Actief
              </th>
              <th className="font-accent text-[10px] uppercase tracking-widest text-center p-3">
                Featured
              </th>
            </tr>
          </thead>
          <tbody>
            {(wines ?? []).map((wine) => (
              <tr
                key={wine.id}
                className="border-b border-ink/10 hover:bg-champagne/30"
              >
                <td className="p-3">
                  <p className="font-display text-sm font-bold">{wine.name}</p>
                  {wine.sku && (
                    <p className="font-accent text-[9px] uppercase tracking-widest text-ink/40">
                      {wine.sku}
                    </p>
                  )}
                </td>
                <td className="p-3">
                  <TypeBadge type={wine.type} />
                </td>
                <td className="font-body text-sm p-3">
                  {bodyLabel(wine.body as WineBody | null)}
                </td>
                <td className="font-body text-sm text-center p-3">
                  {wine.vintage ?? "—"}
                </td>
                <td className="text-center p-3">
                  <StockIndicator quantity={wine.stock_quantity} />
                </td>
                <td className="font-body text-sm font-bold text-right p-3">
                  {formatPrice(wine.price_cents)}
                </td>
                <td className="text-center p-3">
                  <BoolIcon value={wine.is_active} />
                </td>
                <td className="text-center p-3">
                  <BoolIcon value={wine.is_featured} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!wines || wines.length === 0) && (
          <p className="font-body text-base text-ink/50 p-6 text-center">
            Nog geen wijnen.
          </p>
        )}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    red: "bg-wine/20 text-wine border-wine/50",
    white: "bg-emerald/20 text-emerald border-emerald/50",
    rose: "bg-pink-200 text-pink-700 border-pink-300",
    sparkling: "bg-amber-100 text-amber-700 border-amber-300",
    dessert: "bg-amber-100 text-amber-700 border-amber-300",
    fortified: "bg-amber-100 text-amber-800 border-amber-400",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
  };

  return (
    <span
      className={`font-accent text-[9px] uppercase tracking-widest px-2 py-0.5 border ${colorMap[type] ?? "bg-ink/10 text-ink border-ink/20"}`}
    >
      {typeLabel(type as WineType)}
    </span>
  );
}

function StockIndicator({ quantity }: { quantity: number }) {
  const color =
    quantity === 0
      ? "text-wine font-bold"
      : quantity < 10
        ? "text-amber-600 font-bold"
        : "text-ink";

  return <span className={`font-body text-sm ${color}`}>{quantity}</span>;
}

function BoolIcon({ value }: { value: boolean }) {
  return (
    <span className={`text-sm ${value ? "text-emerald" : "text-ink/20"}`}>
      {value ? "●" : "○"}
    </span>
  );
}
