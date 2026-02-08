export type Variant = "a" | "b" | "c";

export const VARIANTS: Variant[] = ["a", "b", "c"];

export interface VariantContent {
  headline: string;
  subtext: string;
  usps: { title: string; description: string }[];
  ctaText: string;
}

export const variantContent: Record<Variant, VariantContent> = {
  a: {
    headline: "Ontdek bijzondere wijnen, voor jou geselecteerd",
    subtext:
      "Elke maand een verrassende selectie premium wijnen, gekozen door experts.",
    usps: [
      {
        title: "Expert selectie",
        description:
          "Onze sommeliers proeven honderden wijnen zodat jij alleen het beste krijgt.",
      },
      {
        title: "Nieuwe ontdekkingen",
        description:
          "Van verborgen parels tot opkomende wijnmakers — altijd verrassend.",
      },
      {
        title: "Premium kwaliteit",
        description:
          "Elke fles voldoet aan onze strenge kwaliteitseisen. Geen concessies.",
      },
    ],
    ctaText: "Ontvang je eerste selectie",
  },
  b: {
    headline: "Jouw persoonlijke sommelier, altijd binnen handbereik",
    subtext:
      "Vertel ons wat je lekker vindt en ontvang wijnaanbevelingen op maat.",
    usps: [
      {
        title: "Persoonlijk smaakprofiel",
        description:
          "We leren jouw voorkeuren kennen en stemmen elke aanbeveling daarop af.",
      },
      {
        title: "Op maat aanbevelingen",
        description:
          "Geen generieke lijsten maar wijnen die passen bij jouw smaak.",
      },
      {
        title: "Altijd beschikbaar",
        description: "Advies wanneer jij het nodig hebt — geen afspraak nodig.",
      },
    ],
    ctaText: "Ontdek jouw smaak",
  },
  c: {
    headline: "Premium wijnen, eerlijke prijzen — direct bij je thuis",
    subtext:
      "Geen tussenpersonen, geen opslag. Rechtstreeks van wijnmaker naar jouw deur.",
    usps: [
      {
        title: "Direct van wijnmaker",
        description:
          "We werken rechtstreeks samen met wijnmakers in heel Europa.",
      },
      {
        title: "Eerlijke prijzen",
        description:
          "Zonder tussenhandel betaal je alleen voor de wijn, niet voor de keten.",
      },
      {
        title: "Thuisbezorgd",
        description:
          "Zorgvuldig verpakt en snel bezorgd. Altijd op het juiste moment.",
      },
    ],
    ctaText: "Bekijk het aanbod",
  },
};
