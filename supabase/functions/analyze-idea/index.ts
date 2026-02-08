// Supabase Edge Function: analyze-idea
// Triggered by database webhook when new idea is inserted
// Runs the AI analysis pipeline and stores results
//
// Setup: Create a Database Webhook in Supabase Dashboard:
//   Table: ideas
//   Events: INSERT
//   URL: https://<project-ref>.supabase.co/functions/v1/analyze-idea
//   Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

const CLASSIFIER_PROMPT = `Je bent een idee-classifier voor VINO12, een Nederlandse online wijnwinkel.
Analyseer het ingestuurde idee en classificeer het.

Antwoord ALLEEN met valid JSON in exact dit format:
{
  "title": "Korte, pakkende titel (max 60 tekens)",
  "summary": "Samenvatting in 2-3 zinnen",
  "category": "product|marketing|operations|tech|content|design|other",
  "urgency": "low|medium|high|urgent",
  "complexity": "simple|medium|complex"
}`;

const RESEARCHER_PROMPT = `Je bent een marktonderzoeker voor VINO12, een Nederlandse online wijnwinkel.
Antwoord ALLEEN met valid JSON:
{
  "competitors": ["Beschrijving"],
  "trends": ["Trend"],
  "best_practices": ["Practice"],
  "risks": ["Risico"],
  "opportunities": ["Kans"],
  "sources": ["Bron"]
}`;

const PLANNER_PROMPT = `Je bent een strategisch planner voor VINO12, een Nederlandse online wijnwinkel.
Antwoord ALLEEN met valid JSON:
{
  "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
  "feasibility_score": 7,
  "estimated_effort": "XS|S|M|L|XL",
  "action_plan": {
    "steps": [{ "order": 1, "action": "", "owner": "", "timeline": "", "deliverable": "" }],
    "quick_wins": [],
    "dependencies": [],
    "success_metrics": []
  },
  "recommendation": ""
}`;

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: {
    id: string;
    raw_message: string;
    whatsapp_sender: string;
    status: string;
  };
}

function parseJSON<T>(text: string): T {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  model = "claude-haiku-4-5-20251001",
): Promise<string> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

async function callPerplexity(query: string): Promise<string> {
  const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!apiKey) throw new Error("PERPLEXITY_API_KEY not set");

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: RESEARCHER_PROMPT },
        { role: "user", content: query },
      ],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) throw new Error(`Perplexity error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function sendWhatsAppReply(
  sender: string,
  message: string,
): Promise<void> {
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  if (!accessToken || !phoneNumberId) return;

  await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: sender,
      type: "text",
      text: { body: message },
    }),
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type !== "INSERT" || payload.table !== "ideas") {
      return new Response("Ignored", { status: 200 });
    }

    const { id: ideaId, raw_message, whatsapp_sender } = payload.record;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Update status
    await supabase
      .from("ideas")
      .update({ status: "analyzing" })
      .eq("id", ideaId);

    // Step 1: Classify
    const classifyResponse = await callClaude(
      CLASSIFIER_PROMPT,
      `Classificeer dit idee:\n\n${raw_message}`,
    );
    const classifier = parseJSON<{
      title: string;
      summary: string;
      category: string;
      urgency: string;
      complexity: string;
    }>(classifyResponse);

    // Step 2: Research
    let research;
    try {
      const researchQuery = `Voor VINO12 (Nederlandse wijnwinkel): "${classifier.title}" - ${classifier.summary}. Categorie: ${classifier.category}.`;
      const researchResponse = await callPerplexity(researchQuery);
      research = parseJSON<{
        competitors: string[];
        trends: string[];
        best_practices: string[];
        risks: string[];
        opportunities: string[];
        sources: string[];
      }>(researchResponse);
    } catch {
      // Fallback to Claude
      const fallbackResponse = await callClaude(
        RESEARCHER_PROMPT,
        `Voor VINO12: "${classifier.title}" - ${classifier.summary}`,
      );
      research = parseJSON<{
        competitors: string[];
        trends: string[];
        best_practices: string[];
        risks: string[];
        opportunities: string[];
        sources: string[];
      }>(fallbackResponse);
    }

    // Step 3: Plan
    const planPrompt = `Idee: ${classifier.title}\nSamenvatting: ${classifier.summary}\nCategorie: ${classifier.category}\nComplexiteit: ${classifier.complexity}\n\nOnderzoek:\nConcurrenten: ${research.competitors.join("; ")}\nTrends: ${research.trends.join("; ")}\nRisico's: ${research.risks.join("; ")}`;
    const planResponse = await callClaude(
      PLANNER_PROMPT,
      planPrompt,
      "claude-sonnet-4-5-20250929",
    );
    const planner = parseJSON<{
      swot: Record<string, string[]>;
      feasibility_score: number;
      estimated_effort: string;
      action_plan: Record<string, unknown>;
      recommendation: string;
    }>(planResponse);

    // Store analysis
    await supabase.from("idea_analyses").insert({
      idea_id: ideaId,
      title: classifier.title,
      summary: classifier.summary,
      category: classifier.category,
      urgency: classifier.urgency,
      complexity: classifier.complexity,
      feasibility_score: planner.feasibility_score,
      swot: planner.swot,
      research_findings: research,
      action_plan: planner.action_plan,
      estimated_effort: planner.estimated_effort,
      ai_model: "claude-haiku+sonnet+perplexity",
    });

    // Update status
    await supabase
      .from("ideas")
      .update({ status: "analyzed" })
      .eq("id", ideaId);

    // Send WhatsApp reply
    const appUrl = Deno.env.get("NEXT_PUBLIC_APP_URL") ?? "https://vino12.com";

    await sendWhatsAppReply(
      whatsapp_sender,
      [
        `✅ *Idee geanalyseerd!*`,
        ``,
        `*${classifier.title}*`,
        `${classifier.urgency.toUpperCase()} | ${classifier.category}`,
        ``,
        classifier.summary,
        ``,
        `📋 Bekijk: ${appUrl}/admin/ideas/${ideaId}`,
      ].join("\n"),
    ).catch(() => {});

    return new Response(JSON.stringify({ success: true, idea_id: ideaId }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
