import type { Criterion } from "./types.js";

export const CRITERIA: Criterion[] = [
  {
    id: 1,
    name: "Problem Validation",
    weight: 20,
    description:
      "Hebben we bewijs dat het probleem echt bestaat en pijnlijk genoeg is?",
    minimumThreshold: 3,
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "80%+ interviews bevestigt pijnpunt, WTP duidelijk",
      },
      {
        score: 4,
        label: "Good",
        description: "60-80% bevestiging, redelijke pijn",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "40-60% bevestiging, matige pijn (MINIMUM)",
      },
      {
        score: 2,
        label: "Weak",
        description: "20-40% bevestiging, lage pijn",
      },
      {
        score: 1,
        label: "Poor",
        description: "<20% bevestiging",
      },
      {
        score: 0,
        label: "Failing",
        description: "Probleem niet bevestigd",
      },
    ],
  },
  {
    id: 2,
    name: "Willingness to Pay",
    weight: 15,
    description: "Zijn klanten bereid te betalen voor deze oplossing?",
    minimumThreshold: 2,
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: '80%+ zegt "ja" bij voorgestelde prijs',
      },
      {
        score: 4,
        label: "Good",
        description: "60-80% positieve respons",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "40-60% positieve respons",
      },
      {
        score: 2,
        label: "Weak",
        description: "20-40% positieve respons (MINIMUM)",
      },
      {
        score: 1,
        label: "Poor",
        description: "<20% positieve respons",
      },
      {
        score: 0,
        label: "Failing",
        description: "Niemand wil betalen",
      },
    ],
  },
  {
    id: 3,
    name: "Market Size (SOM)",
    weight: 15,
    description: "Is de Serviceable Obtainable Market groot genoeg?",
    minimumThreshold: 3,
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "SOM >€2M",
      },
      {
        score: 4,
        label: "Good",
        description: "SOM €1M-€2M",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "SOM €500K-€1M",
      },
      {
        score: 2,
        label: "Weak",
        description: "SOM €250K-€500K (MINIMUM: >€500K)",
      },
      {
        score: 1,
        label: "Poor",
        description: "SOM €100K-€250K",
      },
      {
        score: 0,
        label: "Failing",
        description: "SOM <€100K",
      },
    ],
  },
  {
    id: 4,
    name: "Competition & Differentiation",
    weight: 10,
    description: "Kunnen we ons onderscheiden van bestaande oplossingen?",
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "Duidelijk uniek, geen directe concurrentie",
      },
      {
        score: 4,
        label: "Good",
        description: "Sterke differentiatie, enkele concurrenten",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "Voldoende onderscheidend, veel concurrenten",
      },
      {
        score: 2,
        label: "Weak",
        description: "Zwakke differentiatie",
      },
      {
        score: 1,
        label: "Poor",
        description: "Bijna geen differentiatie",
      },
      {
        score: 0,
        label: "Failing",
        description: "Commodity, geen unique value",
      },
    ],
  },
  {
    id: 5,
    name: "Technical Feasibility",
    weight: 10,
    description:
      "Kunnen we dit bouwen met beschikbare resources en tech stack?",
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "Volledig haalbaar, bestaande tech, <3 maanden",
      },
      {
        score: 4,
        label: "Good",
        description: "Haalbaar, kleine nieuwe deps, 3-6 maanden",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "Haalbaar met uitdagingen, 6-12 maanden",
      },
      {
        score: 2,
        label: "Weak",
        description: "Grote technische uitdagingen",
      },
      {
        score: 1,
        label: "Poor",
        description: "Zeer complex, hoge onzekerheid",
      },
      {
        score: 0,
        label: "Failing",
        description: "Technisch niet haalbaar",
      },
    ],
  },
  {
    id: 6,
    name: "Channel Viability",
    weight: 10,
    description: "Kunnen we klanten bereiken via beschikbare kanalen?",
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "CAC <€20, conversion >5%, duidelijke schaling",
      },
      {
        score: 4,
        label: "Good",
        description: "CAC €20-€40, conversion 3-5%",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "CAC €40-€60, conversion 1-3%",
      },
      {
        score: 2,
        label: "Weak",
        description: "CAC €60-€100, conversion <1%",
      },
      {
        score: 1,
        label: "Poor",
        description: "CAC >€100, zeer lage conversion",
      },
      {
        score: 0,
        label: "Failing",
        description: "Geen werkende kanalen",
      },
    ],
  },
  {
    id: 7,
    name: "Business Model Viability",
    weight: 10,
    description: "Is het business model winstgevend en schaalbaar?",
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "LTV/CAC >5, contribution margin >60%",
      },
      {
        score: 4,
        label: "Good",
        description: "LTV/CAC 3-5, contribution margin 40-60%",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "LTV/CAC 2-3, contribution margin 20-40%",
      },
      {
        score: 2,
        label: "Weak",
        description: "LTV/CAC 1-2, contribution margin 10-20%",
      },
      {
        score: 1,
        label: "Poor",
        description: "LTV/CAC <1, contribution margin <10%",
      },
      {
        score: 0,
        label: "Failing",
        description: "Fundamenteel niet winstgevend",
      },
    ],
  },
  {
    id: 8,
    name: "Team & Execution Capability",
    weight: 10,
    description: "Heeft het team de skills en capaciteit om dit uit te voeren?",
    scoringGuide: [
      {
        score: 5,
        label: "Excellent",
        description: "Alle skills in-house, full-time focus mogelijk",
      },
      {
        score: 4,
        label: "Good",
        description: "Meeste skills in-house, 80%+ capaciteit",
      },
      {
        score: 3,
        label: "Acceptable",
        description: "Enkele skill gaps, 50-80% capaciteit",
      },
      {
        score: 2,
        label: "Weak",
        description: "Significante skill gaps, <50% capaciteit",
      },
      {
        score: 1,
        label: "Poor",
        description: "Grote skill gaps, zeer beperkte capaciteit",
      },
      {
        score: 0,
        label: "Failing",
        description: "Team niet geschikt",
      },
    ],
  },
];

export function getTotalWeight(): number {
  return CRITERIA.reduce((sum, c) => sum + c.weight, 0);
}
