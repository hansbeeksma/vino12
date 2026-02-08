"use client";

import { useState, useCallback } from "react";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { VoiceCommandFeedback } from "./VoiceCommandFeedback";
import type { VoiceCommand } from "@/lib/voice/command-parser";

const COMMAND_LABELS: Record<VoiceCommand["type"], string> = {
  search: "Zoeken...",
  navigate: "Navigeren...",
  filter: "Filteren...",
  addToCart: "Toevoegen...",
  unknown: "Niet herkend",
};

export function VoiceCommandButton() {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleCommand = useCallback(
    (command: VoiceCommand, confidence: number) => {
      if (command.type === "unknown") {
        setFeedback({
          message: 'Commando niet herkend. Probeer: "zoek pinot noir"',
          type: "error",
        });
        return;
      }

      const label = COMMAND_LABELS[command.type];
      const confText =
        confidence > 0.8 ? "" : ` (${Math.round(confidence * 100)}%)`;
      setFeedback({
        message: `${label}${confText}`,
        type: "success",
      });
    },
    [],
  );

  const handleError = useCallback((message: string) => {
    setFeedback({ message, type: "error" });
  }, []);

  const {
    isListening,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
    error,
  } = useVoiceCommands({
    onCommand: handleCommand,
    onError: handleError,
  });

  if (!isSupported) return null;

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 border-4 border-ink flex items-center justify-center transition-colors ${
          isListening
            ? "bg-wine text-champagne motion-safe:animate-pulse"
            : "bg-offwhite text-ink hover:bg-champagne brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        }`}
        aria-label={
          isListening ? "Stop spraakcommando" : "Start spraakcommando"
        }
        title='Spraakcommando&apos;s (bijv. "zoek pinot noir")'
      >
        {isListening ? (
          // Stop icon (square)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="4" width="12" height="12" fill="currentColor" />
          </svg>
        ) : (
          // Mic icon
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 2C9.34 2 8 3.34 8 5V11C8 12.66 9.34 14 11 14C12.66 14 14 12.66 14 11V5C14 3.34 12.66 2 11 2Z"
              fill="currentColor"
            />
            <path
              d="M16 11C16 13.76 13.76 16 11 16C8.24 16 6 13.76 6 11H4C4 14.53 6.61 17.43 10 17.92V20H12V17.92C15.39 17.43 18 14.53 18 11H16Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

      {/* Interim transcript bubble */}
      {isListening && interimTranscript && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs">
          <div className="bg-offwhite border-2 border-ink px-3 py-2">
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-1">
              Gehoord:
            </p>
            <p className="font-body text-sm text-ink/60 italic">
              {interimTranscript}
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <VoiceCommandFeedback
          message={error}
          type="error"
          onDismiss={() => {}}
        />
      )}

      {/* Command feedback */}
      <VoiceCommandFeedback
        message={feedback?.message ?? null}
        type={feedback?.type ?? "info"}
        onDismiss={() => setFeedback(null)}
      />
    </>
  );
}
