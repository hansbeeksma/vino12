import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wijnen",
  description:
    "Ontdek ons assortiment premium wijnen. Filter op type, regio, druif en meer.",
};

export default function WijnenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Onze Wijnen</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <p className="text-sm text-gray-500">
              Filters worden hier geladen...
            </p>
          </div>
        </aside>
        <div className="md:col-span-3">
          <p className="text-gray-500">Wijnen worden hier geladen...</p>
        </div>
      </div>
    </div>
  );
}
