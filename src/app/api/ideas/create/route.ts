import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";
import { ideaInputSchema } from "@/lib/schemas/idea-input";
import { processIdeaAnalysis } from "@/lib/ai/process-idea";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const result = await getUserRole();

    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = ideaInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ongeldige invoer", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { message, source, tags } = parsed.data;

    const supabase = createServiceRoleClient();

    const { data: idea, error: insertError } = await supabase
      .from("ideas")
      .insert({
        raw_message: message,
        source,
        created_by: result.user.id,
        tags: tags ?? [],
        sender_name: result.user.email?.split("@")[0] ?? "Web",
        status: "received",
        message_type: source === "voice" ? "voice" : "text",
      })
      .select("id")
      .single();

    if (insertError || !idea) {
      return NextResponse.json(
        { error: "Idee opslaan mislukt" },
        { status: 500 },
      );
    }

    // Trigger AI analysis in background
    processIdeaAnalysis(idea.id, message).catch(() => {
      // Analysis failure is non-blocking
    });

    return NextResponse.json({ id: idea.id, status: "received" });
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}
