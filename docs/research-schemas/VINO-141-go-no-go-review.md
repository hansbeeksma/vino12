# VINO-141: Go/No-Go Review (Gewogen Scoring Matrix)

> **Parent**: VINO-132 | **Doorlooptijd**: 1 week | **Bronnen**: 60 Perplexity citaties
> **Doel**: Data-gedreven launch beslissing op basis van alle validatieresultaten

---

## 1. Wanneer Uitvoeren

De Go/No-Go review is het **laatste** punt in de validatiepiramide. Alle eerdere stappen moeten afgerond zijn:

| Prerequisite                       | VINO Issue | Status |
| ---------------------------------- | ---------- | ------ |
| JTBD Interviews afgerond (10x)     | VINO-134   | [ ]    |
| Pricing validation compleet        | VINO-138   | [ ]    |
| Concierge MVP afgerond (10 orders) | VINO-139   | [ ]    |
| Channel test afgerond (2-4 weken)  | VINO-140   | [ ]    |

---

## 2. Gewogen Scoring Matrix

### 8 Criteria met Gewichten

| #   | Criterium                                | Gewicht  | Score (1-5) | Gewogen       |
| --- | ---------------------------------------- | -------- | ----------- | ------------- |
| 1   | **Klantvraag & Marktvalidatie**          | 20%      | \_          | \_            |
| 2   | **Unit Economics & Winstgevendheid**     | 18%      | \_          | \_            |
| 3   | **Concurrentiepositie & Differentiatie** | 12%      | \_          | \_            |
| 4   | **Product-Market Fit Signalen**          | 15%      | \_          | \_            |
| 5   | **Operationele Gereedheid**              | 10%      | \_          | \_            |
| 6   | **Technische Infrastructuur**            | 8%       | \_          | \_            |
| 7   | **Regelgeving & Compliance**             | 7%       | \_          | \_            |
| 8   | **Financiële Runway**                    | 10%      | \_          | \_            |
|     | **TOTAAL**                               | **100%** |             | **\_ / 5.00** |

---

## 3. Scoringsrichtlijnen per Criterium

### Criterium 1: Klantvraag & Marktvalidatie (20%)

| Score | Definitie                                   | Bewijslast                                                   |
| ----- | ------------------------------------------- | ------------------------------------------------------------ |
| **5** | Sterke pull, duidelijke JTBD, hoge urgentie | NPS +50, 8+ opportunity scores, 80%+ herhaalaankoop intentie |
| **4** | Goede vraag, duidelijke jobs                | NPS +30-49, 6-8 opportunity scores, 60-80% herhaalaankoop    |
| **3** | Matige vraag, sommige jobs resoneren        | NPS +10-29, 4-6 opportunity scores, 40-60% herhaalaankoop    |
| **2** | Zwakke signalen, onduidelijke jobs          | NPS 0-9, <4 opportunity scores, <40% herhaalaankoop          |
| **1** | Geen bewijs van vraag                       | Negatieve NPS, lage engagement, geen herhaalaankoop          |

**Data bronnen**: VINO-134 (JTBD interviews), VINO-139 (Concierge MVP feedback)

### Criterium 2: Unit Economics & Winstgevendheid (18%)

| Score | Definitie                         | Bewijslast                                                   |
| ----- | --------------------------------- | ------------------------------------------------------------ |
| **5** | Sterke unit economics, hoge marge | Brutomarge >50%, LTV/CAC >5:1, break-even <6 maanden         |
| **4** | Gezonde economics                 | Brutomarge 40-50%, LTV/CAC 3:1-5:1, break-even 6-12 maanden  |
| **3** | Marginaal winstgevend             | Brutomarge 30-40%, LTV/CAC 2:1-3:1, break-even 12-18 maanden |
| **2** | Verliesgevend maar pad naar winst | Brutomarge 20-30%, LTV/CAC 1:1-2:1, break-even >18 maanden   |
| **1** | Structureel verliesgevend         | Brutomarge <20%, LTV/CAC <1:1, geen pad naar break-even      |

**Data bronnen**: VINO-139 (unit economics), VINO-138 (pricing), VINO-140 (CAC)

### Criterium 3: Concurrentiepositie & Differentiatie (12%)

| Score | Definitie                   | Bewijslast                                              |
| ----- | --------------------------- | ------------------------------------------------------- |
| **5** | Unieke positie, sterke moat | Geen directe concurrent in NL Italiaans premium segment |
| **4** | Duidelijke differentiatie   | 2-3 USPs die concurrenten niet bieden                   |
| **3** | Enige differentiatie        | 1 duidelijke USP, rest vergelijkbaar                    |
| **2** | Nauwelijks onderscheidend   | Me-too product, prijs als enige onderscheider           |
| **1** | Volledig inwisselbaar       | Geen USP, lagere kwaliteit dan bestaande opties         |

**Data bronnen**: VINO-138 (concurrentiebenchmark), VINO-134 (klantperceptie)

### Criterium 4: Product-Market Fit Signalen (15%)

| Score | Definitie           | Bewijslast                                                          |
| ----- | ------------------- | ------------------------------------------------------------------- |
| **5** | Sterke PMF          | Sean Ellis test >40% "zeer teleurgesteld", organische mond-tot-mond |
| **4** | Goede PMF signalen  | 25-40% "zeer teleurgesteld", spontane aanbevelingen                 |
| **3** | Vroege PMF signalen | 15-25% "zeer teleurgesteld", herhaalaankoop >50%                    |
| **2** | Zwakke PMF          | <15% "zeer teleurgesteld", lage retentie                            |
| **1** | Geen PMF            | Geen organische groei, hoog churn                                   |

**Data bronnen**: VINO-139 (NPS, herhaalaankoop), VINO-134 (kwalitatief)

### Criterium 5: Operationele Gereedheid (10%)

| Score | Definitie             | Bewijslast                                                   |
| ----- | --------------------- | ------------------------------------------------------------ |
| **5** | Volledig operationeel | Leverancier contracten, fulfillment partner, <24u verwerking |
| **4** | Grotendeels gereed    | Leverancier bevestigd, fulfillment plan, <48u verwerking     |
| **3** | Basis operationeel    | Handmatig fulfillment werkend, <72u verwerking               |
| **2** | In opbouw             | Leverancier in gesprek, geen fulfillment partner             |
| **1** | Niet gereed           | Geen leverancier, geen fulfillment plan                      |

**Data bronnen**: VINO-139 (concierge MVP operationele ervaring)

### Criterium 6: Technische Infrastructuur (8%)

| Score | Definitie                  | Bewijslast                                                   |
| ----- | -------------------------- | ------------------------------------------------------------ |
| **5** | Volledig gebouwd en getest | Alle Tier 1+2 features live, geen kritieke bugs, CI/CD green |
| **4** | Functioneel compleet       | Core features werken, minor bugs, tests >80%                 |
| **3** | MVP functioneel            | Catalog + cart + checkout + betaling werken                  |
| **2** | Gedeeltelijk werkend       | Sommige flows broken, veel bugs                              |
| **1** | Niet functioneel           | Kritieke flows niet werkend                                  |

**Data bronnen**: VINO12 codebase (131/131 issues Done), CI/CD status

### Criterium 7: Regelgeving & Compliance (7%)

| Score | Definitie             | Bewijslast                                                |
| ----- | --------------------- | --------------------------------------------------------- |
| **5** | Volledig compliant    | 18+ gate, GDPR, cookie consent, alcohol reclame code, KvK |
| **4** | Grotendeels compliant | 1 minor item ontbreekt                                    |
| **3** | Basis compliant       | Core vereisten gedekt, edge cases open                    |
| **2** | Deels compliant       | Belangrijke gaps                                          |
| **1** | Niet compliant        | Kritieke vereisten ontbreken                              |

**Data bronnen**: VINO12 codebase (AgeGate, CookieConsent, GDPR endpoints)

### Criterium 8: Financiële Runway (10%)

| Score | Definitie           | Bewijslast                                     |
| ----- | ------------------- | ---------------------------------------------- |
| **5** | >12 maanden runway  | Voldoende kapitaal voor marketing + operations |
| **4** | 6-12 maanden runway | Comfortabel, enige reserves                    |
| **3** | 3-6 maanden runway  | Krap, moet snel revenue genereren              |
| **2** | 1-3 maanden runway  | Kritiek, onmiddellijke revenue nodig           |
| **1** | <1 maand runway     | Onhoudbaar zonder investering                  |

**Data bronnen**: Financiële planning, bankrekening, investering

---

## 4. Beslissingsdrempels

### Totaalscore Interpretatie

| Score         | Beslissing            | Actie                               |
| ------------- | --------------------- | ----------------------------------- |
| **4.0 - 5.0** | **GO**                | Launch binnen 30 dagen              |
| **3.0 - 3.9** | **CONDITIONAL GO**    | Launch met mitigaties (zie §5)      |
| **2.0 - 2.9** | **CONDITIONAL NO-GO** | Pivot of terugkeer na verbeteringen |
| **1.0 - 1.9** | **NO-GO**             | Stop, fundamenteel heroverwegen     |

### Kill Criteria (Ongeacht Totaalscore)

Elk van deze criteria resulteert in automatisch NO-GO:

| Kill Criterium                    | Drempel                |
| --------------------------------- | ---------------------- |
| NPS                               | < 0 (negatief)         |
| Brutomarge                        | < 20%                  |
| Geen enkele herhaalaankoop (0/10) | 0%                     |
| CAC > €100 op beide kanalen       | Structureel onhoudbaar |
| Wettelijke blokkade               | Compliance showstopper |
| < 1 maand runway                  | Financieel onhoudbaar  |

---

## 5. Conditional Go Framework

Als score 3.0-3.9: lanceer met **mitigaties** en **milestones**.

### 30-60-90 Dagen Milestones

| Dag    | Milestone                      | Success Metric                | Fail =                   |
| ------ | ------------------------------ | ----------------------------- | ------------------------ |
| **30** | 50 orders verwerkt             | Operationeel werkend          | Pause + fix operations   |
| **30** | CAC < €50 op winning channel   | Marketing schaalbaar          | Pivot kanaalstrategie    |
| **30** | NPS > +20                      | Basisniveau klanttevredenheid | Product review           |
| **60** | 100 orders, 20% herhaalaankoop | Retentie bewezen              | Retentie-interventie     |
| **60** | Brutomarge > 35%               | Unit economics gezond         | Pricing/COGS herziening  |
| **90** | €10K maandomzet                | Revenue traction              | Fundamentele pivot       |
| **90** | 50 email subscribers           | Organisch kanaal groeit       | Content strategie review |

### Mitigatie per Zwak Criterium

| Criterium Score < 3   | Mitigatie                                          |
| --------------------- | -------------------------------------------------- |
| Klantvraag laag       | Extra interviews, pivot doelgroep                  |
| Unit economics krap   | COGS heronderhandelen, prijs verhogen, bundels     |
| Concurrentie sterk    | Niche down (alleen Piemonte, alleen natuurwijn)    |
| PMF zwak              | MVP simplificeren, 1-op-1 klantgesprekken          |
| Operations niet klaar | Handmatig blijven tot 50 orders, dan automatiseren |
| Tech niet klaar       | Feature-flag Tier 3+4, launch met Tier 1+2         |
| Compliance gaps       | Juridisch advies inwinnen voor launch              |
| Runway kort           | Pre-orders, crowdfunding, angel investment         |

---

## 6. Bewijsvoering Template

### Per Criterium Documenteren

```yaml
criterium: "1. Klantvraag & Marktvalidatie"
score: 4
gewicht: 20%
gewogen_score: 0.80

bewijs:
  kwantitatief:
    - metric: "NPS"
      waarde: "+38"
      bron: "VINO-139, n=10"
    - metric: "Herhaalaankoop intentie"
      waarde: "70%"
      bron: "VINO-139, feedback survey"
    - metric: "Opportunity Score (top job)"
      waarde: "14.2"
      bron: "VINO-134, n=10"

  kwalitatief:
    - observatie: "8/10 deelnemers noemen 'gemak van expert selectie' als primaire driver"
      bron: "VINO-134 interviews"
    - observatie: "Spontane aanbevelingen aan vrienden (3 gevallen)"
      bron: "VINO-139 WhatsApp feedback"

  risico's:
    - "Sample size (n=10) is klein — validatie bij schaal nodig"
    - "JTBD interviews waren voornamelijk via warm netwerk"

  mitigatie:
    - "Post-launch: survey naar eerste 100 klanten"
    - "Diversifieer wervingskanalen"
```

---

## 7. Stakeholder Review Template

### Review Sessie Agenda (2 uur)

| Tijd | Onderdeel                              | Presenter  |
| ---- | -------------------------------------- | ---------- |
| 0:00 | Context & validatieproces              | Founder    |
| 0:10 | JTBD bevindingen (VINO-134)            | Researcher |
| 0:25 | Pricing resultaten (VINO-138)          | Analyst    |
| 0:40 | Concierge MVP resultaten (VINO-139)    | Operations |
| 0:55 | Channel test resultaten (VINO-140)     | Marketing  |
| 1:10 | **Gewogen scoring matrix walkthrough** | Founder    |
| 1:30 | Open discussie & vragen                | Allen      |
| 1:45 | **Formele Go/No-Go stemming**          | Allen      |
| 1:55 | Vervolgstappen & timeline              | Founder    |

### Stemming

| Optie              | Definitie                                                            |
| ------------------ | -------------------------------------------------------------------- |
| **GO**             | "Ik geloof dat we voldoende bewijs hebben om te lanceren"            |
| **CONDITIONAL GO** | "Ik geloof in de richting maar wil [specifieke conditie] eerst zien" |
| **NO-GO**          | "Ik geloof niet dat we klaar zijn om te lanceren"                    |

Beslissing = meerderheid. Bij gelijkspel: founder beslist.

---

## 8. Risicomatrix

### Identificeer Top 5 Risico's

| #   | Risico                         | Impact (1-5) | Kans (1-5) | Score | Mitigatie                               |
| --- | ------------------------------ | ------------ | ---------- | ----- | --------------------------------------- |
| 1   | Te lage herhaalaankoop         | 5            | 3          | 15    | Subscription model, loyalty programma   |
| 2   | CAC te hoog voor schaal        | 4            | 3          | 12    | Organisch kanaal focus, email marketing |
| 3   | Leverancier onbetrouwbaar      | 4            | 2          | 8     | Backup leverancier, voorraad buffer     |
| 4   | Bezorgschade (kapotte flessen) | 3            | 3          | 9     | Betere verpakking, verzekering          |
| 5   | Regelgeving verandering        | 3            | 1          | 3     | Juridisch advies, compliance monitoring |

**Actie**: Score > 12 = mitigatie plan verplicht voor launch.

---

## 9. Output Document

### Go/No-Go Rapport Structuur

```
VINO12 GO/NO-GO RAPPORT
Datum: [datum]
Versie: 1.0

1. EXECUTIVE SUMMARY
   - Beslissing: [GO / CONDITIONAL GO / NO-GO]
   - Totaalscore: [X.XX / 5.00]
   - Key finding: [1 zin]

2. GEWOGEN SCORING MATRIX
   [Tabel uit §2]

3. BEWIJSVOERING PER CRITERIUM
   [§6 template × 8 criteria]

4. KILL CRITERIA CHECK
   [§4 tabel - alle passed/failed]

5. RISICOMATRIX
   [§8 tabel]

6. CONDITIONAL MILESTONES (indien van toepassing)
   [§5 tabel]

7. LAUNCH PLAN (indien GO)
   - Datum: [target launch date]
   - Budget eerste 90 dagen: [€X]
   - Winning channel: [Instagram / Google / Both]
   - Pricing: [uit VINO-138 resultaat]

8. APPENDICES
   A. JTBD Interview Samenvattingen (VINO-134)
   B. Pricing Analysis Charts (VINO-138)
   C. Concierge MVP Data (VINO-139)
   D. Channel Test Performance Data (VINO-140)
```

---

## 10. Checklist

- [ ] Alle 4 prerequisite issues afgerond (VINO-134/138/139/140)
- [ ] Data uit alle issues verzameld in één overzicht
- [ ] Gewogen scoring matrix ingevuld (8 criteria)
- [ ] Kill criteria gecheckt (geen automatische NO-GO)
- [ ] Bewijsvoering per criterium gedocumenteerd
- [ ] Risicomatrix ingevuld (top 5)
- [ ] Stakeholder review sessie gepland
- [ ] Formele stemming uitgevoerd
- [ ] Go/No-Go rapport geschreven
- [ ] Bij GO: launch plan met 30-60-90 milestones
- [ ] Bij CONDITIONAL GO: mitigaties gedefinieerd
- [ ] Bij NO-GO: pivot plan of stop beslissing
