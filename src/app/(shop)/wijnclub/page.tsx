import type { Metadata } from "next";
import Link from "next/link";
import { BrutalButton } from "@/components/ui/BrutalButton";

export const metadata: Metadata = {
  title: "Wijnclub | VINO12",
  description:
    "Word lid van de VINO12 Wijnclub. Ontvang maandelijks een geselecteerde box met 6 premium wijnen aan huis.",
};

const PLANS = [
  {
    name: "ONTDEKKER",
    bottles: 6,
    priceCents: 8500,
    description: "Perfect om te starten",
    features: [
      "6 flessen per maand",
      "Mix rood & wit",
      "Proefnotities bij elke wijn",
      "Gratis bezorging",
    ],
  },
  {
    name: "KENNER",
    bottles: 12,
    priceCents: 15500,
    description: "Onze populairste keuze",
    features: [
      "12 flessen per maand",
      "Curated selectie",
      "Sommelier tasting notes",
      "Gratis bezorging",
      "10% korting op losse wijnen",
    ],
    popular: true,
  },
  {
    name: "SOMMELIER",
    bottles: 12,
    priceCents: 24500,
    description: "Voor de echte wijnliefhebber",
    features: [
      "12 premium flessen per maand",
      "Exclusieve domeinwijnen",
      "Persoonlijk smaakprofiel",
      "Gratis bezorging",
      "15% korting op losse wijnen",
      "Uitnodiging voor proeverijen",
    ],
  },
];

export default function WineClubPage() {
  return (
    <div className="bg-offwhite min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-ink text-offwhite">
        <div className="container-brutal max-w-4xl text-center py-16 md:py-24">
          <p className="font-accent text-[10px] uppercase tracking-widest text-offwhite/50 mb-4">
            VINO12 Wijnclub
          </p>
          <h1 className="font-display text-display-lg text-offwhite mb-6">
            ELKE MAAND DE
            <br />
            BESTE WIJNEN
          </h1>
          <p className="font-body text-lg text-offwhite/70 max-w-xl mx-auto mb-8">
            Ontvang maandelijks een zorgvuldig geselecteerde box met premium
            wijnen van kleine, onafhankelijke wijnmakers. Direct aan je deur.
          </p>
          <BrutalButton variant="primary" size="lg" href="#abonnementen">
            Bekijk abonnementen →
          </BrutalButton>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding">
        <div className="container-brutal max-w-4xl py-16">
          <h2 className="font-display text-display-sm text-ink text-center mb-12">
            HOE HET WERKT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "KIES JE PLAN",
                desc: "Selecteer het abonnement dat bij je past. Altijd maandelijks opzegbaar.",
              },
              {
                step: "02",
                title: "WIJ SELECTEREN",
                desc: "Onze sommeliers kiezen de beste wijnen op basis van seizoen en jouw smaakprofiel.",
              },
              {
                step: "03",
                title: "GENIET",
                desc: "Ontvang je box thuis met proefnotities en food pairing suggesties.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border-2 border-ink bg-offwhite p-6 text-center"
              >
                <span className="font-display text-4xl font-bold text-wine">
                  {item.step}
                </span>
                <h3 className="font-display text-lg font-bold text-ink mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-ink/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="abonnementen" className="section-padding bg-champagne">
        <div className="container-brutal max-w-5xl py-16">
          <h2 className="font-display text-display-sm text-ink text-center mb-12">
            ABONNEMENTEN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`border-2 bg-offwhite p-6 flex flex-col ${
                  plan.popular ? "border-wine" : "border-ink"
                }`}
              >
                {plan.popular && (
                  <span className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
                    Meest gekozen
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-ink mb-1">
                  {plan.name}
                </h3>
                <p className="font-body text-sm text-ink/50 mb-4">
                  {plan.description}
                </p>
                <p className="font-display text-3xl font-bold text-ink mb-1">
                  &euro;{(plan.priceCents / 100).toFixed(2).replace(".", ",")}
                </p>
                <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-6">
                  per maand · {plan.bottles} flessen
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="font-body text-sm text-ink/70 flex items-start gap-2"
                    >
                      <span className="text-emerald mt-0.5">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <BrutalButton
                  variant={plan.popular ? "primary" : "secondary"}
                  size="md"
                  href="/login"
                  className="w-full text-center"
                >
                  Word lid →
                </BrutalButton>
              </div>
            ))}
          </div>
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/30 text-center mt-6">
            Altijd maandelijks opzegbaar · Gratis bezorging · 18+
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-brutal max-w-2xl py-16">
          <h2 className="font-display text-display-sm text-ink text-center mb-12">
            VEELGESTELDE VRAGEN
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Kan ik mijn abonnement pauzeren?",
                a: "Ja, je kunt je abonnement op elk moment pauzeren via je account.",
              },
              {
                q: "Wanneer wordt mijn box verzonden?",
                a: "Boxen worden rond de eerste van de maand verzonden. Bezorging binnen 3-5 werkdagen.",
              },
              {
                q: "Kan ik mijn voorkeuren aangeven?",
                a: "Ja! Vul je smaakprofiel in en wij stemmen de selectie af op jouw voorkeuren.",
              },
              {
                q: "Hoe werkt de leeftijdsverificatie?",
                a: "Bij het aanmelden verifiëren we je leeftijd conform de Drank- en Horecawet. Je moet 18+ zijn.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-2 border-ink bg-offwhite p-4">
                <h3 className="font-display text-base font-bold text-ink mb-2">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-ink/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-wine">
        <div className="container-brutal max-w-2xl text-center py-16">
          <h2 className="font-display text-display-sm text-offwhite mb-4">
            KLAAR OM TE BEGINNEN?
          </h2>
          <p className="font-body text-lg text-offwhite/70 mb-8">
            Word lid van de VINO12 Wijnclub en ontdek elke maand nieuwe wijnen.
          </p>
          <Link
            href="#abonnementen"
            className="inline-block font-display text-sm font-bold uppercase tracking-wider border-2 border-offwhite text-offwhite px-8 py-4 hover:bg-offwhite hover:text-wine transition-colors"
          >
            Bekijk abonnementen →
          </Link>
        </div>
      </section>
    </div>
  );
}
