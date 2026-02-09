import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const funnelEventSchema = z.object({
  session_id: z.string().min(1),
  user_id: z.string().uuid().optional(),
  event_type: z.enum([
    "page_visit",
    "product_viewed",
    "add_to_cart",
    "checkout_started",
    "order_completed",
  ]),
  event_data: z.record(z.unknown()).optional(),
  device_type: z.enum(["mobile", "desktop", "tablet"]).optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = funnelEventSchema.parse(body);

    // Create Supabase client (uses service role for write access)
    const supabase = createClient();

    // Insert funnel event
    const { data, error } = await supabase
      .from("funnel_events")
      .insert({
        session_id: validatedData.session_id,
        user_id: validatedData.user_id || null,
        event_type: validatedData.event_type,
        event_data: validatedData.event_data || {},
        device_type: validatedData.device_type || null,
        browser: validatedData.browser || null,
        referrer: validatedData.referrer || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Funnel event insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", issues: error.errors },
        { status: 400 },
      );
    }

    console.error("Funnel tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/analytics/funnel",
    methods: ["POST"],
  });
}
