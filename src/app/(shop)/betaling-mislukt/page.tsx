import type { Metadata } from "next";
import { BrutalButton } from "@/components/ui/BrutalButton";

export const metadata: Metadata = {
  title: "Betaling mislukt | VINO12",
};

const REASON_MESSAGES: Record<string, string> = {
  failed:
    "De betaling is niet gelukt. Probeer het opnieuw of kies een andere betaalmethode.",
  expired: "De betaalsessie is verlopen. Start een nieuwe betaling.",
  cancelled: "Je hebt de betaling geannuleerd. Je kunt het opnieuw proberen.",
};

interface Props {
  searchParams: Promise<{ order?: string; reason?: string }>;
}

export default async function BetalingMisluktPage({ searchParams }: Props) {
  const { order, reason } = await searchParams;

  const message =
    REASON_MESSAGES[reason ?? ""] ??
    "Er ging iets mis met je betaling. Probeer het opnieuw.";

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal text-center py-20">
        <div className="inline-block border-brutal-lg border-ink bg-offwhite brutal-shadow-lg p-8 md:p-12 mb-8">
          <span className="font-display text-6xl md:text-7xl block mb-4">
            &#x26A0;
          </span>
          <h1 className="font-display text-display-md text-ink mb-4">
            BETALING MISLUKT
          </h1>
          <p className="font-body text-xl text-ink/70 max-w-md mx-auto mb-2">
            {message}
          </p>
          {order && (
            <p className="font-accent text-sm uppercase tracking-widest text-ink/50">
              Bestelnummer: {order}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <BrutalButton variant="primary" size="lg" href="/winkelwagen">
            Terug naar winkelwagen
          </BrutalButton>
          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
            Je wordt niet belast · Probeer het gerust opnieuw
          </p>
        </div>
      </div>
    </div>
  );
}
