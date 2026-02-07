"use client";

import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ResearchData {
  competitors: string[];
  trends: string[];
  best_practices: string[];
  risks: string[];
  opportunities: string[];
  sources: string[];
}

interface AnalysisViewProps {
  analysis: {
    title: string;
    summary: string | null;
    category: string | null;
    urgency: string | null;
    complexity: string | null;
    feasibility_score: number | null;
    estimated_effort: string | null;
    swot: SwotData | null;
    research_findings: ResearchData | null;
    ai_model: string | null;
    created_at: string;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  marketing: "Marketing",
  operations: "Operations",
  tech: "Technologie",
  content: "Content",
  design: "Design",
  other: "Overig",
};

function SwotGrid({ swot }: { swot: SwotData }) {
  const quadrants = [
    {
      key: "strengths",
      label: "STERKTES",
      items: swot.strengths,
      color: "border-emerald",
    },
    {
      key: "weaknesses",
      label: "ZWAKTES",
      items: swot.weaknesses,
      color: "border-error",
    },
    {
      key: "opportunities",
      label: "KANSEN",
      items: swot.opportunities,
      color: "border-info",
    },
    {
      key: "threats",
      label: "BEDREIGINGEN",
      items: swot.threats,
      color: "border-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((q) => (
        <BrutalCard
          key={q.key}
          hover={false}
          borderColor={q.color}
          className="p-4"
        >
          <h4 className="font-accent text-xs font-bold uppercase tracking-widest mb-3">
            {q.label}
          </h4>
          <ul className="space-y-1">
            {q.items.map((item, i) => (
              <li key={i} className="font-body text-sm">
                &bull; {item}
              </li>
            ))}
          </ul>
        </BrutalCard>
      ))}
    </div>
  );
}

function ResearchSection({ research }: { research: ResearchData }) {
  const sections = [
    { label: "Concurrenten", items: research.competitors },
    { label: "Trends", items: research.trends },
    { label: "Best Practices", items: research.best_practices },
    { label: "Risico's", items: research.risks },
    { label: "Kansen", items: research.opportunities },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.label}>
          <h4 className="font-accent text-xs font-bold uppercase tracking-widest mb-2">
            {section.label}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item, i) => (
              <li key={i} className="font-body text-sm">
                &bull; {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {research.sources.length > 0 && (
        <div>
          <h4 className="font-accent text-xs font-bold uppercase tracking-widest mb-2">
            Bronnen
          </h4>
          <ul className="space-y-1">
            {research.sources.map((source, i) => (
              <li key={i} className="font-body text-xs text-gray-500">
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
  const analyzedAt = new Date(analysis.created_at).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Analyse</h2>
        {analysis.summary && (
          <p className="font-body text-lg leading-relaxed mb-4">
            {analysis.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {analysis.category && (
            <BrutalBadge variant="ink">
              {CATEGORY_LABELS[analysis.category] ?? analysis.category}
            </BrutalBadge>
          )}
          {analysis.urgency && (
            <BrutalBadge
              variant={
                analysis.urgency === "urgent" || analysis.urgency === "high"
                  ? "wine"
                  : "champagne"
              }
            >
              {analysis.urgency.toUpperCase()}
            </BrutalBadge>
          )}
          {analysis.complexity && (
            <BrutalBadge variant="champagne">
              {analysis.complexity.toUpperCase()}
            </BrutalBadge>
          )}
          {analysis.estimated_effort && (
            <BrutalBadge variant="emerald">
              EFFORT: {analysis.estimated_effort}
            </BrutalBadge>
          )}
          {analysis.feasibility_score != null && (
            <BrutalBadge
              variant={
                analysis.feasibility_score >= 7
                  ? "emerald"
                  : analysis.feasibility_score >= 4
                    ? "champagne"
                    : "wine"
              }
            >
              SCORE: {analysis.feasibility_score}/10
            </BrutalBadge>
          )}
        </div>
      </section>

      {/* SWOT */}
      {analysis.swot && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4">SWOT Analyse</h2>
          <SwotGrid swot={analysis.swot} />
        </section>
      )}

      {/* Research */}
      {analysis.research_findings && (
        <section>
          <BrutalCard hover={false} className="p-6">
            <h2 className="font-display text-2xl font-bold mb-4">
              Marktonderzoek
            </h2>
            <ResearchSection research={analysis.research_findings} />
          </BrutalCard>
        </section>
      )}

      {/* Meta */}
      <p className="font-accent text-xs text-gray-400 uppercase tracking-wider">
        Geanalyseerd op {analyzedAt} &bull; Model:{" "}
        {analysis.ai_model ?? "onbekend"}
      </p>
    </div>
  );
}
