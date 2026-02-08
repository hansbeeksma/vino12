"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSpeechToText } from "./useSpeechToText";
import {
  parseCommand,
  findWineByPairing,
  type VoiceCommand,
} from "@/lib/voice/command-parser";
import wines from "@/data/wines.json";

interface UseVoiceCommandsOptions {
  onCommand?: (command: VoiceCommand, confidence: number) => void;
  onError?: (message: string) => void;
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  utterance.rate = 1.1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const router = useRouter();
  const speech = useSpeechToText("nl-NL");
  const lastProcessedRef = useRef("");

  const executeCommand = useCallback(
    (command: VoiceCommand, spokenResponse?: string) => {
      if (spokenResponse) {
        speak(spokenResponse);
      }

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
          if (command.wineName) {
            router.push(`/wijnen?q=${encodeURIComponent(command.wineName)}`);
          } else {
            router.push("/winkelwagen");
          }
          break;
        case "recommend":
          router.push("/wijnen?sort=popular");
          break;
        case "pair": {
          const pairedWine = findWineByPairing(command.dish);
          if (pairedWine) {
            speak(`${pairedWine.name} past goed bij ${command.dish}.`);
            router.push(`/wijn/${pairedWine.slug}`);
          } else {
            speak(
              `Ik kon geen specifieke match vinden bij ${command.dish}. Ik toon onze collectie.`,
            );
            router.push("/wijnen");
          }
          break;
        }
        case "surprise": {
          const randomWine = wines[Math.floor(Math.random() * wines.length)];
          speak(`Hier is een verrassing: ${randomWine.name}!`);
          router.push(`/wijn/${randomWine.slug}`);
          break;
        }
        case "info": {
          const infoWine = wines.find(
            (w) => w.name.toLowerCase() === command.wineName.toLowerCase(),
          );
          if (infoWine) {
            router.push(`/wijn/${infoWine.slug}`);
          } else {
            router.push(`/wijnen?q=${encodeURIComponent(command.wineName)}`);
          }
          break;
        }
        case "unknown":
          options.onError?.(
            'Commando niet herkend. Probeer: "zoek pinot noir", "wat past bij pasta", of "verras me"',
          );
          break;
      }
    },
    [router, options],
  );

  useEffect(() => {
    if (
      speech.isListening ||
      !speech.transcript ||
      speech.transcript === lastProcessedRef.current
    ) {
      return;
    }

    lastProcessedRef.current = speech.transcript;
    const { command, confidence, spokenResponse } = parseCommand(
      speech.transcript,
    );
    options.onCommand?.(command, confidence);
    executeCommand(command, spokenResponse);
    speech.resetTranscript();
  }, [speech.isListening, speech.transcript, executeCommand, options, speech]);

  return {
    ...speech,
    isProcessing: false,
  };
}
