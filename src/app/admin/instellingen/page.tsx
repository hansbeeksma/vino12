import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instellingen | Admin | VINO12",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        INSTELLINGEN
      </h1>

      <div className="space-y-6 max-w-2xl">
        {/* Winkel info */}
        <section className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Winkelinformatie
          </h2>
          <dl className="space-y-3">
            <SettingRow label="Winkelnaam" value="VINO12" />
            <SettingRow label="Domein" value="vino12.nl" />
            <SettingRow label="Valuta" value="EUR (€)" />
            <SettingRow label="Taal" value="Nederlands" />
          </dl>
        </section>

        {/* Verzending */}
        <section className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Verzending
          </h2>
          <dl className="space-y-3">
            <SettingRow
              label="Gratis verzending vanaf"
              value="€0 (altijd gratis)"
            />
            <SettingRow label="Bezorggebied" value="Nederland" />
            <SettingRow label="Levertijd" value="3-5 werkdagen" />
          </dl>
        </section>

        {/* Compliance */}
        <section className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Compliance
          </h2>
          <dl className="space-y-3">
            <SettingRow
              label="Leeftijdsverificatie"
              value="Actief (18+ gate)"
            />
            <SettingRow label="Cookie consent" value="Actief (AVG/GDPR)" />
            <SettingRow label="Drank- en Horecawet" value="Conform" />
          </dl>
        </section>

        {/* Integraties */}
        <section className="border-2 border-ink bg-offwhite p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Integraties
          </h2>
          <dl className="space-y-3">
            <SettingRow
              label="Betaling"
              value={
                process.env.MOLLIE_API_KEY
                  ? "Mollie (verbonden)"
                  : "Mollie (niet geconfigureerd)"
              }
            />
            <SettingRow
              label="E-mail"
              value={
                process.env.RESEND_API_KEY
                  ? "Resend (verbonden)"
                  : "Resend (niet geconfigureerd)"
              }
            />
            <SettingRow
              label="Monitoring"
              value={
                process.env.SENTRY_DSN
                  ? "Sentry (verbonden)"
                  : "Sentry (niet geconfigureerd)"
              }
            />
          </dl>
        </section>

        <p className="font-accent text-[10px] uppercase tracking-widest text-ink/30">
          Instellingen worden beheerd via environment variables. Wijzig
          .env.local voor lokale aanpassingen of Vercel project settings voor
          productie.
        </p>
      </div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink/10 last:border-0">
      <dt className="font-accent text-[10px] uppercase tracking-widest text-ink/60">
        {label}
      </dt>
      <dd className="font-body text-sm text-ink">{value}</dd>
    </div>
  );
}
