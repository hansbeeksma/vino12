import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Winkelwagen",
};

export default function WinkelwagenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Winkelwagen</h1>
      <p className="text-gray-500">Je winkelwagen is leeg.</p>
    </div>
  );
}
