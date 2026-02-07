"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function GdprActions() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      setError(null);

      const res = await fetch("/api/gdpr/delete", { method: "POST" });

      if (!res.ok) {
        setError("Er ging iets mis. Probeer het opnieuw.");
        return;
      }

      router.push("/");
    });
  }

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="font-display text-sm font-bold uppercase tracking-wider border-2 border-wine text-wine px-6 py-3 hover:bg-wine hover:text-offwhite transition-colors"
      >
        Account verwijderen
      </button>
    );
  }

  return (
    <div className="border-2 border-wine p-4 space-y-3">
      <p className="font-body text-sm font-bold text-wine">
        Weet je het zeker? Dit kan niet ongedaan worden gemaakt.
      </p>

      {error && <p className="font-body text-sm text-wine">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="font-display text-sm font-bold uppercase tracking-wider border-2 border-wine bg-wine text-offwhite px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {pending ? "Verwijderen..." : "Ja, verwijder alles"}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          disabled={pending}
          className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink px-4 py-2 hover:bg-ink hover:text-offwhite transition-colors"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
