"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscriptionActionsProps {
  status: "active" | "paused" | "cancelled";
}

export function SubscriptionActions({ status }: SubscriptionActionsProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const router = useRouter();

  async function handleAction(action: "pause" | "resume" | "cancel") {
    setError(null);
    const res = await fetch("/api/wine-club", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis.");
      return;
    }

    setShowCancel(false);
    router.refresh();
  }

  if (showCancel) {
    return (
      <div className="border-2 border-wine p-4 space-y-3">
        <p className="font-body text-sm font-bold text-wine">
          Weet je het zeker? Je verliest toegang tot je wijnclub voordelen.
        </p>
        {error && <p className="font-body text-sm text-wine">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => startTransition(() => handleAction("cancel"))}
            disabled={pending}
            className="font-display text-sm font-bold uppercase tracking-wider border-2 border-wine bg-wine text-offwhite px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {pending ? "Opzeggen..." : "Ja, opzeggen"}
          </button>
          <button
            type="button"
            onClick={() => setShowCancel(false)}
            disabled={pending}
            className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink px-4 py-2 hover:bg-ink hover:text-offwhite transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="border-2 border-wine bg-wine/10 p-3">
          <p className="font-body text-sm text-wine">{error}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {status === "active" && (
          <button
            type="button"
            onClick={() => startTransition(() => handleAction("pause"))}
            disabled={pending}
            className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink px-6 py-3 hover:bg-ink hover:text-offwhite transition-colors disabled:opacity-50"
          >
            {pending ? "Pauzeren..." : "Pauzeren"}
          </button>
        )}
        {status === "paused" && (
          <button
            type="button"
            onClick={() => startTransition(() => handleAction("resume"))}
            disabled={pending}
            className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors disabled:opacity-50"
          >
            {pending ? "Hervatten..." : "Hervatten"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowCancel(true)}
          className="font-display text-sm font-bold uppercase tracking-wider border-2 border-wine text-wine px-6 py-3 hover:bg-wine hover:text-offwhite transition-colors"
        >
          Opzeggen
        </button>
      </div>
    </div>
  );
}
