import {
  CLASSIFIER_SYSTEM_PROMPT,
  RESEARCHER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
} from "./prompts";
import { callClaude, parseJSON } from "./claude";

interface ClassifierResult {
  title: string;
  summary: string;
  category: string;
  urgency: string;
  complexity: string;
}

interface ResearchResult {
  competitors: string[];
  trends: string[];
  best_practices: string[];
  risks: string[];
  opportunities: string[];
  sources: string[];
}

interface PlannerResult {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  feasibility_score: number;
  estimated_effort: string;
  action_plan: {
    steps: {
      order: number;
      action: string;
      owner: string;
      timeline: string;
      deliverable: string;
    }[];
    quick_wins: string[];
    dependencies: string[];
    success_metrics: string[];
  };
  recommendation: string;
}

export interface AnalysisResult {
  classifier: ClassifierResult;
  research: ResearchResult;
  planner: PlannerResult;
}

async function callPerplexity(query: string): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY not configured");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: RESEARCHER_SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function classifyIdea(
  rawMessage: string,
): Promise<ClassifierResult> {
  const response = await callClaude(
    CLASSIFIER_SYSTEM_PROMPT,
    `Classificeer dit idee:\n\n${rawMessage}`,
  );
  return parseJSON<ClassifierResult>(response);
}

export async function researchIdea(
  title: string,
  summary: string,
  category: string,
): Promise<ResearchResult> {
  const query = `Voor een Nederlandse online wijnwinkel (VINO12): "${title}" - ${summary}. Categorie: ${category}. Onderzoek de haalbaarheid, concurrentie en marktcontext in Nederland/Europa.`;

  try {
    const response = await callPerplexity(query);
    return parseJSON<ResearchResult>(response);
  } catch {
    // Fallback: use Claude if Perplexity fails
    const response = await callClaude(
      RESEARCHER_SYSTEM_PROMPT,
      query,
      "claude-haiku-4-5-20251001",
    );
    return parseJSON<ResearchResult>(response);
  }
}

export async function planIdea(
  classifier: ClassifierResult,
  research: ResearchResult,
): Promise<PlannerResult> {
  const prompt = `Maak een actieplan voor dit idee:

IDEE:
Titel: ${classifier.title}
Samenvatting: ${classifier.summary}
Categorie: ${classifier.category}
Urgentie: ${classifier.urgency}
Complexiteit: ${classifier.complexity}

MARKTONDERZOEK:
Concurrenten: ${research.competitors.join("; ")}
Trends: ${research.trends.join("; ")}
Best practices: ${research.best_practices.join("; ")}
Risico's: ${research.risks.join("; ")}
Kansen: ${research.opportunities.join("; ")}`;

  const response = await callClaude(
    PLANNER_SYSTEM_PROMPT,
    prompt,
    "claude-sonnet-4-5-20250929",
  );
  return parseJSON<PlannerResult>(response);
}

export async function analyzeIdea(rawMessage: string): Promise<AnalysisResult> {
  // Step 1: Classify
  const classifier = await classifyIdea(rawMessage);

  // Step 2: Research (uses classifier output)
  const research = await researchIdea(
    classifier.title,
    classifier.summary,
    classifier.category,
  );

  // Step 3: Plan (uses both previous outputs)
  const planner = await planIdea(classifier, research);

  return { classifier, research, planner };
}
