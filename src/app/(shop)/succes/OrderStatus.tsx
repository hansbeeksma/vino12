"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded";

export function OrderStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order");

  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [polling, setPolling] = useState(true);

  const pollStatus = useCallback(async () => {
    if (!orderNumber) return;

    try {
      const res = await fetch(`/api/orders/status?order=${orderNumber}`);
      if (!res.ok) return;

      const data = await res.json();
      const paymentStatus = data.paymentStatus as PaymentStatus;
      setStatus(paymentStatus);

      if (
        paymentStatus === "failed" ||
        paymentStatus === "expired" ||
        paymentStatus === "cancelled"
      ) {
        setPolling(false);
        router.replace(
          `/betaling-mislukt?order=${orderNumber}&reason=${paymentStatus}`,
        );
      } else if (paymentStatus === "paid" || paymentStatus === "refunded") {
        setPolling(false);
      }
    } catch {
      // Silently ignore polling errors
    }
  }, [orderNumber, router]);

  useEffect(() => {
    if (!polling || !orderNumber) return;

    const initialPoll = setTimeout(pollStatus, 0);
    const interval = setInterval(pollStatus, 3000);
    const timeout = setTimeout(() => {
      setPolling(false);
      clearInterval(interval);
    }, 120_000);

    return () => {
      clearTimeout(initialPoll);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [polling, orderNumber, pollStatus]);

  if (status === "pending") {
    return (
      <div className="animate-pulse">
        <span className="font-display text-6xl md:text-7xl block mb-4">
          &#x23F3;
        </span>
        <h1 className="font-display text-display-md text-ink mb-4">
          BETALING VERWERKEN...
        </h1>
        <p className="font-body text-xl text-ink/70 max-w-md mx-auto mb-2">
          We controleren je betaling. Dit duurt meestal een paar seconden.
        </p>
      </div>
    );
  }

  return null;
}
