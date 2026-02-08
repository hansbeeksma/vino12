"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSpeechToText } from "./useSpeechToText";
import { parseCommand, type VoiceCommand } from "@/lib/voice/command-parser";

interface UseVoiceCommandsOptions {
  onCommand?: (command: VoiceCommand, confidence: number) => void;
  onError?: (message: string) => void;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const router = useRouter();
  const speech = useSpeechToText("nl-NL");
  const lastProcessedRef = useRef("");

  const executeCommand = useCallback(
    (command: VoiceCommand) => {
      switch (command.type) {
        case "search":
          router.push(`/wijnen?q=${encodeURIComponent(command.query)}`);
          break;
        case "navigate":
          router.push(command.target);
          break;
        case "filter":
          router.push(`/wijnen?type=${encodeURIComponent(command.filter)}`);
          break;
        case "addToCart":
          router.push(`/wijnen?q=${encodeURIComponent(command.wineName)}`);
          break;
        case "unknown":
          options.onError?.(
            'Commando niet herkend. Probeer: "zoek pinot noir" of "ga naar winkelwagen"',
          );
          break;
      }
    },
    [router, options],
  );

  // Process transcript when speech stops
  useEffect(() => {
    if (
      speech.isListening ||
      !speech.transcript ||
      speech.transcript === lastProcessedRef.current
    ) {
      return;
    }

    lastProcessedRef.current = speech.transcript;
    const { command, confidence } = parseCommand(speech.transcript);
    options.onCommand?.(command, confidence);
    executeCommand(command);
    speech.resetTranscript();
  }, [speech.isListening, speech.transcript, executeCommand, options, speech]);

  return {
    ...speech,
    isProcessing: false,
  };
}
