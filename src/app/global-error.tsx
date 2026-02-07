"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="nl">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Er ging iets mis</h2>
          <p>Onze excuses voor het ongemak. Probeer het opnieuw.</p>
          <button onClick={() => reset()} style={{ marginTop: "1rem" }}>
            Opnieuw proberen
          </button>
        </div>
      </body>
    </html>
  );
}
