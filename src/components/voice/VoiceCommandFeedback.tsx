"use client";

import { useEffect, useRef } from "react";

interface VoiceCommandFeedbackProps {
  message: string | null;
  type: "success" | "error" | "info";
  onDismiss: () => void;
}

export function VoiceCommandFeedback({
  message,
  type,
  onDismiss,
}: VoiceCommandFeedbackProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) return;

    timerRef.current = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, onDismiss]);

  if (!message) return null;

  const borderColor =
    type === "error"
      ? "border-wine"
      : type === "success"
        ? "border-emerald-600"
        : "border-ink";

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-sm animate-in slide-in-from-bottom fade-in`}
    >
      <div
        className={`bg-offwhite border-2 ${borderColor} px-4 py-3 brutal-shadow`}
      >
        <p className="font-accent text-xs uppercase tracking-widest text-ink">
          {message}
        </p>
      </div>
    </div>
  );
}
