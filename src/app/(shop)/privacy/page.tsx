import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid | VINO12",
  description: "Hoe VINO12 omgaat met jouw persoonsgegevens conform de AVG.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-3xl">
        <h1 className="font-display text-display-md text-ink mb-8">
          PRIVACYBELEID
        </h1>

        <div className="prose-brutal space-y-8">
          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              1. Wie zijn wij?
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              VINO12 is een online wijnhandel. Wij respecteren jouw privacy en
              gaan zorgvuldig om met persoonsgegevens conform de Algemene
              Verordening Gegevensbescherming (AVG/GDPR).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              2. Welke gegevens verzamelen wij?
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>
                <strong>Contactgegevens:</strong> naam, e-mailadres,
                telefoonnummer
              </li>
              <li>
                <strong>Bestelgegevens:</strong> adres, bestelhistorie,
                betaalinformatie (verwerkt door Mollie)
              </li>
              <li>
                <strong>Leeftijdsverificatie:</strong> bevestiging dat je 18+
                bent
              </li>
              <li>
                <strong>Technische gegevens:</strong> IP-adres, browsertype,
                cookies
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              3. Waarvoor gebruiken wij jouw gegevens?
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>Verwerking en bezorging van bestellingen</li>
              <li>Communicatie over je bestelling (bevestiging, verzending)</li>
              <li>
                Naleving van wettelijke verplichtingen (leeftijdsverificatie,
                Drank- en Horecawet)
              </li>
              <li>Verbetering van onze dienstverlening</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              4. Cookies
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed mb-3">
              Wij gebruiken de volgende cookies:
            </p>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>
                <strong>Noodzakelijk:</strong> leeftijdsverificatie,
                winkelwagen, sessie
              </li>
              <li>
                <strong>Analytisch:</strong> anonieme bezoekstatistieken (alleen
                met toestemming)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              5. Bewaartermijnen
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Bestelgegevens bewaren wij 7 jaar conform fiscale bewaarplicht.
              Accountgegevens verwijderen wij op verzoek of 2 jaar na laatste
              activiteit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              6. Jouw rechten
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed mb-3">
              Je hebt recht op:
            </p>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>Inzage in jouw persoonsgegevens</li>
              <li>Correctie of verwijdering van gegevens</li>
              <li>Beperking van of bezwaar tegen verwerking</li>
              <li>Overdraagbaarheid van gegevens</li>
            </ul>
            <p className="font-body text-base text-ink/80 leading-relaxed mt-3">
              Neem contact op via{" "}
              <a
                href="mailto:privacy@vino12.com"
                className="text-wine underline"
              >
                privacy@vino12.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              7. Betalingsverwerking
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Betalingen worden verwerkt door Mollie B.V. Wij slaan geen
              creditcardgegevens op. Mollie is PCI DSS gecertificeerd.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              8. Wijzigingen
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Dit privacybeleid kan worden aangepast. De meest recente versie is
              altijd beschikbaar op deze pagina.
            </p>
            <p className="font-accent text-xs uppercase tracking-widest text-ink/40 mt-4">
              Laatst bijgewerkt: februari 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
