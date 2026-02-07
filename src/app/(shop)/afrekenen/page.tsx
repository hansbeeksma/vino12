import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Afrekenen",
};

export default function AfrekekenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Afrekenen</h1>
      <p className="text-gray-500">Checkout formulier wordt hier geladen...</p>
    </div>
  );
}
