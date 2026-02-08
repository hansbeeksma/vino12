"use client";

import dynamic from "next/dynamic";

const VoiceCommandButton = dynamic(
  () =>
    import("./VoiceCommandButton").then((m) => ({
      default: m.VoiceCommandButton,
    })),
  { ssr: false },
);

export function VoiceCommandWrapper() {
  return <VoiceCommandButton />;
}
