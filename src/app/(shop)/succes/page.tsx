import type { Metadata } from "next";
import { BrutalButton } from "@/components/ui/BrutalButton";

export const metadata: Metadata = {
  title: "Bestelling bevestigd | VINO12",
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function SuccesPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal text-center py-20">
        <div className="inline-block border-brutal-lg border-ink bg-offwhite brutal-shadow-lg p-8 md:p-12 mb-8">
          <span className="font-display text-6xl md:text-7xl block mb-4">
            🍷
          </span>
          <h1 className="font-display text-display-md text-ink mb-4">
            BEDANKT!
          </h1>
          <p className="font-body text-xl text-ink/70 max-w-md mx-auto mb-2">
            Je bestelling is bevestigd. We gaan direct aan de slag met het
            inpakken van jouw wijnen.
          </p>
          {order && (
            <p className="font-accent text-sm uppercase tracking-widest text-wine">
              Bestelnummer: {order}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
            Levering binnen 3-5 werkdagen · Bevestigingsmail onderweg
          </p>
          <BrutalButton variant="outline" size="lg" href="/">
            ← Terug naar home
          </BrutalButton>
        </div>
      </div>
    </div>
  );
}
