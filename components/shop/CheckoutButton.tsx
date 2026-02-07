"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function CheckoutButton() {
  const { quantity } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Er ging iets mis. Probeer het opnieuw.");
      }
    } catch {
      alert("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || quantity === 0}
      className="w-full font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Laden..." : "Afrekenen →"}
    </button>
  );
}
