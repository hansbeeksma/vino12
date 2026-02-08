import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyChain } from "@/lib/traceability/crypto";
import type { WinePassport, SupplyChainEvent } from "@/lib/traceability/types";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wineId: string }> },
) {
  if (!isFeatureEnabled("blockchain.enabled")) {
    return NextResponse.json(
      { error: "Traceability is niet beschikbaar" },
      { status: 404 },
    );
  }
  const { wineId } = await params;

  if (!wineId) {
    return NextResponse.json(
      { success: false, error: "Wine ID is required" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: wine, error: wineError } = await supabase
    .from("wines")
    .select(
      "id, name, slug, vintage, producer:producers(name), region:regions(name)",
    )
    .eq("id", wineId)
    .single();

  if (wineError || !wine) {
    return NextResponse.json(
      { success: false, error: "Wine not found" },
      { status: 404 },
    );
  }

  const { data: events, error: eventsError } = await supabase
    .from("supply_chain_events")
    .select("*")
    .eq("wine_id", wineId)
    .order("timestamp", { ascending: true });

  if (eventsError) {
    return NextResponse.json(
      { success: false, error: "Failed to load supply chain data" },
      { status: 500 },
    );
  }

  const typedEvents = (events ?? []) as SupplyChainEvent[];
  const { valid } = await verifyChain(typedEvents);

  const passport: WinePassport = {
    wine_id: wine.id,
    wine_name: wine.name,
    wine_slug: wine.slug,
    producer:
      (wine.producer as unknown as { name: string } | null)?.name ?? "Onbekend",
    region:
      (wine.region as unknown as { name: string } | null)?.name ?? "Onbekend",
    vintage: wine.vintage,
    events: typedEvents,
    chain_valid: valid,
    generated_at: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: passport });
}
