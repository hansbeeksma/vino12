"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { QuickIdeaInput } from "@/components/creative/QuickIdeaInput";
import { BoardGrid } from "@/components/creative/BoardGrid";

interface RecentIdea {
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

export default function CreativeOverview() {
  const [ideas, setIdeas] = useState<RecentIdea[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const loadIdeas = useCallback(async () => {
    const { data } = await supabase
      .from("ideas")
      .select(
        "id, raw_message, status, source, created_at, idea_analyses(title, category)",
      )
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) {
      setIdeas(data as RecentIdea[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(loadIdeas, 0);

    const channel = supabase
      .channel("creative-ideas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas" },
        () => loadIdeas(),
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [supabase, loadIdeas]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-display-sm text-ink">
          CREATIEF WERKRUIMTE
        </h1>
        <Link
          href="/admin/creative/nieuw-idee"
          className="font-accent font-bold uppercase tracking-wider text-xs border-2 border-ink bg-wine text-champagne px-4 py-2.5 hover:bg-burgundy brutal-shadow brutal-hover"
        >
          + Nieuw idee
        </Link>
      </div>

      {/* Quick idea input */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-bold text-ink mb-3">
          Snel idee delen
        </h2>
        <QuickIdeaInput onSuccess={loadIdeas} />
      </div>

      {/* Boards */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-bold text-ink mb-3">Boards</h2>
        <BoardGrid />
      </div>

      {/* Recent ideas */}
      <div>
        <div className="flex items-center justify-between mb-3">
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

        {loading ? (
          <p className="font-accent text-sm uppercase tracking-widest text-ink/40 py-4">
            Laden...
          </p>
        ) : ideas.length === 0 ? (
          <div className="border-2 border-dashed border-ink/20 p-8 text-center">
            <p className="font-display text-xl font-bold text-ink/40 mb-2">
              Nog geen ideeën
            </p>
            <p className="font-body text-sm text-ink/40">
              Gebruik het invoerveld hierboven of dicteer een idee
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ideas.map((idea) => {
              const analysis = idea.idea_analyses?.[0];
              return (
                <div
                  key={idea.id}
                  className="border-2 border-ink bg-offwhite p-4"
                >
                  <p className="font-display text-sm font-bold text-ink mb-1 truncate">
                    {analysis?.title ?? idea.raw_message.slice(0, 60)}
                  </p>
                  <p className="font-body text-xs text-ink/50 mb-2 line-clamp-2">
                    {idea.raw_message.slice(0, 120)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {analysis?.category && (
                        <span className="font-accent text-[9px] uppercase tracking-widest text-ink/40 border border-ink/20 px-1.5 py-0.5">
                          {analysis.category}
                        </span>
                      )}
                      <span className="font-accent text-[9px] uppercase tracking-widest text-ink/40">
                        {idea.source ?? "whatsapp"}
                      </span>
                    </div>
                    <span
                      className={`font-accent text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${
                        idea.status === "analyzed"
                          ? "border-emerald text-emerald"
                          : idea.status === "analyzing"
                            ? "border-gold text-gold-700"
                            : "border-ink/20 text-ink/40"
                      }`}
                    >
                      {idea.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
