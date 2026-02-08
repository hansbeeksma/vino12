"use client";

import { BrutalButton } from "@/components/ui/BrutalButton";
import { AnimatedSection } from "@/components/motion/AnimatedSection";

export function CtaSection() {
  return (
    <section
      id="bestel"
      className="section-padding bg-champagne border-t-brutal border-ink"
    >
      <div className="container-brutal text-center">
        <AnimatedSection>
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-4">
            Klaar om te ontdekken?
          </p>
          <h2 className="font-display text-display-lg text-ink mb-4">
            BESTEL JOUW
            <br />
            <span className="text-wine">VINO12 BOX</span>
          </h2>
          <p className="font-body text-xl text-ink/70 max-w-lg mx-auto mb-4">
            12 premium wijnen. 6 rood. 6 wit. Van licht en fris tot vol en
            complex. Gratis verzending binnen Nederland.
          </p>

          <div className="flex flex-col items-center gap-4">
            <BrutalButton variant="primary" size="lg" href="/wijnen">
              Bekijk wijnen →
            </BrutalButton>
            <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
              Levering binnen 3-5 werkdagen · 18+ verificatie bij levering
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
