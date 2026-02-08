"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "./VoiceRecorder";

export function IdeaInputForm() {
  const [message, setMessage] = useState("");
  const [source, setSource] = useState<"web" | "voice">("web");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleVoiceTranscript = (text: string) => {
    setMessage((prev) => {
      const separator = prev && !prev.endsWith(" ") ? " " : "";
      return prev + separator + text;
    });
    setSource("voice");
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 3) {
      setError("Idee moet minimaal 3 tekens bevatten");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ideas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          source,
          tags: tags.length > 0 ? tags : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Er is iets misgegaan");
      }

      setSuccess(true);
      setMessage("");
      setTags([]);
      setSource("web");

      setTimeout(() => {
        router.push("/admin/creative");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="border-2 border-emerald bg-offwhite p-8 text-center">
        <p className="font-display text-2xl font-bold text-emerald mb-2">
          Idee ontvangen!
        </p>
        <p className="font-body text-sm text-ink/50">
          Je idee wordt nu geanalyseerd door AI. Je wordt doorgestuurd...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Voice recorder */}
      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-2 block">
          Dicteren
        </label>
        <VoiceRecorder onTranscript={handleVoiceTranscript} />
      </div>

      {/* Text input */}
      <div>
        <label
          htmlFor="idea-message"
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-2 block"
        >
          Je idee
        </label>
        <textarea
          id="idea-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full border-2 border-ink bg-offwhite p-4 font-body text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-wine resize-y"
          placeholder="Beschrijf je idee hier... Of gebruik de microfoon om te dicteren."
        />
        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/30 mt-1">
          {message.length}/5000 tekens
          {source === "voice" && " (gedicteerd)"}
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/50 mb-2 block">
          Tags (optioneel)
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 border-2 border-ink bg-offwhite px-3 py-2 font-body text-sm focus:outline-hidden focus:ring-2 focus:ring-wine"
            placeholder="Voeg tag toe..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="font-accent text-[10px] uppercase tracking-widest text-ink border-2 border-ink px-3 py-2 hover:bg-champagne"
          >
            +
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-accent text-[10px] uppercase tracking-widest text-ink/60 border border-ink/30 px-2 py-1 flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-ink/30 hover:text-wine"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="border-2 border-wine bg-wine/5 p-3">
          <p className="font-body text-sm text-wine">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="font-accent font-bold uppercase tracking-wider text-sm border-2 border-ink bg-wine text-champagne px-6 py-3 hover:bg-burgundy brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Versturen..." : "Idee delen"}
      </button>
    </form>
  );
}
