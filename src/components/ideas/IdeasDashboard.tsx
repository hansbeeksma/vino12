"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { IdeaCard } from "@/components/ideas/IdeaCard";

type IdeaWithAnalysis = {
  id: string;
  raw_message: string;
  sender_name: string | null;
  message_type: string;
  status: string;
  created_at: string;
  idea_analyses: {
    title: string;
    category: string;
    urgency: string;
    feasibility_score: number | null;
    estimated_effort: string | null;
  }[];
};

type StatusFilter =
  | "all"
  | "received"
  | "analyzing"
  | "analyzed"
  | "actioned"
  | "archived";
type CategoryFilter =
  | "all"
  | "product"
  | "marketing"
  | "operations"
  | "tech"
  | "content"
  | "design"
  | "other";

export function IdeasDashboard() {
  const [ideas, setIdeas] = useState<IdeaWithAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    loadIdeas();

    const channel = supabase
      .channel("ideas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas" },
        () => {
          loadIdeas();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "idea_analyses" },
        () => {
          loadIdeas();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadIdeas() {
    const { data } = await supabase
      .from("ideas")
      .select(
        "id, raw_message, sender_name, message_type, status, created_at, idea_analyses(title, category, urgency, feasibility_score, estimated_effort)",
      )
      .order("created_at", { ascending: false });

    if (data) {
      setIdeas(data as IdeaWithAnalysis[]);
    }
    setLoading(false);
  }

  const filtered = ideas.filter((idea) => {
    if (statusFilter !== "all" && idea.status !== statusFilter) return false;
    if (categoryFilter !== "all") {
      const cat = idea.idea_analyses?.[0]?.category;
      if (cat !== categoryFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const title = idea.idea_analyses?.[0]?.title?.toLowerCase() ?? "";
      const msg = idea.raw_message.toLowerCase();
      if (!title.includes(q) && !msg.includes(q)) return false;
    }
    return true;
  });

  const statusCounts = ideas.reduce(
    (acc, idea) => {
      acc[idea.status] = (acc[idea.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Ideeën Inbox</h1>
          <p className="font-body text-gray-500 mt-1">
            {ideas.length} ideeën &bull; {statusCounts.analyzed ?? 0}{" "}
            geanalyseerd
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Zoek ideeën..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border-2 border-ink font-body text-sm flex-1 min-w-[200px] bg-offwhite focus:outline-hidden focus:ring-2 focus:ring-wine"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 border-2 border-ink font-accent text-xs uppercase tracking-wider bg-offwhite cursor-pointer"
        >
          <option value="all">Alle statussen</option>
          <option value="received">Ontvangen</option>
          <option value="analyzing">Analyseert</option>
          <option value="analyzed">Geanalyseerd</option>
          <option value="actioned">Actie genomen</option>
          <option value="archived">Gearchiveerd</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="px-3 py-2 border-2 border-ink font-accent text-xs uppercase tracking-wider bg-offwhite cursor-pointer"
        >
          <option value="all">Alle categorieën</option>
          <option value="product">Product</option>
          <option value="marketing">Marketing</option>
          <option value="operations">Operations</option>
          <option value="tech">Tech</option>
          <option value="content">Content</option>
          <option value="design">Design</option>
          <option value="other">Overig</option>
        </select>
      </div>

      {/* Ideas grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="font-accent text-sm uppercase tracking-widest text-gray-400">
            Laden...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300">
          <p className="font-display text-xl font-bold text-gray-400 mb-2">
            Geen ideeën gevonden
          </p>
          <p className="font-body text-sm text-gray-400">
            Stuur een bericht via WhatsApp om te beginnen
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
