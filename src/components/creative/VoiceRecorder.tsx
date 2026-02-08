"use client";

import { useSpeechToText } from "@/hooks/useSpeechToText";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceRecorder({
  onTranscript,
  className = "",
}: VoiceRecorderProps) {
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText("nl-NL");

  if (!isSupported) {
    return (
      <div className={`border-2 border-ink/20 p-3 ${className}`}>
        <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
          Spraakherkenning wordt niet ondersteund in deze browser. Gebruik
          Chrome of Edge voor voice-to-text.
        </p>
      </div>
    );
  }

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleInsert = () => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`w-12 h-12 border-2 border-ink flex items-center justify-center transition-colors shrink-0 ${
            isListening
              ? "bg-wine text-champagne motion-safe:animate-pulse"
              : "bg-offwhite text-ink hover:bg-champagne"
          }`}
          aria-label={isListening ? "Stop opname" : "Start opname"}
        >
          {isListening ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="4" width="12" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C8.34 2 7 3.34 7 5V10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10V5C13 3.34 11.66 2 10 2Z"
                fill="currentColor"
              />
              <path
                d="M15 10C15 12.76 12.76 15 10 15C7.24 15 5 12.76 5 10H3C3 13.53 5.61 16.43 9 16.92V19H11V16.92C14.39 16.43 17 13.53 17 10H15Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
            {isListening ? "Aan het luisteren..." : "Klik om te dicteren"}
          </p>
          {error && <p className="font-body text-xs text-wine mt-1">{error}</p>}
        </div>

        {transcript && !isListening && (
          <button
            type="button"
            onClick={handleInsert}
            className="font-accent text-[10px] uppercase tracking-widest text-wine hover:text-burgundy border border-wine px-3 py-1.5 shrink-0"
          >
            Invoegen
          </button>
        )}
      </div>

      {(transcript || interimTranscript) && (
        <div className="border-2 border-ink/20 p-3 min-h-[60px]">
          <p className="font-body text-sm text-ink">
            {transcript}
            {interimTranscript && (
              <span className="text-ink/40">{interimTranscript}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
