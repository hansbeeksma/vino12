# VINO-132: Product Validation & Customer Research Framework

> **Epic**: VINO-132 | **Status**: Uitvoerbaar | **Bronnen**: Perplexity Deep Research (60+ citaties)
> **Doel**: Valideer product-market fit voor VINO12 voordat je lanceert

---

## Overzicht Validatie-Piramide

```
                    ┌──────────────┐
                    │  GO/NO-GO    │ ← VINO-141
                    │   REVIEW     │
                    ├──────────────┤
               ┌────┤  CHANNEL     │ ← VINO-140
               │    │   TEST       │
               │    ├──────────────┤
          ┌────┤    │  CONCIERGE   │ ← VINO-139
          │    │    │    MVP       │
          │    │    ├──────────────┤
     ┌────┤    │    │  PRICING     │ ← VINO-138
     │    │    │    │ VALIDATION   │
     │    │    │    ├──────────────┤
     │    │    │    │   JTBD       │ ← VINO-134
     │    │    │    │ INTERVIEWS   │
     └────┴────┴────┴──────────────┘
```

## Uitvoeringsschema (8-12 weken)

| Week | Activiteit                        | VINO Issue | Output                                 |
| ---- | --------------------------------- | ---------- | -------------------------------------- |
| 1-2  | JTBD Interviews (10x)             | VINO-134   | Jobs statements, opportunity scores    |
| 3-4  | Pricing Validation                | VINO-138   | Optimal Price Point, demand curves     |
| 4-6  | Concierge MVP (10 orders)         | VINO-139   | NPS, unit economics, journey map       |
| 6-8  | Channel Test (Instagram + Google) | VINO-140   | CAC per kanaal, ROAS, creative winners |
| 9-10 | Go/No-Go Review                   | VINO-141   | Gewogen score, launch decision         |

## Kernmetrics (Cross-Issue)

| Metric                        | Minimum Viable | Doel   | Bron           |
| ----------------------------- | -------------- | ------ | -------------- |
| NPS                           | +30            | +50    | VINO-139       |
| Herhaalaankoop intentie       | 60%            | 80%    | VINO-139       |
| Willingness-to-Pay (per fles) | >€13           | €16-20 | VINO-138       |
| CAC                           | <€50           | <€30   | VINO-140       |
| LTV/CAC Ratio                 | >3:1           | >5:1   | VINO-141       |
| Conversie Rate (webshop)      | 1.5%           | 2.5%   | VINO-140       |
| Subscription interesse        | 40%            | 60%    | VINO-134 + 138 |

## Data-Opslag Schema

Alle data wordt opgeslagen in een gedeeld Notion/Sheets dashboard met tabs per VINO-issue:

| Tab            | Kolommen                                               | Bron     |
| -------------- | ------------------------------------------------------ | -------- |
| `Interviews`   | Participant, Datum, Jobs, Forces, Opportunity Score    | VINO-134 |
| `Pricing`      | Respondent, VW Antwoorden, GG Ladder, Conjoint Keuzes  | VINO-138 |
| `MVP Orders`   | Order#, Klant, Datum, COGS, Feedback, NPS              | VINO-139 |
| `Channel Data` | Kanaal, Campagne, Spend, Impressies, Clicks, Conv, CAC | VINO-140 |
| `Go/No-Go`     | Criterium, Score, Gewicht, Bewijs, Bron                | VINO-141 |

---

_Zie individuele VINO-issue schemas voor gedetailleerde uitvoering._
