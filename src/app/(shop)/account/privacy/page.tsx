import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GdprActions } from "./GdprActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy & Data | Mijn Account | VINO12",
};

export default async function PrivacyPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        PRIVACY & DATA
      </h1>

      <div className="space-y-6 max-w-xl">
        {/* Data info */}
        <div className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-3">
            Jouw gegevens
          </h2>
          <p className="font-body text-sm text-ink/70 mb-4">
            Wij bewaren je gegevens conform de AVG/GDPR. Dit omvat je
            accountgegevens, adressen, bestellingen en leeftijdsverificaties.
          </p>
          <p className="font-body text-sm text-ink/70">
            Je hebt het recht om je gegevens op te vragen (export) of te laten
            verwijderen. Bestelgegevens worden geanonimiseerd bewaard conform de
            fiscale bewaarplicht van 7 jaar.
          </p>
        </div>

        {/* Export */}
        <div className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-3">
            Gegevens exporteren
          </h2>
          <p className="font-body text-sm text-ink/70 mb-4">
            Download al je persoonlijke gegevens als JSON-bestand.
          </p>
          <a
            href="/api/gdpr/export"
            className="inline-block font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors"
          >
            Download mijn gegevens
          </a>
        </div>

        {/* Delete */}
        <div className="border-2 border-wine bg-wine/5 p-6">
          <h2 className="font-display text-lg font-bold text-wine mb-3">
            Account verwijderen
          </h2>
          <p className="font-body text-sm text-ink/70 mb-4">
            Dit verwijdert permanent je account, adressen en
            leeftijdsverificaties. Bestelgegevens worden geanonimiseerd. Deze
            actie kan niet ongedaan worden gemaakt.
          </p>
          <GdprActions />
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <a
            href="/privacy"
            className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine"
          >
            Privacybeleid →
          </a>
          <a
            href="/voorwaarden"
            className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine"
          >
            Algemene voorwaarden →
          </a>
        </div>
      </div>
    </div>
  );
}
