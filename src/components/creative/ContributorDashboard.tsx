"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface IdeaSummary {
  id: string;
  raw_message: string;
  status: string;
  source: string | null;
  created_at: string;
  idea_analyses: {
    title: string;
    category: string;
  }[];
}

export function ContributorDashboard({ userId }: { userId: string }) {
  const [ideas, setIdeas] = useState<IdeaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const loadIdeas = useCallback(async () => {
    const { data } = await supabase
      .from("ideas")
      .select(
        "id, raw_message, status, source, created_at, idea_analyses(title, category)",
      )
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setIdeas(data as IdeaSummary[]);
    }
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    const timer = setTimeout(loadIdeas, 0);
    return () => clearTimeout(timer);
  }, [loadIdeas]);

  const statusCounts = ideas.reduce(
    (acc, idea) => {
      acc[idea.status] = (acc[idea.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = [
    { label: "Totaal ideeën", value: ideas.length.toString() },
    { label: "Geanalyseerd", value: (statusCounts.analyzed ?? 0).toString() },
    { label: "In analyse", value: (statusCounts.analyzing ?? 0).toString() },
    { label: "Nieuw", value: (statusCounts.received ?? 0).toString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-display-sm text-ink">
          CREATIEF DASHBOARD
        </h1>
        <Link
          href="/admin/creative/nieuw-idee"
          className="font-accent font-bold uppercase tracking-wider text-xs border-2 border-ink bg-wine text-champagne px-4 py-2.5 hover:bg-burgundy brutal-shadow brutal-hover"
        >
          + Nieuw idee
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="border-2 border-ink bg-offwhite p-4">
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-1">
              {stat.label}
            </p>
            <p className="font-display text-2xl font-bold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-ink">
          Recente ideeën
        </h2>
        <Link
          href="/admin/ideas"
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine"
        >
          Bekijk alle →
        </Link>
      </div>

      <div className="border-2 border-ink bg-offwhite p-6">
        {loading ? (
          <p className="font-accent text-sm uppercase tracking-widest text-ink/40">
            Laden...
          </p>
        ) : ideas.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-display text-xl font-bold text-ink/40 mb-2">
              Nog geen ideeën
            </p>
            <p className="font-body text-sm text-ink/40 mb-4">
              Begin met het delen van je creatieve ideeën
            </p>
            <Link
              href="/admin/creative/nieuw-idee"
              className="font-accent text-xs uppercase tracking-widest text-wine hover:text-burgundy"
            >
              Maak je eerste idee →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ideas.map((idea) => {
              const analysis = idea.idea_analyses?.[0];
              return (
                <div
                  key={idea.id}
                  className="flex items-center justify-between border-b border-ink/10 pb-3 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold text-ink truncate">
                      {analysis?.title ?? idea.raw_message.slice(0, 60)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {analysis?.category && (
                        <span className="font-accent text-[9px] uppercase tracking-widest text-ink/40">
                          {analysis.category}
                        </span>
                      )}
                      <span className="font-accent text-[9px] uppercase tracking-widest text-ink/40">
                        {idea.source ?? "whatsapp"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                      className={`font-accent text-[9px] uppercase tracking-widest px-2 py-1 border ${
                        idea.status === "analyzed"
                          ? "border-emerald text-emerald"
                          : idea.status === "analyzing"
                            ? "border-gold text-gold-700"
                            : "border-ink/20 text-ink/40"
                      }`}
                    >
                      {idea.status}
                    </span>
                    <span className="font-body text-xs text-ink/30">
                      {new Date(idea.created_at).toLocaleDateString("nl-NL")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/creative"
          className="border-2 border-ink bg-offwhite p-6 hover:bg-champagne transition-colors group"
        >
          <h3 className="font-display text-lg font-bold text-ink mb-1">
            Creatief Werkruimte
          </h3>
          <p className="font-body text-sm text-ink/50">
            Boards, notities en ideeën organiseren
          </p>
          <span className="font-accent text-[10px] uppercase tracking-widest text-wine mt-3 block group-hover:translate-x-1 transition-transform">
            Open werkruimte →
          </span>
        </Link>
        <Link
          href="/admin/creative/nieuw-idee"
          className="border-2 border-ink bg-offwhite p-6 hover:bg-champagne transition-colors group"
        >
          <h3 className="font-display text-lg font-bold text-ink mb-1">
            Nieuw Idee Delen
          </h3>
          <p className="font-body text-sm text-ink/50">
            Typ of dicteer een nieuw idee met voice-to-text
          </p>
          <span className="font-accent text-[10px] uppercase tracking-widest text-wine mt-3 block group-hover:translate-x-1 transition-transform">
            Start dicteren →
          </span>
        </Link>
      </div>
    </div>
  );
}
