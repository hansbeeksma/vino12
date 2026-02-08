"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";

interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
}

interface BoardIdea {
  idea_id: string;
  position: number;
  ideas: {
    id: string;
    raw_message: string;
    status: string;
    created_at: string;
    idea_analyses: {
      title: string;
      category: string;
    }[];
  };
}

interface Note {
  id: string;
  title: string | null;
  content: string;
  note_type: string;
  created_at: string;
  updated_at: string;
}

export function BoardDetail({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [boardIdeas, setBoardIdeas] = useState<BoardIdea[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [availableIdeas, setAvailableIdeas] = useState<
    { id: string; title: string; raw_message: string }[]
  >([]);

  const supabase = useMemo(() => createClient(), []);

  const loadBoard = useCallback(async () => {
    const [boardRes, ideasRes, notesRes] = await Promise.all([
      supabase.from("creative_boards").select("*").eq("id", boardId).single(),
      supabase
        .from("board_ideas")
        .select(
          "idea_id, position, ideas(id, raw_message, status, created_at, idea_analyses(title, category))",
        )
        .eq("board_id", boardId)
        .order("position", { ascending: true }),
      supabase
        .from("creative_notes")
        .select("*")
        .eq("board_id", boardId)
        .order("created_at", { ascending: false }),
    ]);

    if (boardRes.data) setBoard(boardRes.data);
    if (ideasRes.data) setBoardIdeas(ideasRes.data as unknown as BoardIdea[]);
    if (notesRes.data) setNotes(notesRes.data);
    setLoading(false);
  }, [supabase, boardId]);

  useEffect(() => {
    const timer = setTimeout(loadBoard, 0);

    const channel = supabase
      .channel(`board-${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "creative_notes",
          filter: `board_id=eq.${boardId}`,
        },
        () => loadBoard(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "board_ideas",
          filter: `board_id=eq.${boardId}`,
        },
        () => loadBoard(),
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [supabase, boardId, loadBoard]);

  const loadAvailableIdeas = async () => {
    const { data } = await supabase
      .from("ideas")
      .select("id, raw_message, idea_analyses(title)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      const mapped = data.map((idea) => ({
        id: idea.id,
        raw_message: idea.raw_message,
        title:
          (idea.idea_analyses as unknown as { title: string }[])?.[0]?.title ??
          idea.raw_message.slice(0, 60),
      }));
      setAvailableIdeas(mapped);
    }
    setShowAddIdea(true);
  };

  const handleAddIdea = async (ideaId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("board_ideas").insert({
      board_id: boardId,
      idea_id: ideaId,
      position: boardIdeas.length,
    });

    setShowAddIdea(false);
    loadBoard();
  };

  const handleRemoveIdea = async (ideaId: string) => {
    await supabase
      .from("board_ideas")
      .delete()
      .eq("board_id", boardId)
      .eq("idea_id", ideaId);

    loadBoard();
  };

  const handleSaveNote = async (title: string, content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("creative_notes").insert({
      board_id: boardId,
      title: title || null,
      content,
      created_by: user.id,
    });

    setShowAddNote(false);
    loadBoard();
  };

  const handleDeleteNote = async (noteId: string) => {
    await supabase.from("creative_notes").delete().eq("id", noteId);
    loadBoard();
  };

  if (loading) {
    return (
      <p className="font-accent text-sm uppercase tracking-widest text-ink/40 py-4">
        Laden...
      </p>
    );
  }

  if (!board) {
    return (
      <div className="border-2 border-ink/20 p-8 text-center">
        <p className="font-display text-xl font-bold text-ink/40">
          Board niet gevonden
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-4 w-4" style={{ backgroundColor: board.color }} />
        <h1 className="font-display text-display-sm text-ink">{board.title}</h1>
      </div>

      {board.description && (
        <p className="font-body text-sm text-ink/50 mb-6">
          {board.description}
        </p>
      )}

      {/* Ideas section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-ink">Ideeën</h2>
          <button
            onClick={loadAvailableIdeas}
            className="font-accent text-[10px] uppercase tracking-widest text-wine hover:text-burgundy border border-wine px-3 py-1.5"
          >
            + Idee toevoegen
          </button>
        </div>

        {showAddIdea && (
          <div className="border-2 border-ink bg-champagne p-4 mb-4 max-h-60 overflow-y-auto">
            {availableIdeas.length === 0 ? (
              <p className="font-body text-sm text-ink/50">
                Geen ideeën beschikbaar
              </p>
            ) : (
              <div className="space-y-2">
                {availableIdeas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => handleAddIdea(idea.id)}
                    className="w-full text-left border border-ink/20 p-2 hover:border-ink hover:bg-offwhite transition-colors"
                  >
                    <p className="font-body text-sm text-ink truncate">
                      {idea.title}
                    </p>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowAddIdea(false)}
              className="font-accent text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink mt-3"
            >
              Sluiten
            </button>
          </div>
        )}

        {boardIdeas.length === 0 ? (
          <div className="border-2 border-dashed border-ink/20 p-6 text-center">
            <p className="font-body text-sm text-ink/40">
              Nog geen ideeën op dit board
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {boardIdeas.map((bi) => {
              const idea = bi.ideas;
              const analysis = idea.idea_analyses?.[0];
              return (
                <div
                  key={bi.idea_id}
                  className="border-2 border-ink bg-offwhite p-3 flex items-center justify-between"
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
                      <span
                        className={`font-accent text-[9px] uppercase tracking-widest ${
                          idea.status === "analyzed"
                            ? "text-emerald"
                            : "text-ink/40"
                        }`}
                      >
                        {idea.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveIdea(bi.idea_id)}
                    className="font-accent text-[10px] text-ink/30 hover:text-wine ml-3 shrink-0"
                    aria-label="Verwijder van board"
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-ink">Notities</h2>
          <button
            onClick={() => setShowAddNote(true)}
            className="font-accent text-[10px] uppercase tracking-widest text-wine hover:text-burgundy border border-wine px-3 py-1.5"
          >
            + Notitie
          </button>
        </div>

        {showAddNote && (
          <div className="mb-4">
            <NoteEditor
              onSave={handleSaveNote}
              onCancel={() => setShowAddNote(false)}
            />
          </div>
        )}

        {notes.length === 0 && !showAddNote ? (
          <div className="border-2 border-dashed border-ink/20 p-6 text-center">
            <p className="font-body text-sm text-ink/40">
              Nog geen notities op dit board
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
