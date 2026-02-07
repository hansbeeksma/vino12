import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden — Vino12',
  description: 'Algemene voorwaarden van Vino12.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-offwhite pt-20">
        <div className="container-brutal px-4 py-8 md:px-8 md:py-12 max-w-3xl mx-auto">
          <nav className="font-accent text-xs uppercase tracking-widest text-ink/50 mb-8">
            <Link href="/" className="hover:text-wine">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Algemene Voorwaarden</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">
            Algemene Voorwaarden
          </h1>

          <div className="prose-brutal space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">1. Definities</h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>
                  <strong>Vino12:</strong> De onderneming die via vino12.com wijnboxen aanbiedt.
                </p>
                <p>
                  <strong>Klant:</strong> De natuurlijke persoon van 18 jaar of ouder die een
                  bestelling plaatst.
                </p>
                <p>
                  <strong>Overeenkomst:</strong> De koopovereenkomst tussen Vino12 en de Klant.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">2. Toepasselijkheid</h2>
              <p className="font-body text-lg text-ink/70">
                Deze algemene voorwaarden zijn van toepassing op elk aanbod van Vino12 en op elke
                overeenkomst tussen Vino12 en de Klant. Door het plaatsen van een bestelling
                aanvaardt de Klant deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                3. Leeftijdsverificatie
              </h2>
              <p className="font-body text-lg text-ink/70">
                De verkoop van alcoholhoudende dranken is uitsluitend bestemd voor personen van 18
                jaar en ouder. Bij het plaatsen van een bestelling bevestigt de Klant dat hij/zij
                minimaal 18 jaar oud is. Bij levering kan om legitimatie worden gevraagd.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                4. Aanbod en prijzen
              </h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Alle prijzen zijn in euro&apos;s en inclusief BTW.</p>
                <p>Verzendkosten zijn gratis voor leveringen binnen Nederland.</p>
                <p>
                  Vino12 behoudt zich het recht voor prijzen te wijzigen. Lopende bestellingen
                  worden niet beïnvloed door prijswijzigingen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">5. Levering</h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Levering vindt plaats binnen 3-5 werkdagen na ontvangst van betaling.</p>
                <p>Vino12 levert uitsluitend binnen Nederland.</p>
                <p>
                  Bij aflevering kan om legitimatie worden gevraagd ter verificatie van de
                  minimumleeftijd van 18 jaar.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">6. Herroepingsrecht</h2>
              <p className="font-body text-lg text-ink/70">
                De Klant heeft het recht de overeenkomst binnen 14 dagen na ontvangst van het
                product zonder opgave van redenen te ontbinden. De producten dienen ongeopend en in
                originele verpakking geretourneerd te worden. Retourkosten zijn voor rekening van de
                Klant.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">7. Betaling</h2>
              <p className="font-body text-lg text-ink/70">
                Betaling geschiedt via de op de website aangeboden betaalmethoden (iDEAL,
                creditcard, etc.). Betaling vindt plaats op het moment van bestelling.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">8. Klachten</h2>
              <p className="font-body text-lg text-ink/70">
                Klachten over producten of diensten kunnen worden ingediend via hallo@vino12.com.
                Wij streven ernaar klachten binnen 5 werkdagen te behandelen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                9. Verantwoord alcoholgebruik
              </h2>
              <p className="font-body text-lg text-ink/70">
                Vino12 moedigt verantwoord alcoholgebruik aan. Neem voor meer informatie contact op
                met het Trimbos-instituut (trimbos.nl) of bel de Alcohollijn: 0900-500 2021.
              </p>
            </section>

            <div className="border-t-2 border-ink/10 pt-6 mt-8">
              <p className="font-accent text-xs text-ink/40 uppercase tracking-widest">
                Laatst bijgewerkt: februari 2026
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
