"use client";

import dynamic from "next/dynamic";

const WineScanner = dynamic(
  () =>
    import("@/components/cv/WineScanner").then((m) => ({
      default: m.WineScanner,
    })),
  { ssr: false },
);

export function ScanPageClient() {
  return <WineScanner />;
}
