# VINO12 — Assumption Map

**Datum:** 2026-02-08
**Product:** VINO12 — Wine e-commerce webshop met dropship fulfillment
**Doelgroep:** NL wijnliefhebbers, 25-55 jaar, premium segment (€10+/fles)

## Methode

ICE scoring: Impact × (11 - Confidence) × Ease

- **Impact** (1-10): Als deze aanname fout is, hoe fataal voor het product?
- **Confidence** (1-10): Hoe zeker zijn we dat dit klopt? (laag = riskant)
- **Ease** (1-10): Hoe makkelijk te testen?

---

## Top 10 Riskiest Assumptions

| #   | Aanname                                                                                                                            | Domein       | Impact | Confidence | Ease | RAT Score | Test Methode                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | ---------- | ---- | --------- | ---------------------------------------------- |
| 1   | NL wijnliefhebbers willen online premium wijn kopen bij een onbekend merk ipv bij vertrouwde retailers (Gall&Gall, lokale slijter) | Doelgroep    | 10     | **4** ⬆️   | 8    | **560**   | JTBD interviews + landing page test            |
| 2   | Dropship fulfillment kan dezelfde kwaliteitservaring leveren als directe verkoop (temperatuurcontrole, verpakking, levertijd)      | Oplossing    | 9      | 3          | 6    | 432       | Concierge MVP + mystery shopping               |
| 3   | Klanten zijn bereid €12-25/fles te betalen voor curated selectie zonder fysiek proeven                                             | Verdienmodel | 9      | **5** ⬆️   | 7    | **378**   | Pricing page test + Van Westendorp             |
| 4   | Er is voldoende margin in dropship model (inkoop + fulfillment + marketing < verkoopprijs) voor winstgevende unit economics        | Verdienmodel | 10     | 3          | 5    | 400       | Supplier gesprekken + P&L model                |
| 5   | Wijn-aanbevelingen/curatie is een sterk genoeg differentiator vs prijs-concurrenten (wijnvoordeel.nl) en marketplace (Vivino)      | Oplossing    | 8      | **4** ⬆️   | 7    | **392**   | Landing page A/B test (3 value props)          |
| 6   | We kunnen wijnliefhebbers kosteneffectief bereiken via Instagram en Google Ads (CAC < €25)                                         | Kanaal       | 8      | **3** ⬆️   | 8    | **512**   | Channel test (€500-1000 budget)                |
| 7   | Herhaalaankopen zijn hoog genoeg voor gezonde LTV (≥3 bestellingen/jaar)                                                           | Verdienmodel | 9      | **5** ⬆️   | 5    | **270**   | Concierge MVP retentie tracking                |
| 8   | Leeftijdsverificatie (18+) is geen significante conversie-killer in het bestelproces                                               | Technisch    | 6      | 4          | 7    | 294       | A/B test met/zonder 18+ gate                   |
| 9   | Nederlandse markt is groot genoeg (SOM >€500K/jaar) voor een niche premium online wijnshop                                         | Doelgroep    | 7      | **5** ⬆️   | 8    | **336**   | Market sizing (CBS, Statista, Thuiswinkel.org) |
| 10  | Abonnement/wijnclub model genereert meer LTV dan losse verkoop                                                                     | Verdienmodel | 7      | 3          | 6    | 336       | Pricing validation + pre-order test            |

---

## Volledige Assumption Lijst (gesorteerd op RAT score)

### Tier 1: Kritiek (RAT ≥500) — EERST TESTEN

**#1 — Merkvertrouwen bij onbekend merk (RAT: 560, was 720)**

- **Aanname:** NL wijnliefhebbers zijn bereid om premium wijn te kopen bij een nieuw, onbekend online merk
- **Risico:** Wijn is een vertrouwensproduct. Consumenten leunen sterk op bekende merken, fysieke winkels, en persoonlijk advies
- **Desk research (2026-02-08):** 52% NL consumenten probeert onbekend merk bij goede value; Thuiswinkel Waarborg (49% vertrouwen), iDEAL (70-73%) en reviews (49% checkt) zijn must-haves. ONWINE bewijst dat nieuwe wijnstartups succesvol kunnen zijn (9.5 Kiyoh)
- **Confidence:** 2 → **4** — Positief bewijs, maar wijn-specifiek vertrouwen nog niet gevalideerd
- **Test:** JTBD interviews + landing page conversie test (nog nodig)
- **Kill criterion:** <3/10 interviewees tonen interesse, landing page signup <5%

**#6 — Kosteneffectieve acquisitie (RAT: 512, was 576)**

- **Aanname:** CAC via Instagram/Google Ads < €25
- **Risico:** STIVA regelgeving (+15-25% CAC), hoge CPM in wijn/food niche, sterke concurrentie
- **Desk research (2026-02-08):** Google CPC €0,60-1,20, Instagram CPM €7-15 NL. Maar blended CAC jaar 1: **€35-55** (boven target!). STIVA voegt 15-25% toe. Jaar 2-3 is €25 haalbaar via organic + referrals
- **Confidence:** 2 → **3** — CAC <€25 jaar 1 onrealistisch; target bijstellen naar €40
- **Test:** 2-kanaal test met elk €500 budget, meet CAC per kanaal
- **Kill criterion:** CAC > €40 op beide kanalen (was €25, bijgesteld)

### Tier 2: Belangrijk (RAT 300-499) — NA TIER 1

**#2 — Dropship kwaliteit (RAT: 432)**

- **Aanname:** Fulfillment partner levert zelfde kwaliteit als eigen voorraad
- **Test:** 10-20 testbestellingen, meet levertijd, verpakking, temperatuur, schade

**#4 — Unit economics dropship (RAT: 400)**

- **Aanname:** Margin is voldoende (bruto marge ≥30%)
- **Test:** Supplier gesprekken, bereken volledige kostprijs incl. fulfillment, marketing, retour

**#5 — Curatie als differentiator (RAT: 392, was 504)**

- **Aanname:** "Door sommeliers geselecteerd" is een sterkere propositie dan "laagste prijs" of "grootste assortiment"
- **Desk research (2026-02-08):** Wijnbeurs bewijst curatie (4.6/5 Trustpilot, 14.5K reviews). Wine subscription CAGR 9,7%. MAAR: curatie alleen niet voldoende (Winc failliet, Naked Wines dalend). Moet gecombineerd met tech + community + storytelling
- **Confidence:** 2 → **4** — Curatie werkt, maar is necessary-not-sufficient
- **Test:** Landing page A/B test: A (curated selectie) vs B (sommelier advies) vs C (prijs/kwaliteit)
- **Kill criterion:** Geen variant haalt >5% conversie

**#3 — Betalingsbereidheid zonder proeven (RAT: 378, was 567)**

- **Aanname:** Klanten betalen €12-25/fles op basis van beschrijving en reviews, zonder fysiek proeven
- **Desk research (2026-02-08):** 25-40% van online wijnkopers koopt ongeproefde wijnen. Retourpercentage slechts 2-5%. Smaakgarantie is sector standaard. Premium (>€8) groeit 17%/jaar. Reviews +270% conversie
- **Confidence:** 2 → **5** — Sterk bewijs dat het werkt; smaakgarantie mitigeert risico
- **Test:** Van Westendorp (4 prijsvragen) in interviews + pricing page test (nog gewenst voor exacte grenzen)
- **Kill criterion:** <40% vindt €15/fles acceptabel

**#9 — Marktgrootte (RAT: 336, was 448)**

- **Aanname:** NL premium online wijnmarkt SOM > €500K/jaar
- **Desk research (2026-02-08):** Bevestigd in market-sizing.md. TAM €320M, SAM €25-35M. SOM jaar 3: €350-550K (bottom-up)
- **Confidence:** 3 → **5** — Markt is groot genoeg
- **Status:** ✅ Grotendeels gevalideerd

**#10 — Abonnement vs los (RAT: 336)**

- **Aanname:** Wijnclub/abo model verhoogt LTV significant
- **Test:** Pricing page test met abo optie, meet conversie abo vs eenmalig

### Tier 3: Monitoring (RAT <300)

**#8 — Leeftijdsverificatie impact (RAT: 294)**

- **Aanname:** 18+ gate kost <10% conversie
- **Test:** Implementeer minimale gate, meet drop-off rate

**#7 — Herhaalaankopen (RAT: 270, was 405)**

- **Aanname:** Klanten bestellen ≥3x per jaar
- **Desk research (2026-02-08):** DTC wine repeat rate tot 48%, gemiddeld 3,3 orders/jaar. CLV ~$737 (~€680). Naked Wines 75% retentie, Firstleaf 70%. Subscription churn 10-15%/maand (mix nodig)
- **Confidence:** 2 → **5** — Sterk bewijs dat herhaalaankopen haalbaar zijn
- **Status:** ✅ Grotendeels gevalideerd, bevestigen via concierge MVP

---

## Dependencies

```
Assumption #1 (merkvertrouwen) ──┐
                                  ├─→ #5 (curatie differentiator)
Assumption #3 (betalingsbereid) ─┘     │
                                        ├─→ #6 (acquisitie kanalen)
                                        │     │
                                        │     └─→ Go/No-Go beslissing
Assumption #9 (marktgrootte) ──────────┘
Assumption #2 (dropship kwaliteit) ─→ #7 (herhaalaankopen) ─→ #4 (unit economics)
```

## Planning

| Week | Focus                                   | Assumptions |
| ---- | --------------------------------------- | ----------- |
| 1    | Assumption mapping + interview planning | Deze map    |
| 2-3  | JTBD Interviews                         | #1, #3, #5  |
| 3-4  | Competitive analysis + market sizing    | #9          |
| 4-5  | Landing page test                       | #5, #6      |
| 5-6  | Pricing validatie                       | #3, #10     |
| 6-8  | Concierge MVP                           | #2, #7      |
| 8    | Unit economics model                    | #4          |
| 8-9  | Go/No-Go review                         | Alle        |

## Herzienlog

| Datum      | Wijziging                                                                                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-08 | Initiële assumption map aangemaakt                                                                                                                                                                                                      |
| 2026-02-08 | Desk research (VINO-142): Confidence updates voor #1 (2→4), #3 (2→5), #5 (2→4), #6 (2→3), #7 (2→5), #9 (3→5). RAT scores herberekend. Tier-indeling gewijzigd. CAC target bijgesteld naar €40 jaar 1. Details: desk-research-results.md |
