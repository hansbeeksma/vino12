import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  buildEventPayload,
  hashEvent,
  signEvent,
} from "@/lib/traceability/crypto";
import type { SupplyChainEventType } from "@/lib/traceability/types";
import { z } from "zod";

const EVENT_TYPES: SupplyChainEventType[] = [
  "harvest",
  "vinification",
  "bottling",
  "quality_check",
  "import",
  "warehouse",
  "delivery",
];

const addEventSchema = z.object({
  wine_id: z.string().uuid(),
  event_type: z.enum(EVENT_TYPES as [string, ...string[]]),
  location: z.string().min(1).max(500),
  actor: z.string().min(1).max(200),
  data: z.record(z.string(), z.unknown()).optional().default({}),
  timestamp: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { wine_id, event_type, location, actor, data, timestamp } = parsed.data;
  const eventTimestamp = timestamp ?? new Date().toISOString();

  const supabase = createServiceRoleClient();

  // Verify wine exists
  const { data: wine, error: wineError } = await supabase
    .from("wines")
    .select("id")
    .eq("id", wine_id)
    .single();

  if (wineError || !wine) {
    return NextResponse.json(
      { success: false, error: "Wine not found" },
      { status: 404 },
    );
  }

  // Get last event in chain for this wine
  const { data: lastEvents } = await supabase
    .from("supply_chain_events")
    .select("hash")
    .eq("wine_id", wine_id)
    .order("timestamp", { ascending: false })
    .limit(1);

  const previousHash =
    lastEvents && lastEvents.length > 0 ? lastEvents[0].hash : null;

  // Build, hash, and sign the event
  const payload = buildEventPayload({
    wine_id,
    event_type: event_type as SupplyChainEventType,
    timestamp: eventTimestamp,
    location,
    actor,
    data,
    previous_hash: previousHash,
  });

  const hash = await hashEvent(payload);
  const signature = await signEvent(hash);

  // Store the event
  const { data: newEvent, error: insertError } = await supabase
    .from("supply_chain_events")
    .insert({
      wine_id,
      event_type,
      timestamp: eventTimestamp,
      location,
      actor,
      data,
      previous_hash: previousHash,
      hash,
      signature,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { success: false, error: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const wineId = request.nextUrl.searchParams.get("wine_id");

  const supabase = createServiceRoleClient();

  let query = supabase
    .from("supply_chain_events")
    .select("*, wine:wines(name, slug)")
    .order("timestamp", { ascending: false });

  if (wineId) {
    query = query.eq("wine_id", wineId);
  }

  const { data, error } = await query.limit(100);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: data ?? [] });
}
