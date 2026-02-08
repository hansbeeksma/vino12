import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyChain } from "@/lib/traceability/crypto";
import type {
  SupplyChainEvent,
  VerificationResult,
} from "@/lib/traceability/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const wineId = request.nextUrl.searchParams.get("wine_id");

  if (!wineId) {
    return NextResponse.json(
      { success: false, error: "wine_id parameter is required" },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();

  const { data: wine, error: wineError } = await supabase
    .from("wines")
    .select("name")
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
      { success: false, error: "Failed to load events" },
      { status: 500 },
    );
  }

  const typedEvents = (events ?? []) as SupplyChainEvent[];
  const { valid, errors } = await verifyChain(typedEvents);

  const lastEvent =
    typedEvents.length > 0
      ? typedEvents[typedEvents.length - 1].event_type
      : null;

  const result: VerificationResult = {
    valid,
    wine_name: wine.name,
    chain_intact: valid,
    event_count: typedEvents.length,
    last_event: lastEvent,
    errors,
  };

  return NextResponse.json({ success: true, data: result });
}
