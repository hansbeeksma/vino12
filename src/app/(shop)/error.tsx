"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-offwhite min-h-screen flex items-center justify-center section-padding">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-wine mb-4">
          Er ging iets mis
        </h1>
        <p className="font-body text-lg text-ink/70 mb-8">
          Probeer het opnieuw of ga terug naar de homepagina.
        </p>
        <button
          onClick={reset}
          className="font-accent text-xs uppercase tracking-widest border-2 border-ink px-6 py-3 brutal-shadow brutal-hover bg-offwhite hover:bg-champagne"
        >
          Opnieuw proberen
        </button>
      </div>
    </div>
  );
}
