# VINO12 — Market Sizing (TAM/SAM/SOM)

**Issue:** VINO-136
**Datum:** 2026-02-08
**Status:** Compleet
**Methode:** Top-down + Bottom-up

---

## Top-Down Berekening

### TAM — Total Addressable Market

```
NL wijnmarkt (at-home retail)                    €3.200M
  Bron: Statista 2025, USD 3.46B ≈ €3.2B

Online aandeel (~10%)                            €320M
  Bron: STAP, WineBusiness.nl

= TAM (NL online wijnverkoop):                  €320M
```

### SAM — Serviceable Addressable Market

```
TAM (NL online wijn):                            €320M

× Premium segment (≥€10/fles):                   ~35%
  Bron: Premium groei 17%/jaar, huidige ~30-40%
                                                  €112M

× Leeftijd 25-55 jaar:                           ~65%
  Bron: CBS bevolkingsdata, wijnkoopgedrag
                                                  €73M

× Bereid om bij onbekend merk te kopen:           ~40%
  Bron: Schatting (moet gevalideerd in interviews)
                                                  €29M

= SAM:                                           €25-35M
```

### SOM — Serviceable Obtainable Market

```
SAM:                                              €30M (midpoint)

× Realistische marktpenetratie jaar 1:            1-3%
  Bron: Startup benchmark voor niche e-commerce
                                                  €300K - €900K

× Groei jaar 2 (50%):                            €450K - €1.35M
× Groei jaar 3 (40%):                            €630K - €1.89M

= SOM jaar 1:                                    €300K - €900K
= SOM jaar 3:                                    €630K - €1.9M
```

---

## Bottom-Up Berekening

### Aannames

| Parameter                    | Waarde               | Bron/Rationale                      |
| ---------------------------- | -------------------- | ----------------------------------- |
| Gemiddelde fles prijs        | €15                  | Premium segment, sommelier selectie |
| Flessen per bestelling       | 3                    | Mix van losse + bundels             |
| Gemiddelde orderwaarde (AOV) | €45                  | 3 × €15                             |
| Bestellingen per klant/jaar  | 4                    | Kwartaal + speciale gelegenheden    |
| Revenue per klant/jaar       | €180                 | €45 × 4                             |
| Verzendkosten drempel        | €50 (gratis erboven) | Marktstandaard                      |

### Jaar 1

```
Maand 1-3 (Concierge MVP):
  Klanten: 20
  Revenue: 20 × €45 = €900/maand

Maand 4-6 (Soft launch):
  Nieuwe klanten/maand: 30
  Totaal actieve klanten: 110
  Revenue: 110 × €45 × 25% (niet iedereen bestelt elke maand) = €1.238/maand

Maand 7-12 (Growth):
  Nieuwe klanten/maand: 60 (ads + organisch)
  Churn: 5%/maand
  Totaal actieve klanten maand 12: ~450
  Revenue maand 12: ~€5.000/maand

Jaar 1 totaal revenue:                           ~€25.000 - €40.000
```

### Jaar 2 (met subscriptie model)

```
Start: 450 actieve klanten
Nieuwe klanten/maand: 100 (verbeterde ads + mond-tot-mond)
Churn: 4%/maand (verbeterd door personalisatie)
Subscriptie adoptie: 30% van klanten → hogere LTV

Eind jaar 2: ~1.200 actieve klanten
Gem. revenue/klant/jaar: €200 (mix los + abo)

Jaar 2 totaal revenue:                           €120.000 - €180.000
```

### Jaar 3 (schaal)

```
Start: 1.200 actieve klanten
Nieuwe klanten/maand: 150
Churn: 3.5%/maand
Subscriptie adoptie: 45%

Eind jaar 3: ~2.500 actieve klanten
Gem. revenue/klant/jaar: €220

Jaar 3 totaal revenue:                           €350.000 - €550.000
```

---

## Vergelijking Top-Down vs Bottom-Up

| Methode          | Jaar 1        | Jaar 2         | Jaar 3        |
| ---------------- | ------------- | -------------- | ------------- |
| **Top-Down SOM** | €300K - €900K | €450K - €1.35M | €630K - €1.9M |
| **Bottom-Up**    | €25K - €40K   | €120K - €180K  | €350K - €550K |

**Analyse:** Bottom-up is significant lager dan top-down. Dit is normaal voor een startup — top-down overschat altijd de eerste jaren. De bottom-up schatting is realistischer voor de daadwerkelijke ramp-up.

**Convergentie punt:** Jaar 3-4, wanneer marketing en brand awareness schaaleffecten bereiken.

---

## Unit Economics (Per Bestelling)

| Component                           | Bedrag     | % van AOV |
| ----------------------------------- | ---------- | --------- |
| **Verkoopprijs (AOV)**              | €45,00     | 100%      |
| Inkoopkosten wijn                   | -€18,00    | 40%       |
| Fulfillment (dropship fee)          | -€5,00     | 11%       |
| Verzending                          | -€4,50     | 10%       |
| Verpakking                          | -€2,00     | 4%        |
| **Bruto marge**                     | **€15,50** | **34%**   |
| Marketing (CAC gedeeld over orders) | -€6,00     | 13%       |
| Platform kosten (hosting, payment)  | -€2,00     | 4%        |
| **Netto marge per bestelling**      | **€7,50**  | **17%**   |

### LTV/CAC Berekening

| Metric             | Waarde                               |
| ------------------ | ------------------------------------ |
| CAC (target)       | €25                                  |
| Bestellingen/jaar  | 4                                    |
| Retentie (jaar 1)  | 60%                                  |
| Retentie (jaar 2+) | 70%                                  |
| Customer lifetime  | ~2,5 jaar                            |
| LTV                | €180 × 2,5 × 34% bruto marge = ~€153 |
| **LTV/CAC ratio**  | **~6:1** (gezond, target ≥3:1)       |

---

## Sanity Checks

| Check                              | Resultaat                          | Status         |
| ---------------------------------- | ---------------------------------- | -------------- |
| SOM < 5% van SAM?                  | €550K / €30M = 1.8%                | ✅ Realistisch |
| SOM > €500K/jaar (binnen 3 jaar)?  | €350-550K jaar 3                   | ⚠️ Grensgebied |
| Bottom-up convergent met top-down? | Na jaar 3-4                        | ✅ Verwacht    |
| Bruto marge ≥ 30%?                 | 34%                                | ✅ Gezond      |
| LTV/CAC ≥ 3:1?                     | ~6:1                               | ✅ Sterk       |
| Markt groeiend?                    | Premium +17%/jaar, online groeiend | ✅ Gunstig     |

---

## Risico's voor Market Sizing

| Risico                                  | Impact                     | Mitigatie                                     |
| --------------------------------------- | -------------------------- | --------------------------------------------- |
| Premium segment kleiner dan geschat     | SAM daalt 30-50%           | Interviews valideren (VINO-134)               |
| Hogere CAC door advertentie restricties | LTV/CAC ratio verslechtert | Content marketing, partnerships               |
| Lage herhaalaankoop rate                | LTV daalt significant      | Subscriptie model, personalisatie             |
| Accijns verhogingen                     | Margin druk                | Doorberekenen of hogere gemiddelde fles prijs |
| e-Luscious lanceert premium merk        | SAM share bedreigd         | First-mover voordeel, niche focus             |

---

## Conclusie

| Criterium                      | Oordeel                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| **Markt groot genoeg?**        | ✅ TAM €320M, SAM €25-35M — voldoende ruimte               |
| **SOM >€500K bereikbaar?**     | ⚠️ Realistisch in jaar 3-4, niet jaar 1                    |
| **Unit economics gezond?**     | ✅ 34% bruto marge, LTV/CAC ~6:1                           |
| **Groeitrend gunstig?**        | ✅ Premium groeit, online groeit                           |
| **Minimum threshold gehaald?** | ⚠️ Grensgebied — moet gevalideerd worden met channel tests |

**Aanbeveling:** Markt is voldoende groot. De kritieke factor is niet marktgrootte maar **klant acquisitie efficiency** (CAC) en **herhaalaankoop rate**. Deze moeten gevalideerd worden in VINO-137 (landing page), VINO-138 (pricing) en VINO-139 (concierge MVP).

---

## Bronnen

- Statista: Wine Market Netherlands 2025
- CBS StatLine: Bevolkingsdata, Huishouduitgaven
- STAP: Bijna 10% wijnverkoop online
- WineBusiness.nl: NL Online Wijnverkoop instap tot premium
- BestWineImporters: Wine Import Trends Netherlands 2024
- Thuiswinkel.org: E-commerce cijfers Nederland
- Meininger's International: NL Alcohol Tax Increase 2024
