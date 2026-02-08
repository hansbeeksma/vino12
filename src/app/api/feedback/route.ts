import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGorseClient } from "@/lib/gorse";
import { z } from "zod";

const feedbackSchema = z.object({
  feedbackType: z.enum(["view", "rating", "purchase"]),
  itemId: z.string().min(1),
  value: z.number().min(0).max(5).optional(),
});

/**
 * POST /api/feedback
 *
 * Track user interactions with wines for the recommendation engine.
 * Requires authenticated Supabase session.
 *
 * Body: { feedbackType: "view"|"rating"|"purchase", itemId: string, value?: number }
 */
export async function POST(request: NextRequest) {
  // Authenticate user via Supabase session
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Niet ingelogd" },
      { status: 401 },
    );
  }

  // Validate request body
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validatie mislukt",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { feedbackType, itemId, value } = parsed.data;

  // Map feedback type to Gorse feedback type
  // For ratings, use the value as a weighted feedback type
  const gorseType =
    feedbackType === "rating" && value !== undefined ? "rating" : feedbackType;

  const gorse = getGorseClient();

  try {
    await gorse.insertFeedback({
      FeedbackType: gorseType,
      UserId: user.id,
      ItemId: itemId,
      Timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Feedback niet opgeslagen: ${message}` },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        feedbackType: gorseType,
        userId: user.id,
        itemId,
      },
    },
    { status: 201 },
  );
}
