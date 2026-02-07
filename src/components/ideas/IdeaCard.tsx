"use client";

import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalCard } from "@/components/ui/BrutalCard";

interface IdeaCardProps {
  idea: {
    id: string;
    raw_message: string;
    sender_name: string | null;
    message_type: string;
    status: string;
    created_at: string;
    idea_analyses?: {
      title: string;
      category: string;
      urgency: string;
      feasibility_score: number | null;
      estimated_effort: string | null;
    }[];
  };
}

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "wine" | "emerald" | "ink" | "champagne" }
> = {
  received: { label: "ONTVANGEN", variant: "champagne" },
  analyzing: { label: "ANALYSEERT...", variant: "ink" },
  analyzed: { label: "GEANALYSEERD", variant: "emerald" },
  actioned: { label: "ACTIE GENOMEN", variant: "wine" },
  archived: { label: "GEARCHIVEERD", variant: "ink" },
};

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-emerald text-champagne",
  medium: "bg-warning text-ink",
  high: "bg-wine-400 text-champagne",
  urgent: "bg-error text-offwhite",
};

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  marketing: "Marketing",
  operations: "Operations",
  tech: "Tech",
  content: "Content",
  design: "Design",
  other: "Overig",
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const analysis = idea.idea_analyses?.[0];
  const statusInfo = STATUS_LABELS[idea.status] ?? STATUS_LABELS.received;

  const createdAt = new Date(idea.created_at).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a href={`/admin/ideas/${idea.id}`}>
      <BrutalCard className="p-4 space-y-3">
        {/* Header: status + date */}
        <div className="flex items-center justify-between">
          <BrutalBadge variant={statusInfo.variant}>
            {statusInfo.label}
          </BrutalBadge>
          <span className="font-accent text-xs text-gray-500 uppercase tracking-wider">
            {createdAt}
          </span>
        </div>

        {/* Title or raw message */}
        <h3 className="font-display text-lg font-bold leading-tight">
          {analysis?.title ?? idea.raw_message.substring(0, 80)}
          {!analysis && idea.raw_message.length > 80 ? "..." : ""}
        </h3>

        {/* Sender info */}
        <p className="font-body text-sm text-gray-600">
          {idea.sender_name ?? "Onbekend"} via{" "}
          {idea.message_type === "voice"
            ? "spraakbericht"
            : idea.message_type === "image"
              ? "afbeelding"
              : "tekst"}
        </p>

        {/* Analysis metadata */}
        {analysis && (
          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.category && (
              <span className="inline-block px-2 py-0.5 border-2 border-ink text-xs font-accent uppercase tracking-wider">
                {CATEGORY_LABELS[analysis.category] ?? analysis.category}
              </span>
            )}
            {analysis.urgency && (
              <span
                className={`inline-block px-2 py-0.5 text-xs font-accent font-bold uppercase tracking-wider ${URGENCY_COLORS[analysis.urgency] ?? ""}`}
              >
                {analysis.urgency}
              </span>
            )}
            {analysis.feasibility_score != null && (
              <span className="inline-block px-2 py-0.5 border-2 border-ink text-xs font-accent uppercase tracking-wider">
                Score: {analysis.feasibility_score}/10
              </span>
            )}
            {analysis.estimated_effort && (
              <span className="inline-block px-2 py-0.5 border-2 border-ink text-xs font-accent uppercase tracking-wider">
                {analysis.estimated_effort}
              </span>
            )}
          </div>
        )}
      </BrutalCard>
    </a>
  );
}
