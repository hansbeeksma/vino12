"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { AnalysisView } from "@/components/ideas/AnalysisView";
import { ActionPlan } from "@/components/ideas/ActionPlan";

interface Idea {
  id: string;
  whatsapp_sender: string;
  sender_name: string | null;
  raw_message: string;
  message_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Analysis {
  id: string;
  title: string;
  summary: string | null;
  category: string | null;
  urgency: string | null;
  complexity: string | null;
  feasibility_score: number | null;
  estimated_effort: string | null;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  } | null;
  research_findings: {
    competitors: string[];
    trends: string[];
    best_practices: string[];
    risks: string[];
    opportunities: string[];
    sources: string[];
  } | null;
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
  } | null;
  ai_model: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  received: "ONTVANGEN",
  analyzing: "ANALYSEERT...",
  analyzed: "GEANALYSEERD",
  actioned: "ACTIE GENOMEN",
  archived: "GEARCHIVEERD",
};

export function IdeaDetail() {
  const params = useParams();
  const ideaId = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    loadIdea();

    const channel = supabase
      .channel(`idea-${ideaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ideas",
          filter: `id=eq.${ideaId}`,
        },
        () => {
          loadIdea();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "idea_analyses",
          filter: `idea_id=eq.${ideaId}`,
        },
        () => {
          loadIdea();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ideaId, supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadIdea() {
    const [ideaResult, analysisResult] = await Promise.all([
      supabase.from("ideas").select("*").eq("id", ideaId).single(),
      supabase
        .from("idea_analyses")
        .select("*")
        .eq("idea_id", ideaId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (ideaResult.data) setIdea(ideaResult.data as Idea);
    if (analysisResult.data) setAnalysis(analysisResult.data as Analysis);
    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    await supabase.from("ideas").update({ status: newStatus }).eq("id", ideaId);
    loadIdea();
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="font-accent text-sm uppercase tracking-widest text-gray-400">
          Laden...
        </p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-xl font-bold">Idee niet gevonden</p>
        <BrutalButton href="/admin/ideas" variant="outline" className="mt-4">
          Terug naar overzicht
        </BrutalButton>
      </div>
    );
  }

  const createdAt = new Date(idea.created_at).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl space-y-8">
      <Link
        href="/admin/ideas"
        className="font-accent text-xs uppercase tracking-widest text-gray-500 hover:text-ink"
      >
        &larr; Terug naar ideeën
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          {analysis?.title ?? "Idee wordt geanalyseerd..."}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <BrutalBadge variant="ink">
            {STATUS_LABELS[idea.status] ?? idea.status}
          </BrutalBadge>
          <span className="font-accent text-xs text-gray-500 uppercase tracking-wider">
            {idea.sender_name ?? "Onbekend"} &bull; {createdAt}
          </span>
        </div>
      </div>

      {/* Original message */}
      <BrutalCard hover={false} className="p-6">
        <h2 className="font-accent text-xs font-bold uppercase tracking-widest mb-3">
          Origineel Bericht
        </h2>
        <p className="font-body text-lg leading-relaxed whitespace-pre-wrap">
          {idea.raw_message}
        </p>
        <p className="font-accent text-xs text-gray-400 uppercase tracking-wider mt-3">
          {idea.message_type === "voice"
            ? "Via spraakbericht"
            : idea.message_type === "image"
              ? "Via afbeelding"
              : "Via tekst"}
        </p>
      </BrutalCard>

      {/* Analysis loading state */}
      {idea.status === "analyzing" && (
        <BrutalCard hover={false} className="p-6 text-center">
          <p className="font-display text-xl font-bold mb-2">
            AI analyseert je idee...
          </p>
          <p className="font-body text-gray-500">
            Dit duurt meestal 30-60 seconden. De pagina wordt automatisch
            bijgewerkt.
          </p>
        </BrutalCard>
      )}

      {analysis && <AnalysisView analysis={analysis} />}

      {analysis?.action_plan && (
        <ActionPlan
          plan={analysis.action_plan}
          recommendation={
            (analysis as unknown as { recommendation?: string }).recommendation
          }
        />
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t-4 border-ink">
        {idea.status === "analyzed" && (
          <BrutalButton
            onClick={() => updateStatus("actioned")}
            variant="primary"
          >
            Markeer als actie genomen
          </BrutalButton>
        )}
        {idea.status !== "archived" && (
          <BrutalButton
            onClick={() => updateStatus("archived")}
            variant="outline"
          >
            Archiveren
          </BrutalButton>
        )}
        {idea.status === "archived" && (
          <BrutalButton
            onClick={() => updateStatus("analyzed")}
            variant="outline"
          >
            Uit archief halen
          </BrutalButton>
        )}
      </div>
    </div>
  );
}
