"use client";

import { useState } from "react";

interface DeleteWineButtonProps {
  id: string;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteWineButton({ id, onDelete }: DeleteWineButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-accent text-xs uppercase tracking-widest text-wine hover:text-wine/70"
      >
        Wijn verwijderen
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-body text-sm text-wine">Weet je het zeker?</span>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="font-accent text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-wine bg-wine text-offwhite hover:bg-wine/80"
      >
        Ja, verwijder
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="font-accent text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
      >
        Annuleren
      </button>
    </div>
  );
}
