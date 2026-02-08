"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

const pillars = [
  {
    number: "01",
    title: "Balans",
    description:
      "6 rood, 6 wit. Van licht naar vol. Elke fles heeft een reden om in de box te zitten.",
  },
  {
    number: "02",
    title: "Kwaliteit",
    description:
      "Geen bulkwijnen. Elke fles komt van een regio die bekend staat om dat specifieke druivenras.",
  },
  {
    number: "03",
    title: "Ontdekking",
    description:
      "Van vertrouwde klassiekers tot verrassende ontdekkingen. Albariño, Vermentino, Viognier — ken je ze al?",
  },
  {
    number: "04",
    title: "Eerlijke Prijs",
    description:
      "Gemiddeld €14,58 per fles. Premium kwaliteit zonder premium markup. Direct van wijnmaker naar jou.",
  },
];

export function PhilosophySection() {
  return (
    <section id="filosofie" className="section-padding bg-offwhite">
      <div className="container-brutal">
        <AnimatedSection>
          <SectionLabel>Onze Filosofie</SectionLabel>
          <h2 className="font-display text-display-md text-ink mb-4">
            WAAROM
            <br />
            <span className="text-wine">VINO12?</span>
          </h2>
          <p className="font-body text-xl text-ink/70 max-w-lg mb-12">
            Wij geloven dat een goede wijnbox meer is dan 12 willekeurige
            flessen. Het is een reis door smaken, regio&apos;s en verhalen.
          </p>
        </AnimatedSection>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.number}>
              <BrutalCard className="p-4 md:p-6">
                <span className="font-display text-4xl font-bold text-wine/20 block mb-2">
                  {pillar.number}
                </span>
                <h3 className="font-display text-xl font-bold text-ink mb-2">
                  {pillar.title}
                </h3>
                <p className="font-body text-lg text-ink/70">
                  {pillar.description}
                </p>
              </BrutalCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
