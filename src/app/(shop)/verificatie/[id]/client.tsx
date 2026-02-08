"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WinePassport, SupplyChainEvent } from "@/lib/traceability/types";

const EVENT_LABELS: Record<string, string> = {
  harvest: "Oogst",
  vinification: "Vinificatie",
  bottling: "Botteling",
  quality_check: "Kwaliteitscontrole",
  import: "Import",
  warehouse: "Opslag",
  delivery: "Levering",
};

const EVENT_ICONS: Record<string, string> = {
  harvest: "🍇",
  vinification: "🍷",
  bottling: "🍾",
  quality_check: "✅",
  import: "🚢",
  warehouse: "📦",
  delivery: "🚚",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventCard({ event }: { event: SupplyChainEvent }) {
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div className="absolute left-0 top-1 w-6 h-6 flex items-center justify-center text-sm">
        {EVENT_ICONS[event.event_type] ?? "📋"}
      </div>
      <div className="absolute left-3 top-8 bottom-0 w-px bg-ink/10 last:hidden" />

      <div className="border-2 border-ink/10 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-accent text-[10px] uppercase tracking-widest text-wine">
            {EVENT_LABELS[event.event_type] ?? event.event_type}
          </span>
          <span className="font-body text-xs text-ink/40">
            {formatDate(event.timestamp)}
          </span>
        </div>
        <p className="font-body text-sm text-ink mt-1">{event.location}</p>
        <p className="font-body text-xs text-ink/50 mt-1">{event.actor}</p>
        {Object.keys(event.data).length > 0 && (
          <div className="mt-2 font-body text-xs text-ink/40">
            {Object.entries(event.data).map(([key, value]) => (
              <span key={key} className="mr-3">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function VerificationClient({ wineId }: { wineId: string }) {
  const [passport, setPassport] = useState<WinePassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/traceability/${wineId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.error ?? "Wijn niet gevonden");
          return;
        }

        setPassport(json.data);
      } catch {
        setError("Kon verificatiedata niet laden");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [wineId]);

  if (loading) {
    return (
      <div className="border-4 border-ink p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-ink/10 rounded w-48 mx-auto mb-4" />
          <div className="h-3 bg-ink/10 rounded w-32 mx-auto" />
        </div>
        <p className="font-accent text-xs uppercase tracking-widest text-ink/40 mt-4">
          Verificatie laden...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-4 border-wine p-8 text-center">
        <p className="font-display text-xl font-bold text-wine">
          Verificatie mislukt
        </p>
        <p className="font-body text-sm text-ink/60 mt-2">{error}</p>
      </div>
    );
  }

  if (!passport) return null;

  return (
    <div className="space-y-6">
      {/* Verification status */}
      <div
        className={`border-4 p-6 text-center ${
          passport.chain_valid
            ? "border-green-600 bg-green-50"
            : "border-wine bg-red-50"
        }`}
      >
        <p className="font-display text-2xl font-bold">
          {passport.chain_valid ? "✓ Geverifieerd" : "✗ Verificatie mislukt"}
        </p>
        <p className="font-body text-sm text-ink/60 mt-1">
          {passport.chain_valid
            ? "De supply chain van deze wijn is intact en authentiek"
            : "Er zijn inconsistenties gevonden in de supply chain"}
        </p>
      </div>

      {/* Wine info */}
      <div className="border-4 border-ink p-6">
        <span className="font-accent text-[10px] uppercase tracking-widest text-wine">
          {passport.region}
          {passport.vintage ? ` · ${passport.vintage}` : ""}
        </span>
        <h2 className="font-display text-2xl font-bold text-ink mt-1">
          {passport.wine_name}
        </h2>
        <p className="font-body text-sm text-ink/60 mt-1">
          Producent: {passport.producer}
        </p>
        <Link
          href={`/wijn/${passport.wine_slug}`}
          className="inline-block mt-3 font-accent text-xs uppercase tracking-widest text-wine underline"
        >
          Bekijk in winkel →
        </Link>
      </div>

      {/* Supply chain timeline */}
      <div className="border-4 border-ink p-6">
        <h3 className="font-display text-lg font-bold text-ink mb-4">
          Supply Chain Journey
        </h3>
        {passport.events.length === 0 ? (
          <p className="font-body text-sm text-ink/40">
            Nog geen supply chain events geregistreerd
          </p>
        ) : (
          <div>
            {passport.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Technical details */}
      <details className="border-2 border-ink/10 p-4">
        <summary className="font-accent text-xs uppercase tracking-widest text-ink/40 cursor-pointer">
          Technische details
        </summary>
        <div className="mt-3 font-mono text-xs text-ink/40 space-y-1">
          <p>Wine ID: {passport.wine_id}</p>
          <p>Events: {passport.events.length}</p>
          <p>Chain valid: {passport.chain_valid ? "true" : "false"}</p>
          <p>Verificatie: {passport.generated_at}</p>
          {passport.events.length > 0 && (
            <p>
              Laatste hash:{" "}
              {passport.events[passport.events.length - 1].hash.slice(0, 16)}...
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
