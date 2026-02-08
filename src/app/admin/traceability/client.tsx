"use client";

import { useState } from "react";

interface Wine {
  id: string;
  name: string;
  slug: string;
}

const EVENT_TYPES = [
  { value: "harvest", label: "Oogst" },
  { value: "vinification", label: "Vinificatie" },
  { value: "bottling", label: "Botteling" },
  { value: "quality_check", label: "Kwaliteitscontrole" },
  { value: "import", label: "Import" },
  { value: "warehouse", label: "Opslag" },
  { value: "delivery", label: "Levering" },
];

const EVENT_LABELS: Record<string, string> = {
  harvest: "Oogst",
  vinification: "Vinificatie",
  bottling: "Botteling",
  quality_check: "Kwaliteitscontrole",
  import: "Import",
  warehouse: "Opslag",
  delivery: "Levering",
};

interface TraceabilityClientProps {
  wines: Wine[];
  recentEvents: Record<string, unknown>[];
}

export function TraceabilityClient({
  wines,
  recentEvents,
}: TraceabilityClientProps) {
  const [selectedWine, setSelectedWine] = useState("");
  const [eventType, setEventType] = useState("harvest");
  const [location, setLocation] = useState("");
  const [actor, setActor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedWine || !location || !actor) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/traceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wine_id: selectedWine,
          event_type: eventType,
          location,
          actor,
          data: {},
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setMessage({ type: "error", text: json.error ?? "Opslaan mislukt" });
        return;
      }

      setMessage({ type: "success", text: "Supply chain event toegevoegd" });
      setLocation("");
      setActor("");
    } catch {
      setMessage({ type: "error", text: "Netwerkfout" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add event form */}
      <div className="border-4 border-ink p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Nieuw Supply Chain Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
              Wijn
            </label>
            <select
              value={selectedWine}
              onChange={(e) => setSelectedWine(e.target.value)}
              className="w-full border-2 border-ink p-2 font-body text-sm bg-offwhite"
              required
            >
              <option value="">Selecteer wijn...</option>
              {wines.map((wine) => (
                <option key={wine.id} value={wine.id}>
                  {wine.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full border-2 border-ink p-2 font-body text-sm bg-offwhite"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
              Locatie
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="bijv. Bordeaux, France"
              className="w-full border-2 border-ink p-2 font-body text-sm bg-offwhite"
              required
            />
          </div>

          <div>
            <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
              Actor
            </label>
            <input
              type="text"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              placeholder="bijv. Château Margaux"
              className="w-full border-2 border-ink p-2 font-body text-sm bg-offwhite"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-offwhite font-accent text-xs uppercase tracking-widest py-3 border-2 border-ink hover:bg-wine transition-colors disabled:opacity-50"
          >
            {submitting ? "Opslaan..." : "Event Toevoegen"}
          </button>

          {message && (
            <p
              className={`font-body text-sm ${
                message.type === "success" ? "text-green-600" : "text-wine"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>

      {/* Recent events */}
      <div className="border-4 border-ink p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Recente Events
        </h2>

        {recentEvents.length === 0 ? (
          <p className="font-body text-sm text-ink/40">
            Nog geen supply chain events
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentEvents.map((event) => {
              const e = event as {
                id: string;
                event_type: string;
                location: string;
                actor: string;
                created_at: string;
                wine: { name: string } | null;
              };
              return (
                <div key={e.id} className="border-2 border-ink/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-accent text-[10px] uppercase tracking-widest text-wine">
                      {EVENT_LABELS[e.event_type] ?? e.event_type}
                    </span>
                    <span className="font-body text-xs text-ink/40">
                      {new Date(e.created_at).toLocaleDateString("nl-NL")}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink mt-1">
                    {e.wine?.name ?? "Onbekend"}
                  </p>
                  <p className="font-body text-xs text-ink/50">
                    {e.location} · {e.actor}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
