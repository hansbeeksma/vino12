# Go/No-Go Decision Framework

**VINO12 Product Validation - Weighted Scoring Matrix**

---

## Overview

Dit framework gebruikt een **weighted scoring matrix** met 8 criteria om een data-driven Go/No-Go beslissing te maken voor VINO12. Elk criterium wordt gescoord op een schaal van 0-5 en vermenigvuldigd met een gewicht (totaal 100%).

## Scoring Schaal

| Score | Betekenis  | Indicator                                               |
| ----- | ---------- | ------------------------------------------------------- |
| **5** | Excellent  | Sterk bewijs, overtuigende data, geen twijfel           |
| **4** | Good       | Goede indicatoren, betrouwbare data, kleine vraagtekens |
| **3** | Acceptable | Voldoende bewijs, minimale validatie, enige onzekerheid |
| **2** | Weak       | Beperkt bewijs, aannames, significante risico's         |
| **1** | Poor       | Zwak bewijs, veel aannames, grote risico's              |
| **0** | Failing    | Geen bewijs, tegenstrijdige data, blokkerende issues    |

---

## De 8 Criteria (met gewichten)

### 1. Problem Validation (20%)

**Vraag:** Hebben we bewijs dat het probleem echt bestaat en pijnlijk genoeg is?

**Data sources:**

- JTBD interviews (10+ respondenten)
- Problem-solution fit surveys
- Customer pain points analyse

**Scoring guide:**

- **5:** 80%+ interviews bevestigt pijnpunt, willingness to pay duidelijk
- **4:** 60-80% bevestiging, redelijke pijn
- **3:** 40-60% bevestiging, matige pijn (**MINIMUM THRESHOLD**)
- **2:** 20-40% bevestiging, lage pijn
- **1:** <20% bevestiging
- **0:** Probleem niet bevestigd

**Minimum threshold:** ≥3

---

### 2. Willingness to Pay (15%)

**Vraag:** Zijn klanten bereid te betalen voor deze oplossing?

**Data sources:**

- Pricing validation tests
- Competitor pricing analysis
- Value proposition testing

**Scoring guide:**

- **5:** 80%+ respondenten zegt "ja" bij voorgestelde prijs
- **4:** 60-80% positieve respons
- **3:** 40-60% positieve respons
- **2:** 20-40% positieve respons (**MINIMUM THRESHOLD**)
- **1:** <20% positieve respons
- **0:** Niemand wil betalen

**Minimum threshold:** ≥2

---

### 3. Market Size (SOM) (15%)

**Vraag:** Is de Serviceable Obtainable Market groot genoeg?

**Data sources:**

- TAM/SAM/SOM berekeningen
- Marktonderzoek wijnmarkt NL
- Concurrentie analyse

**Scoring guide:**

- **5:** SOM >€2M
- **4:** SOM €1M-€2M
- **3:** SOM €500K-€1M
- **2:** SOM €250K-€500K (**MINIMUM THRESHOLD: >€500K**)
- **1:** SOM €100K-€250K
- **0:** SOM <€100K

**Minimum threshold:** SOM >€500K (score ≥3)

---

### 4. Competition & Differentiation (10%)

**Vraag:** Kunnen we ons onderscheiden van bestaande oplossingen?

**Data sources:**

- Competitive analysis
- Unique value proposition testing
- Feature comparison matrix

**Scoring guide:**

- **5:** Duidelijk uniek, geen directe concurrentie, sterke defensibility
- **4:** Sterke differentiatie, enkele concurrenten
- **3:** Voldoende onderscheidend, veel concurrenten
- **2:** Zwakke differentiatie
- **1:** Bijna geen differentiatie
- **0:** Commodity, geen unique value

---

### 5. Technical Feasibility (10%)

**Vraag:** Kunnen we dit bouwen met beschikbare resources en tech stack?

**Data sources:**

- Technical architecture review
- Integration complexity assessment
- Team capability analysis

**Scoring guide:**

- **5:** Volledig haalbaar, bestaande tech stack, < 3 maanden
- **4:** Haalbaar, kleine nieuwe dependencies, 3-6 maanden
- **3:** Haalbaar met uitdagingen, 6-12 maanden
- **2:** Grote technische uitdagingen
- **1:** Zeer complex, hoge onzekerheid
- **0:** Technisch niet haalbaar

---

### 6. Channel Viability (10%)

**Vraag:** Kunnen we klanten bereiken via beschikbare kanalen?

**Data sources:**

- Channel test resultaten (Instagram, Google Ads)
- CAC (Customer Acquisition Cost) berekeningen
- Conversion rate data

**Scoring guide:**

- **5:** CAC < €20, conversion >5%, duidelijke schaling
- **4:** CAC €20-€40, conversion 3-5%
- **3:** CAC €40-€60, conversion 1-3%
- **2:** CAC €60-€100, conversion <1%
- **1:** CAC >€100, zeer lage conversion
- **0:** Geen werkende kanalen

---

### 7. Business Model Viability (10%)

**Vraag:** Is het business model winstgevend en schaalbaar?

**Data sources:**

- Unit economics berekeningen
- Break-even analysis
- Revenue projections

**Scoring guide:**

- **5:** LTV/CAC >5, contribution margin >60%
- **4:** LTV/CAC 3-5, contribution margin 40-60%
- **3:** LTV/CAC 2-3, contribution margin 20-40%
- **2:** LTV/CAC 1-2, contribution margin 10-20%
- **1:** LTV/CAC <1, contribution margin <10%
- **0:** Fundamenteel niet winstgevend

---

### 8. Team & Execution Capability (10%)

**Vraag:** Heeft het team de skills en capaciteit om dit uit te voeren?

**Data sources:**

- Team skill assessment
- Resource availability
- Past execution track record

**Scoring guide:**

- **5:** Alle benodigde skills in-house, full-time focus mogelijk
- **4:** Meeste skills in-house, 80%+ capaciteit
- **3:** Enkele skills gaps, 50-80% capaciteit
- **2:** Significante skill gaps, <50% capaciteit
- **1:** Grote skill gaps, zeer beperkte capaciteit
- **0:** Team niet geschikt voor deze opdracht

---

## Beslissingsregels

### Gewogen Score Berekening

```
Totaal Score = Σ (Criterium Score × Gewicht)

Maximum mogelijk: 5.0
Minimum voor GO: 3.5
```

### GO/NO-GO Thresholds

| Totale Score | Beslissing                  | Actie                                                |
| ------------ | --------------------------- | ---------------------------------------------------- |
| **≥4.0**     | **STRONG GO**               | Volledige commitment, investeer maximaal             |
| **3.5-3.9**  | **GO (met monitoring)**     | Proceed, maar monitor kritieke metrics               |
| **3.0-3.4**  | **CONDITIONAL GO**          | Proceed met mitigatie strategie voor zwakke criteria |
| **2.5-2.9**  | **NO-GO (pivot overwegen)** | Te veel risico's, overweeg pivot                     |
| **<2.5**     | **STRONG NO-GO**            | Stop, fundamentele problemen                         |

### Hard Blockers (automatische NO-GO)

Ongeacht totale score, de beslissing is **NO-GO** als:

1. **Problem Validation < 3** (te weinig bewijs van probleem)
2. **Willingness to Pay < 2** (klanten niet bereid te betalen)
3. **SOM < €500K** (markt te klein)

---

## Risico Categorieën

Bij **GO beslissing**, identificeer risico's per categorie:

### Hoog Risico (score 0-2 op criterium)

- Directe actie vereist
- Mitigatie plan binnen 30 dagen
- Blokkerende risico's voor launch

### Medium Risico (score 2-3)

- Monitoring vereist
- Mitigatie plan binnen 60 dagen
- Vertragend risico

### Laag Risico (score 3+)

- Reguliere monitoring
- Opportunistische verbetering

---

## 90-Dagen Plan Template (bij GO)

Bij een **GO beslissing** moet het volgende worden uitgewerkt:

1. **Fase 1 (Maand 1): MVP Development**
   - Technische implementatie
   - Core features only
   - Alpha testing setup

2. **Fase 2 (Maand 2): Beta Launch**
   - Beta user recruitment
   - Feedback loops
   - Iteratie op basis van data

3. **Fase 3 (Maand 3): Public Launch**
   - Marketing campagne
   - Channel scaling
   - Metrics tracking

**Key Milestones:**

- Week 4: MVP feature-complete
- Week 8: Beta met 50+ users
- Week 12: Public launch met 200+ orders

**Budget Allocation:**

- Development: 40%
- Marketing: 40%
- Operations: 20%

---

## Output Format

Het framework genereert een **Validation Report** (zie `templates/validation-report.md`) met:

- Executive Summary (GO/NO-GO + rationale)
- Detailed Scoring per criterium
- Risk Analysis (hoog/medium/laag risico's)
- 90-dagen plan (bij GO)
- Appendix met data sources

---

**Document Versie:** 1.0
**Laatst Bijgewerkt:** 2026-02-09
**Eigenaar:** Product Team VINO12
