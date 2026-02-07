import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { analyzeIdea } from "@/lib/ai/analyze-idea";
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
    processIdeaAnalysis(idea.id, rawMessage, sender).catch(() => {
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
 * Background: Run AI analysis and store results
 */
async function processIdeaAnalysis(
  ideaId: string,
  rawMessage: string,
  sender: string,
): Promise<void> {
  const supabase = createServiceRoleClient();

  try {
    // Update status to analyzing
    await supabase
      .from("ideas")
      .update({ status: "analyzing" })
      .eq("id", ideaId);

    // Run full AI pipeline
    const result = await analyzeIdea(rawMessage);

    // Store analysis
    await supabase.from("idea_analyses").insert({
      idea_id: ideaId,
      title: result.classifier.title,
      summary: result.classifier.summary,
      category: result.classifier.category,
      urgency: result.classifier.urgency,
      complexity: result.classifier.complexity,
      feasibility_score: result.planner.feasibility_score,
      swot: result.planner.swot,
      research_findings: result.research,
      action_plan: result.planner.action_plan,
      estimated_effort: result.planner.estimated_effort,
      ai_model: "claude-haiku+sonnet+perplexity",
    });

    // Update idea status
    await supabase
      .from("ideas")
      .update({ status: "analyzed" })
      .eq("id", ideaId);

    // Send WhatsApp reply with summary
    await sendWhatsAppMessage(
      sender,
      formatIdeaReply({
        title: result.classifier.title,
        category: result.classifier.category,
        urgency: result.classifier.urgency,
        summary: result.classifier.summary,
        ideaId,
      }),
    ).catch(() => {
      // Non-critical: analysis is stored even if reply fails
    });
  } catch (error) {
    // Mark as failed but don't lose the original idea
    await supabase
      .from("ideas")
      .update({ status: "received" })
      .eq("id", ideaId);

    throw error;
  }
}
