import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { processIdeaAnalysis } from "@/lib/ai/process-idea";
import { sendWhatsAppMessage, formatIdeaReply } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// Rate limiting: track messages per sender
const senderTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 3600_000; // 1 hour
const RATE_LIMIT_MAX = 100;

function isRateLimited(sender: string): boolean {
  const now = Date.now();
  const timestamps = senderTimestamps.get(sender) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  senderTimestamps.set(sender, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  return false;
}

/**
 * GET: Meta webhook verification (challenge-response)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST: Process incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Meta sends webhook events with this structure
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) {
      // Status updates or other non-message events
      return NextResponse.json({ received: true });
    }

    const message = value.messages[0];
    const sender = message.from;
    const senderName = value.contacts?.[0]?.profile?.name ?? "Onbekend";

    // Rate limit check
    if (isRateLimited(sender)) {
      return NextResponse.json({ received: true, rate_limited: true });
    }

    // Parse message content
    let rawMessage = "";
    let messageType: "text" | "voice" | "image" = "text";
    let mediaUrl: string | undefined;

    if (message.type === "text") {
      rawMessage = message.text?.body ?? "";
    } else if (message.type === "image") {
      messageType = "image";
      rawMessage = message.image?.caption ?? "[Afbeelding zonder tekst]";
      mediaUrl = message.image?.id;
    } else if (message.type === "audio") {
      messageType = "voice";
      rawMessage = "[Spraakbericht - transcriptie niet beschikbaar]";
      mediaUrl = message.audio?.id;
    } else {
      // Unsupported message type
      return NextResponse.json({ received: true, skipped: true });
    }

    if (!rawMessage.trim()) {
      return NextResponse.json({ received: true, empty: true });
    }

    // Store idea in database
    const supabase = createServiceRoleClient();

    const { data: idea, error: insertError } = await supabase
      .from("ideas")
      .insert({
        whatsapp_sender: sender,
        sender_name: senderName,
        raw_message: rawMessage,
        message_type: messageType,
        media_url: mediaUrl,
        status: "received",
      })
      .select("id")
      .single();

    if (insertError || !idea) {
      return NextResponse.json(
        { error: "Failed to store idea" },
        { status: 500 },
      );
    }

    // Send acknowledgment
    await sendWhatsAppMessage(
      sender,
      `💡 Idee ontvangen! We analyseren het nu...\n\n"${rawMessage.substring(0, 100)}${rawMessage.length > 100 ? "..." : ""}"`,
    ).catch(() => {
      // Don't fail the webhook if reply fails
    });

    // Run analysis in background (don't block webhook response)
    processAndReply(idea.id, rawMessage, sender).catch(() => {
      // Logged in the function itself
    });

    return NextResponse.json({ received: true, idea_id: idea.id });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Background: Run AI analysis, store results, then send WhatsApp reply
 */
async function processAndReply(
  ideaId: string,
  rawMessage: string,
  sender: string,
): Promise<void> {
  // Run shared analysis pipeline
  await processIdeaAnalysis(ideaId, rawMessage);

  // Fetch the stored analysis for the WhatsApp reply
  const supabase = createServiceRoleClient();
  const { data: analysis } = await supabase
    .from("idea_analyses")
    .select("title, category, urgency, summary")
    .eq("idea_id", ideaId)
    .single();

  if (analysis) {
    await sendWhatsAppMessage(
      sender,
      formatIdeaReply({
        title: analysis.title,
        category: analysis.category,
        urgency: analysis.urgency,
        summary: analysis.summary ?? "",
        ideaId,
      }),
    ).catch(() => {
      // Non-critical: analysis is stored even if reply fails
    });
  }
}
