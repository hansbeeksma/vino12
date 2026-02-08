"use client";

import { useState } from "react";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(title.trim(), content.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-ink bg-offwhite p-4 space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-2 border-ink bg-offwhite px-3 py-2 font-display text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-wine"
        placeholder="Titel (optioneel)"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full border-2 border-ink bg-offwhite px-3 py-2 font-body text-sm focus:outline-hidden focus:ring-2 focus:ring-wine resize-y"
        placeholder="Schrijf je notitie..."
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!content.trim()}
          className="font-accent text-[10px] uppercase tracking-widest text-champagne bg-wine border border-ink px-3 py-1.5 hover:bg-burgundy disabled:opacity-50"
        >
          Opslaan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 border border-ink/20 px-3 py-1.5 hover:border-ink"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
