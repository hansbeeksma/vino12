"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BoardCard } from "./BoardCard";

interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  is_archived: boolean;
  position: number;
  created_at: string;
}

export function BoardGrid() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#722F37");
  const [creating, setCreating] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const loadBoards = useCallback(async () => {
    const { data } = await supabase
      .from("creative_boards")
      .select("*")
      .eq("is_archived", false)
      .order("position", { ascending: true });

    if (data) {
      setBoards(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(loadBoards, 0);

    const channel = supabase
      .channel("boards-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "creative_boards" },
        () => loadBoards(),
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [supabase, loadBoards]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("creative_boards").insert({
      title: newTitle.trim(),
      color: newColor,
      created_by: user.id,
      position: boards.length,
    });

    setNewTitle("");
    setNewColor("#722F37");
    setShowCreate(false);
    setCreating(false);
    loadBoards();
  };

  const COLORS = [
    "#722F37",
    "#2D5016",
    "#1E3A5F",
    "#D4AF37",
    "#4A1942",
    "#8B4513",
  ];

  if (loading) {
    return (
      <p className="font-accent text-sm uppercase tracking-widest text-ink/40 py-4">
        Laden...
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}

        {/* Create new board */}
        {showCreate ? (
          <div className="border-2 border-ink bg-offwhite p-4 space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setShowCreate(false);
              }}
              className="w-full border-2 border-ink bg-offwhite px-3 py-2 font-body text-sm focus:outline-hidden focus:ring-2 focus:ring-wine"
              placeholder="Board naam..."
              autoFocus
            />
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={`w-6 h-6 border-2 ${
                    newColor === color ? "border-ink" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Kleur ${color}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="font-accent text-[10px] uppercase tracking-widest text-champagne bg-wine border border-ink px-3 py-1.5 hover:bg-burgundy disabled:opacity-50"
              >
                {creating ? "..." : "Aanmaken"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="font-accent text-[10px] uppercase tracking-widest text-ink/50 border border-ink/20 px-3 py-1.5 hover:border-ink"
              >
                Annuleren
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed border-ink/20 p-4 flex items-center justify-center hover:border-ink transition-colors min-h-[120px]"
          >
            <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              + Nieuw board
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
