"use client";

import dynamic from "next/dynamic";

const ARSceneViewer = dynamic(
  () =>
    import("@/components/ar/ARSceneViewer").then((m) => ({
      default: m.ARSceneViewer,
    })),
  { ssr: false },
);

interface ARPageClientProps {
  wines: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
    region: string;
    price: number;
    description: string;
    image: string;
  }>;
}

export function ARPageClient({ wines }: ARPageClientProps) {
  return <ARSceneViewer wines={wines} />;
}
