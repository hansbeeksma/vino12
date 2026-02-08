import Image from "next/image";
import { BrutalButton } from "@/components/ui/BrutalButton";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative bg-offwhite border-b-brutal-lg border-ink overflow-hidden">
      <div className="container-brutal px-4 md:px-8 pt-24 pb-8 relative z-10">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-4 md:mb-6">
            Premium Wijnbox
          </p>

          <h1 className="font-display text-display-hero text-ink leading-none mb-6">
            VINO
            <br />
            <span className="text-wine">12</span>
          </h1>

          <div className="max-w-xl">
            <p className="font-display text-xl md:text-2xl font-bold text-ink mb-2">
              6 ROOD. 6 WIT. PERFECTE BALANS.
            </p>
            <p className="font-body text-xl md:text-2xl text-ink/70 mb-8">
              12 premium wijnen, zorgvuldig gecureerd. Van licht en fris tot vol
              en complex. Eén box, alle smaken.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <BrutalButton variant="primary" size="lg" href="/wijnen">
              Ontdek de box →
            </BrutalButton>
            <BrutalButton variant="outline-solid" size="lg" href="#collectie">
              Bekijk collectie ↓
            </BrutalButton>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Image
          src="/images/wines/collection-feb.svg"
          alt="VINO12 collectie — 12 premium wijnen naast elkaar"
          width={1920}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
