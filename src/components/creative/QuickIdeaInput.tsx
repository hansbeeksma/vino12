"use client";

import { useState, useRef } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface QuickIdeaInputProps {
  onSuccess?: () => void;
}

export function QuickIdeaInput({ onSuccess }: QuickIdeaInputProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [source, setSource] = useState<"web" | "voice">("web");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText("nl-NL");

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setSource("voice");

      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "nl-NL";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0]?.[0]?.transcript ?? "";
        if (text) {
          setMessage((prev) => {
            const separator = prev && !prev.endsWith(" ") ? " " : "";
            return prev + separator + text;
          });
        }
      };

      recognition.onend = () => {
        stopListening();
      };

      recognition.start();
      startListening();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 3) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/ideas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          source,
        }),
      });

      if (response.ok) {
        setMessage("");
        setSource("web");
        onSuccess?.();
        inputRef.current?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border-2 border-ink bg-offwhite px-4 py-3 font-body text-sm focus:outline-hidden focus:ring-2 focus:ring-wine"
        placeholder="Typ een snel idee..."
        disabled={submitting}
      />

      {isSupported && (
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`w-12 h-12 border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
            isListening
              ? "bg-wine text-champagne motion-safe:animate-pulse"
              : "bg-offwhite text-ink hover:bg-champagne"
          }`}
          aria-label={isListening ? "Stop opname" : "Dicteer"}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2C8.34 2 7 3.34 7 5V10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10V5C13 3.34 11.66 2 10 2Z"
              fill="currentColor"
            />
            <path
              d="M15 10C15 12.76 12.76 15 10 15C7.24 15 5 12.76 5 10H3C3 13.53 5.61 16.43 9 16.92V19H11V16.92C14.39 16.43 17 13.53 17 10H15Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="font-accent font-bold uppercase tracking-wider text-xs border-2 border-ink bg-wine text-champagne px-4 py-3 hover:bg-burgundy brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {submitting ? "..." : "Delen"}
      </button>
    </form>
  );
}
