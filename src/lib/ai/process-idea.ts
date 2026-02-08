import { createServiceRoleClient } from "@/lib/supabase/server";
import { analyzeIdea } from "./analyze-idea";

/**
 * Run AI analysis pipeline on an idea and store results.
 * Shared between WhatsApp webhook and web idea submission.
 */
export async function processIdeaAnalysis(
  ideaId: string,
  rawMessage: string,
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
  } catch (error) {
    // Mark as failed but don't lose the original idea
    await supabase
      .from("ideas")
      .update({ status: "received" })
      .eq("id", ideaId);

    throw error;
  }
}
