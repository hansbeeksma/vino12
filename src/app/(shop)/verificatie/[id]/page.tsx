import type { Metadata } from "next";
import { VerificationClient } from "./client";

interface VerificatiePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VerificatiePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Verificatie — VINO12`,
    description: `Verifieer de authenticiteit van wijn ${id} via het VINO12 Digital Passport.`,
  };
}

export default async function VerificatiePage({
  params,
}: VerificatiePageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="font-accent text-[10px] uppercase tracking-widest text-wine">
            Digital Wine Passport
          </span>
          <h1 className="font-display text-3xl font-bold text-ink mt-2">
            Verificatie
          </h1>
          <p className="font-body text-sm text-ink/60 mt-2">
            Verifieer de authenticiteit en herkomst van deze wijn
          </p>
        </div>

        <VerificationClient wineId={id} />
      </div>
    </div>
  );
}
