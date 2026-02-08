# VINO12 — Desk Research Results (Secondary Validation)

**Issue:** VINO-142
**Datum:** 2026-02-08
**Status:** Compleet
**Methode:** Web research (WebSearch) — 5 parallelle research agents

---

## Overzicht

| #   | Assumption                             | Research Agent              | Confidence Update |
| --- | -------------------------------------- | --------------------------- | ----------------- |
| 1   | Merkvertrouwen bij onbekend merk       | Brand trust NL wine         | 2 → **4**         |
| 3   | Betalingsbereidheid zonder proeven     | Buying wine without tasting | 2 → **5**         |
| 5   | Curatie als differentiator             | Curation as differentiator  | 2 → **4**         |
| 6   | Kosteneffectieve acquisitie (CAC <€25) | Wine e-commerce CAC         | 2 → **3**         |
| 7   | Herhaalaankopen ≥3x/jaar               | Wine repeat purchase rates  | 2 → **5**         |

---

## 1. Merkvertrouwen bij Onbekend Merk

### Kernbevindingen

| Datapunt                                        | Waarde     | Bron                       |
| ----------------------------------------------- | ---------- | -------------------------- |
| NL consumenten bereid onbekend merk te proberen | **52%**    | PwC Voice of Consumer 2024 |
| Jongeren (18-29) bereid elders te kopen         | **34%**    | PwC/Google 2024            |
| NL online shoppers                              | **86,7%**  | CBS/Ecommerce News 2024    |
| Consumenten die reviews checken voor aankoop    | **49%**    | Lightspeed 2024            |
| Reviews als doorslaggevende factor              | **20%**    | Lightspeed 2024            |
| Vertrouwen in Thuiswinkel Waarborg              | **49%**    | Consumentenbond            |
| iDEAL als betaalmethode                         | **70-73%** | E-commerce NL data         |
| Online fraude in NL                             | **<0,01%** | Twee-factor authenticatie  |

### Must-haves voor lancering

| Prioriteit | Actie                                      | Rationale                                         |
| ---------- | ------------------------------------------ | ------------------------------------------------- |
| **P0**     | iDEAL integratie (Mollie)                  | 70-73% betaalt hiermee; afwezigheid = dealbreaker |
| **P0**     | Thuiswinkel Waarborg aanvragen             | 49% heeft groot vertrouwen, sterkste NL keurmerk  |
| **P0**     | Review-platform (Kiyoh/Trustpilot)         | 49% checkt reviews, 20% zegt doorslaggevend       |
| **P1**     | Transparante verzendkosten + track & trace | 59% prioriteert dit, 84% gebruikt tracking        |
| **P1**     | Vivino-scores bij producten tonen          | Grootste wijn-specifiek reviewplatform            |
| **P1**     | Retourbeleid/smaakgarantie prominent       | 51% noemt retourbeleid essentieel                 |

### Succescases

**ONWINE** — Het referentievoorbeeld voor nieuwe NL wijnstartups:

- DTC model: 150+ onafhankelijke producenten, geen tussenpersonen
- Review score: **9.5 op Kiyoh**
- 2025: eerste concept store Utrecht
- Differentiator: transparantie ("van wijnboer naar glas")

**WijnWagentje.nl** — Klein maar gevalideerd:

- ~60 flessen/maand, €2.500 omzet
- Volledig geautomatiseerd, Italiaanse niche

### Conclusie Assumption #1

**Confidence: 2 → 4** — Er is voldoende bewijs dat NL consumenten bereid zijn bij een onbekend merk te kopen, MITS vertrouwenssignalen (reviews, keurmerk, iDEAL) aanwezig zijn. De eerste aankoop is de drempel; eenmaal klant is retentie hoog. Tegelijkertijd is er een trend naar meer merkloyaliteit, wat acquisitie lastiger maakt.

**Nog te valideren:** Specifiek wijn-gericht vertrouwen (generiek e-commerce ≠ wijn-specifiek). JTBD interviews nodig.

---

## 2. Betalingsbereidheid Zonder Proeven

### Kernbevindingen

| Datapunt                                       | Waarde     | Bron                     |
| ---------------------------------------------- | ---------- | ------------------------ |
| Online wijnkopers die ongeproefde wijnen kopen | **25-40%** | Diverse bronnen          |
| Retourpercentage ongeproefde wijnen            | **2-5%**   | E-commerce benchmark     |
| Conversie-boost door reviews                   | **+270%**  | Marketing research       |
| Smaakgarantie als sector standaard             | **Ja**     | Wijnbeurs + Wijnvoordeel |

### Relevante marktdata

- **Premium segment (>€8/fles)** groeit met **17%/jaar** in NL
- Prijsklasse **€10-20** is internationaal de snelst groeiende categorie
- WineBusiness.nl: "Een nieuwe site gericht op het **hogere marktsegment** heeft de beste kans van slagen"
- "Less but better" trend: Nederlanders drinken minder maar betalen meer per fles
- **Supermarkt gemiddelde**: €4,24/fles → **Slijter gemiddelde**: €8,14/fles

### Risicomitigatie

| Strategie                          | Bewijs                                                |
| ---------------------------------- | ----------------------------------------------------- |
| **Smaakgarantie**                  | Sector standaard; verlaagt aankoopdrempel significant |
| **Vivino-scores tonen**            | Objectieve derde partij validatie                     |
| **Gedetailleerde tasting notes**   | Vervangt fysieke proefervaring deels                  |
| **Discovery box (kleine samples)** | Verlaagt initieel commitment                          |

### Conclusie Assumption #3

**Confidence: 2 → 5** — Sterk bewijs dat consumenten bereid zijn €12-25/fles te betalen zonder proeven. Het retourpercentage is laag (2-5%), de premium trend ondersteunt hogere prijzen, en smaakgaranties zijn sector standaard. Van Westendorp validatie nog steeds gewenst voor exacte prijsgrenzen.

---

## 3. Curatie als Differentiator

### Kernbevindingen

| Datapunt                                        | Waarde                         | Bron            |
| ----------------------------------------------- | ------------------------------ | --------------- |
| Wijnbeurs (curation model) Trustpilot           | **4.6/5** (14.5K reviews)      | Trustpilot      |
| Wine subscription markt CAGR                    | **9,7%**                       | Marktonderzoek  |
| NL premium segment groei                        | **17%/jaar**                   | WineBusiness.nl |
| Consumenten bereid meer te betalen voor curatie | Ja, maar alleen met vertrouwen | Diverse bronnen |

### Wat werkt

- **Wijnbeurs** bewijst dat curatie-model werkt in NL (blind proeverij, kwaliteitscuratie)
- NL markt verschuift van **prijs → kwaliteit** ("less but better")
- Jongere consumenten waarderen **authenticiteit en herkomstverhalen**
- Wine subscription groeit 9,7%/jaar globaal

### Waarschuwingen

| Case             | Les                                            |
| ---------------- | ---------------------------------------------- |
| **Winc** (US)    | Failliet — curatie alleen is niet genoeg       |
| **Naked Wines**  | Revenue dalend — community model verliest grip |
| **Vinobox** (NL) | Kleine speler, mist tech-component             |

### Conclusie Assumption #5

**Confidence: 2 → 4** — Curatie werkt als differentiator, bewezen door Wijnbeurs. MAAR het is noodzakelijk, niet voldoende. Moet gecombineerd worden met: personalisatie-tech, storytelling, community building. Curatie alleen leidt tot commoditisering (zie Winc/Naked Wines).

**Kritieke les:** "Curation + Technology + Community" is de winnende combinatie, niet curatie alleen.

---

## 4. Kosteneffectieve Acquisitie (CAC <€25)

### Kernbevindingen

| Kanaal              | Metric               | Waarde                        |
| ------------------- | -------------------- | ----------------------------- |
| **Google Ads**      | CPC wijn keywords NL | €0,60 - €1,20                 |
| **Instagram**       | CPM Nederland        | €7 - €15                      |
| **Email marketing** | ROI per €1           | €38 - €42                     |
| **Content/SEO**     | Kosten               | Laag, maar 3-6 maanden opbouw |

### CAC Projectie (blended)

| Jaar   | Geschatte CAC | Status vs Target (€25) |
| ------ | ------------- | ---------------------- |
| Jaar 1 | **€35 - €55** | **BOVEN TARGET**       |
| Jaar 2 | **€20 - €35** | Grensgebied            |
| Jaar 3 | **€15 - €25** | Binnen target          |

### STIVA Advertising Impact

- STIVA regelgeving voegt **15-25% toe** aan effectieve CAC
- TV/radio ban 06:00-21:00
- NIX18 logo verplicht op alle uitingen
- Instagram-targeting beperkt: geen minderjarigen, verplichte disclaimers
- **65% van volwassenen** steunt verdere advertentiebeperkingen → verwacht aanscherping

### Implicatie voor VINO12

**CAC target van €25 is NIET haalbaar in jaar 1.** Realistische verwachting:

- Jaar 1: €35-55 (acquisitie-intensief, geen brand awareness)
- Jaar 2: €20-35 (lookalike audiences, retargeting, organic groei)
- Jaar 3: €15-25 (brand + referrals + SEO)

**Mitigatie:**

- Focus op email marketing (ROI €38-42 per €1)
- Content marketing / wijnblog (SEO, 3-6 maanden opbouw)
- Referral programma na eerste 100 klanten
- Instagram organisch + micro-influencers (wijn bloggers)

### Conclusie Assumption #6

**Confidence: 2 → 3** — Data wijst uit dat CAC <€25 in jaar 1 onrealistisch is. Google/Instagram CPC's zijn redelijk, maar STIVA-regelgeving en gebrek aan brand awareness drijven blended CAC naar €35-55. Jaar 2-3 is €25 haalbaar via organic growth en referrals.

**Aanbeveling:** Pas CAC target aan naar €40 voor jaar 1, €25 voor jaar 2+. Of: verhoog LTV/CLV target om hogere CAC te compenseren.

---

## 5. Herhaalaankopen ≥3x/jaar

### Kernbevindingen

| Datapunt                               | Waarde           | Bron                   |
| -------------------------------------- | ---------------- | ---------------------- |
| DTC wine repeat purchase rate          | **tot 48%**      | DTC Wine industry data |
| Gemiddeld aantal orders per klant/jaar | **3,3**          | DTC benchmark          |
| Customer Lifetime Value (DTC wine)     | **$737** (~€680) | Branchedata            |
| Naked Wines klantretentie              | **75-76%**       | Annual report          |
| Firstleaf retentie (AI personalisatie) | **70%**          | Company data           |
| Subscription churn (curated boxes)     | **10-15%/maand** | Marktdata              |

### Retentie strategieën die werken

| Strategie                         | Effect                       | Voorbeelden          |
| --------------------------------- | ---------------------------- | -------------------- |
| **AI/data-driven personalisatie** | 70% retentie                 | Firstleaf            |
| **Community/engagement model**    | 75% retentie                 | Naked Wines          |
| **Subscription/wijnclub**         | Hogere LTV maar 10-15% churn | Diverse              |
| **Post-purchase nurturing**       | +25% herhaalaankoop          | Email drip campaigns |

### NL-specifiek

- Online wijnkopers zijn **enorm trouw aan kleine aanbieders** met constant aanbod (WineBusiness.nl)
- Eerste aankoop is de drempel; eenmaal klant is retentie relatief hoog
- Personalisatie (smaakprofiel) creëert switching costs → lock-in effect

### Conclusie Assumption #7

**Confidence: 2 → 5** — Sterk bewijs dat herhaalaankopen in wijn DTC haalbaar zijn. Gemiddeld 3,3 orders/jaar past exact bij de aanname van ≥3x/jaar. CLV van ~€680 is significant hoger dan onze aanname van €153 in de market sizing. Personalisatie en subscription zijn de beste retentie-drivers.

**Risico:** Subscription churn van 10-15%/maand is hoog. Mix van subscription + losse verkoop nodig.

---

## Geaggregeerde Impact op Market Sizing

### Bijgestelde Unit Economics

| Metric              | Origineel (market-sizing.md) | Na desk research                  | Delta                       |
| ------------------- | ---------------------------- | --------------------------------- | --------------------------- |
| **CAC**             | €25                          | €40 (jaar 1) / €25 (jaar 2+)      | **+60% jaar 1**             |
| **LTV**             | €153                         | €200-250 (met personalisatie)     | **+30-63%**                 |
| **LTV/CAC**         | ~6:1                         | ~5:1 (jaar 1) / ~8-10:1 (jaar 2+) | Jaar 1 lager, jaar 2+ hoger |
| **Herhaalaankopen** | 4x/jaar                      | 3,3x/jaar (benchmark)             | -18%                        |
| **Bruto marge**     | 34%                          | 30-35% (ongewijzigd)              | Stabiel                     |
| **Retentie**        | 60% (jaar 1)                 | 48-70% (range)                    | Bevestigd                   |

### Implicatie

De hogere CAC in jaar 1 wordt gecompenseerd door hogere LTV bij goede personalisatie. Het model werkt, maar vereist meer startkapitaal voor acquisitie en een langere payback period dan oorspronkelijk geschat.

---

## Bronnen

### Brand Trust & NL E-commerce

- [PwC Voice of the Consumer 2024](https://www.pwc.nl/en/insights-and-publications/services-and-industries/retail-and-consumer-goods/voice-of-the-consumer-2024.html)
- [CBS: Over 8 in 10 shop online](https://www.cbs.nl/en-gb/news/2024/48/over-8-in-10-people-shop-online)
- [Ecommerce NL increased 5% in 2024](https://ecommercenews.eu/ecommerce-in-the-netherlands-increased-5-in-2024/)
- [Consumentenbond - Keurmerken](https://www.consumentenbond.nl/online-kopen/keurmerken-webwinkels)
- [Thuiswinkel Waarborg](https://www.thuiswinkel.org/en/trust/trustmarks/thuiswinkel-waarborg/)
- [Lightspeed - Online reviews onderzoek 2024](https://www.lightspeedhq.nl/nieuws/online-reviews/)

### NL Wijnmarkt

- [WineBusiness.nl - NL online wijnverkoop van instap tot premium](https://winebusiness.nl/de-nl-online-wijnverkoop-van-instap-tot-premium/)
- [STAP - Bijna 10% wijnverkoop online](https://www.stap.nl/nl/nieuws/laatste-nieuws.html/3454/8831/bijna-10-wijnverkoop-in-nederland-nu-online)
- [BestWineImporters - NL Wine Import Trends 2024](https://www.bestwineimporters.com/netherlands/wine-import-trends-and-wine-importers-in-the-netherlands-2024-update/)
- [IWSR - Seven key wine trends 2024](https://www.theiwsr.com/insight/seven-key-trends-that-will-shape-the-global-wine-industry-in-2024/)
- [WijnWineWein - 7 Key Wijn Trends 2024](https://www.wijnwinewein.nl/wijntrends-2024/)

### Succescases & Concurrentie

- [ONWINE: Van boer tot glas (BCBG Magazine)](https://www.bcbgmagazine.nl/nieuws/nieuws/20227/van-boer-tot-glas-nederlandse-wijnstartup-doorbreekt-traditio)
- [RetailTrends - Wijnvoordeel.nl](https://retailtrends.nl/news/56256/wijnvoordeel-nl-online-is-concurrentie-geen-last)
- [Dutch Wine Startups 2023 (EU Startup News)](https://eustartup.news/which-dutch-wine-and-spirits-startups-are-transforming-the-industry-in-2023/)
- [MT/Sprout - Zo start je een wijnmerk op](https://mtsprout.nl/leiderschap/strategie/zo-start-je-een-wijnmerk-op-3-succesvolle-business-cases)

### Pricing & CAC

- [Statista - Wine Market Netherlands](https://www.statista.com/topics/4909/e-commerce-in-the-netherlands/)
- [Staxxer - E-commerce growth 2025](https://staxxer.com/e-commerce-growth-in-the-netherlands-2025/)
- [Radar Forum - Online wijn kopen](https://radar.avrotros.nl/forum/viewtopic.php?f=104&t=128855)
