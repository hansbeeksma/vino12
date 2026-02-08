import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { TraceabilityClient } from "./client";

export const metadata: Metadata = {
  title: "Traceability | VINO12 Admin",
};

interface WineRow {
  id: string;
  name: string;
  slug: string;
}

export default async function TraceabilityPage() {
  if (!isFeatureEnabled("blockchain.enabled")) {
    redirect("/admin");
  }
  const supabase = createServiceRoleClient();

  const { data: wines } = await supabase
    .from("wines")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  const { data: recentEvents } = await supabase
    .from("supply_chain_events")
    .select("*, wine:wines(name)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { count: totalEvents } = await supabase
    .from("supply_chain_events")
    .select("id", { count: "exact" });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">
          Wine Traceability
        </h1>
        <p className="font-body text-sm text-ink/60 mt-1">
          Beheer supply chain events en digital wine passports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border-2 border-ink p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
            Totaal Events
          </p>
          <p className="font-display text-2xl font-bold text-ink mt-1">
            {totalEvents ?? 0}
          </p>
        </div>
        <div className="border-2 border-ink p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
            Wijnen met Passport
          </p>
          <p className="font-display text-2xl font-bold text-ink mt-1">
            {
              new Set(
                (recentEvents ?? []).map(
                  (e) => (e as { wine_id: string }).wine_id,
                ),
              ).size
            }
          </p>
        </div>
        <div className="border-2 border-ink p-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
            Actieve Wijnen
          </p>
          <p className="font-display text-2xl font-bold text-ink mt-1">
            {wines?.length ?? 0}
          </p>
        </div>
      </div>

      <TraceabilityClient
        wines={(wines ?? []) as WineRow[]}
        recentEvents={recentEvents ?? []}
      />
    </div>
  );
}
