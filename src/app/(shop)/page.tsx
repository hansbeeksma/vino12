import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VINO12 | Premium Wijnen Online",
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold tracking-tight">
          Premium Wijnen,{" "}
          <span className="text-red-700">Direct Thuisbezorgd</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Ontdek onze zorgvuldig geselecteerde collectie wijnen van
          gerenommeerde wijnmakers. Gratis verzending vanaf €75.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/wijnen"
            className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors"
          >
            Bekijk Wijnen
          </a>
        </div>
      </section>
    </div>
  );
}
