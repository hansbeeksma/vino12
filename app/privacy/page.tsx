import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacybeleid — Vino12',
  description: 'Privacybeleid van Vino12. Hoe wij omgaan met je persoonsgegevens.',
}

export default function PrivacyPage() {
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
            <span className="text-ink">Privacybeleid</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">
            Privacybeleid
          </h1>

          <div className="prose-brutal space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                1. Verantwoordelijke
              </h2>
              <p className="font-body text-lg text-ink/70">
                Vino12 is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven
                in dit privacybeleid. Voor vragen kun je contact opnemen via hallo@vino12.com.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                2. Welke gegevens verzamelen wij
              </h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Wij verwerken de volgende persoonsgegevens:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Naam (voornaam en achternaam)</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer</li>
                  <li>Bezorgadres</li>
                  <li>Betaalgegevens (verwerkt door onze betaalprovider)</li>
                  <li>Leeftijdsverificatie</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                3. Doeleinden van verwerking
              </h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Wij verwerken je gegevens voor:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Het afhandelen van je bestelling en betaling</li>
                  <li>Het bezorgen van je bestelling</li>
                  <li>Het versturen van een bevestigingsmail</li>
                  <li>Het voldoen aan wettelijke verplichtingen (leeftijdsverificatie)</li>
                  <li>Het verbeteren van onze dienstverlening (alleen met toestemming)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">4. Cookies</h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Wij gebruiken de volgende categorieën cookies:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Noodzakelijk:</strong> Essentieel voor de werking van de website
                    (winkelwagen, leeftijdsverificatie)
                  </li>
                  <li>
                    <strong>Functioneel:</strong> Onthouden je voorkeuren (met toestemming)
                  </li>
                  <li>
                    <strong>Analytisch:</strong> Helpen ons de website te verbeteren (met
                    toestemming)
                  </li>
                  <li>
                    <strong>Marketing:</strong> Voor gepersonaliseerde content (met toestemming)
                  </li>
                </ul>
                <p>Je kunt je cookievoorkeuren altijd aanpassen via de cookiebanner.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">5. Bewaartermijn</h2>
              <p className="font-body text-lg text-ink/70">
                Wij bewaren je gegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze
                zijn verzameld. Bestelgegevens worden 7 jaar bewaard conform fiscale wetgeving.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">6. Delen met derden</h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Wij delen je gegevens alleen met:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Onze bezorgpartner (voor levering)</li>
                  <li>Onze betaalprovider (voor betalingsverwerking)</li>
                  <li>Overheidsinstanties (indien wettelijk verplicht)</li>
                </ul>
                <p>Wij verkopen je gegevens nooit aan derden.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">7. Je rechten</h2>
              <div className="font-body text-lg text-ink/70 space-y-2">
                <p>Op grond van de AVG heb je de volgende rechten:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Recht op inzage van je gegevens</li>
                  <li>Recht op rectificatie van onjuiste gegevens</li>
                  <li>Recht op verwijdering van je gegevens</li>
                  <li>Recht op beperking van verwerking</li>
                  <li>Recht op dataportabiliteit</li>
                  <li>Recht van bezwaar tegen verwerking</li>
                </ul>
                <p>
                  Om je rechten uit te oefenen, neem contact op via hallo@vino12.com. Wij reageren
                  binnen 30 dagen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">8. Beveiliging</h2>
              <p className="font-body text-lg text-ink/70">
                Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens
                te beschermen. Alle communicatie verloopt via een beveiligde HTTPS-verbinding.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink mb-3">9. Klachten</h2>
              <p className="font-body text-lg text-ink/70">
                Als je een klacht hebt over onze verwerking van persoonsgegevens, neem dan contact
                met ons op. Je hebt ook het recht een klacht in te dienen bij de Autoriteit
                Persoonsgegevens (autoriteitpersoonsgegevens.nl).
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
