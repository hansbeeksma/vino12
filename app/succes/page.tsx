import { BrutalButton } from "@/components/ui/BrutalButton";

export const metadata = {
  title: "Bedankt! — Vino12",
  description: "Je bestelling is ontvangen. Proost!",
};

export default function SuccesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-offwhite px-4">
      <div className="max-w-lg text-center">
        <div className="border-brutal border-ink bg-champagne brutal-shadow p-8 md:p-12 mb-8">
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-4">
            Bestelling ontvangen
          </p>
          <h1 className="font-display text-display-lg text-ink mb-4">
            PROOST!
          </h1>
          <p className="font-body text-xl text-ink/70 mb-6">
            Bedankt voor je bestelling. Je ontvangt een bevestiging per e-mail.
            Je Vino12 Box wordt binnen 3-5 werkdagen bezorgd.
          </p>
          <div className="w-16 h-1 bg-wine mx-auto" />
        </div>

        <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-6">
          21+ verificatie bij levering
        </p>

        <BrutalButton variant="outline" href="/">
          ← Terug naar Vino12
        </BrutalButton>
      </div>
    </main>
  );
}
