import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | VINO12",
  description: "De algemene voorwaarden van VINO12 voor online wijnverkoop.",
};

export default function VoorwaardenPage() {
  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-3xl">
        <h1 className="font-display text-display-md text-ink mb-8">
          ALGEMENE VOORWAARDEN
        </h1>

        <div className="prose-brutal space-y-8">
          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 1 — Definities
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>
                <strong>VINO12:</strong> de online wijnhandel bereikbaar via
                vino12.com
              </li>
              <li>
                <strong>Klant:</strong> de natuurlijke persoon van 18 jaar of
                ouder die een bestelling plaatst
              </li>
              <li>
                <strong>Bestelling:</strong> de aankoop van producten via de
                webshop
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 2 — Leeftijdsverificatie
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Conform de Drank- en Horecawet is het verboden alcohol te verkopen
              aan personen jonger dan 18 jaar. Door een bestelling te plaatsen
              bevestigt de klant minimaal 18 jaar oud te zijn. Bij bezorging kan
              om legitimatie worden gevraagd.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 3 — Aanbod en prijzen
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>Alle prijzen zijn in euro&apos;s en inclusief BTW</li>
              <li>
                Verzendkosten worden voor het afronden van de bestelling getoond
              </li>
              <li>
                VINO12 behoudt zich het recht voor prijzen te wijzigen.
                Bestaande bestellingen worden niet aangepast.
              </li>
              <li>Het aanbod is geldig zolang de voorraad strekt</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 4 — Bestelling en betaling
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>
                Een overeenkomst komt tot stand na bevestiging van de bestelling
                en ontvangst van betaling
              </li>
              <li>
                Betaling verloopt via iDEAL of creditcard, verwerkt door Mollie
                B.V.
              </li>
              <li>
                Bij niet-geslaagde betaling wordt de bestelling geannuleerd
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 5 — Levering
            </h2>
            <ul className="font-body text-base text-ink/80 leading-relaxed space-y-2 list-disc pl-6">
              <li>
                Levering vindt plaats binnen 3-5 werkdagen na ontvangst van
                betaling
              </li>
              <li>VINO12 levert uitsluitend binnen Nederland</li>
              <li>
                Bij bezorging kan om legitimatie worden gevraagd ter verificatie
                van de minimumleeftijd (18+)
              </li>
              <li>Gratis verzending bij bestellingen boven €100</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 6 — Herroepingsrecht
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Je hebt 14 dagen bedenktijd na ontvangst van je bestelling. De
              wijn moet ongeopend en in originele verpakking worden
              geretourneerd. Retourkosten zijn voor rekening van de klant. Neem
              contact op via{" "}
              <a href="mailto:info@vino12.com" className="text-wine underline">
                info@vino12.com
              </a>{" "}
              voor een retourverzoek.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 7 — Klachten
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Klachten over producten of dienstverlening kunnen worden ingediend
              via{" "}
              <a href="mailto:info@vino12.com" className="text-wine underline">
                info@vino12.com
              </a>
              . Wij streven ernaar klachten binnen 5 werkdagen te beantwoorden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 8 — Verantwoord alcoholgebruik
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              VINO12 moedigt verantwoord alcoholgebruik aan. Drink met mate.
              Niet drinken als je nog moet rijden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              Artikel 9 — Toepasselijk recht
            </h2>
            <p className="font-body text-base text-ink/80 leading-relaxed">
              Op deze algemene voorwaarden is Nederlands recht van toepassing.
              Geschillen worden voorgelegd aan de bevoegde rechter.
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
