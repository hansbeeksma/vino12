# VINO12 — Competitive Analysis (NL Online Wijnmarkt)

**Issue:** VINO-135
**Datum:** 2026-02-08
**Status:** Compleet

---

## 1. Markt Context

| Metric                        | Waarde                               | Bron                 |
| ----------------------------- | ------------------------------------ | -------------------- |
| Totale NL wijnmarkt (at-home) | ~€3,2 mrd                            | Statista 2025        |
| Online wijnverkoop aandeel    | ~10% van consumentenverkoop          | STAP/WineBusiness.nl |
| Online wijnverkoop geschat    | €75-180 mln/jaar                     | Diverse bronnen      |
| Wijnimport waarde             | €1,5 mrd (record)                    | 2023 data            |
| Per capita consumptie         | ~16,9 liter (2022), dalend naar ~15L | Statista             |
| Premium segment groei         | ~17% jaarlijks                       | Marktonderzoek       |
| Gemiddelde supermarkt fles    | €4,24                                | CBS/Statista         |
| Gemiddelde slijterij fles     | €8,14                                | CBS/Statista         |

**Kerntrend:** Volume daalt, maar waarde stijgt — Nederlanders drinken minder maar betalen meer per fles.

---

## 2. Concurrenten Overzicht

### Feature Matrix

|                    | Wijnvoordeel      | Wijnbeurs          | Gall & Gall               | Vivino                 | Grand Cru Wijnen    | Henri Bloem              | Vindict                 |
| ------------------ | ----------------- | ------------------ | ------------------------- | ---------------------- | ------------------- | ------------------------ | ----------------------- |
| **Model**          | Pure-play online  | Pure-play online   | Omnichannel (628 winkels) | Marketplace/app        | Online + showroom   | Omnichannel (20 winkels) | Hybrid (winkel+bar+web) |
| **Prijsrange**     | €3-15             | €5-25              | €4-50+                    | Variabel               | €8-500+             | €6-50+                   | €8-100+                 |
| **Assortiment**    | 400+ wijnen       | 250+ wijnen        | 3.700+ wijnen             | 15M+ (global)          | 3.500+ wijnen       | 1.000+ wijnen            | 800+ wijnen             |
| **Doelgroep**      | Prijsbewust, bulk | Kwaliteitsbewust   | Breed, gemak              | Tech-savvy, ontdekking | Premium, collectie  | Enthousiasten, advies    | Urban, natural wine     |
| **Trustpilot**     | 4.5/5 (28K)       | 4.5/5 (14.5K)      | 4.0/5 (1.3K)              | N/A (NL)               | 9.5/10 KiyOh        | Lokaal sterk             | Lokaal uitstekend       |
| **Bezorging**      | Volgende werkdag  | 1-2 werkdagen      | Next-day + Thuisbezorgd   | Via merchants          | Same-day (voor 17u) | Gratis vanaf €75         | Gratis                  |
| **Curatie**        | ❌ Volume         | ✅ Blind proeverij | 🔄 Smaakgids              | ✅ AI/community        | 🔄 A-merk only      | ✅ Expert advies         | ✅ Persoonlijk          |
| **Abonnement**     | ❌                | ❌                 | ❌                        | ✅ Wine Club           | ❌                  | ❌                       | ❌                      |
| **Personalisatie** | ❌                | 🔄 Aankoophistorie | ❌                        | ✅ AI labels           | ❌                  | ✅ Persoonlijk advies    | ✅ In-store             |

### e-Luscious Groep (Dominante Online Speler)

**KRITIEK:** e-Luscious (Gilde Equity Management) bezit zowel Wijnvoordeel, Wijnbeurs als Colaris en domineert de NL online wijnmarkt.

| Merk                | Positionering | Omzet                      |
| ------------------- | ------------- | -------------------------- |
| **Wijnvoordeel.nl** | Budget/waarde | €115M+ (15M+ flessen/jaar) |
| **Wijnbeurs.nl**    | Middenklasse  | Onderdeel van groep        |
| **Colaris.nl**      | Premium       | Onderdeel van groep        |

**Implicatie:** Concurreren op prijs of middenklasse volume is zinloos tegen deze groep.

---

## 3. Positioning Map

```
                    Premium kwaliteit
                          │
                          │
    Henri Bloem ●         │         ● Grand Cru Wijnen
                          │
    Vindict ●             │    ● Colaris
                          │
    ──────────────────────┼──────────────────────
    Persoonlijk/          │         Schaalbaar/
    lokaal                │         online
                          │
                ● Wijnbeurs
                          │
                          │    ● Vivino
                          │
            Gall & Gall ● │
                          │    ● Wijnvoordeel
                          │
                    Budget/volume

    ★ VINO12 target positie: Premium + Schaalbaar Online
      (rechts-boven kwadrant — momenteel LEEG)
```

---

## 4. Geïdentificeerde Marktgaten

| #   | Gap                                      | Huidige situatie                                                             | VINO12 kans                                |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | **AI-gepersonaliseerde wijnsubscriptie** | Vivino doet discovery maar geen NL abo; kleine spelers (Vinobox) missen tech | **HOOG** — Primaire differentiator         |
| 2   | **Premium online op schaal**             | Grand Cru niche, Colaris klein, lokale spelers niet schaalbaar               | **HOOG** — €10-25/fles segment online      |
| 3   | **Digitale wijnervaring/educatie**       | Educatie = in-store (Henri Bloem, Vindict); niet gedigitaliseerd             | **MEDIUM** — Tasting notes, video, pairing |
| 4   | **Natural/sustainable platform**         | Alleen kleine Amsterdamse spelers (CraftWine, Chenin Chenin)                 | **MEDIUM** — Groeiend segment              |
| 5   | **Jonge consument targeting**            | Meeste spelers richten zich op 35+; traditionele marketing                   | **MEDIUM** — Instagram-first aanpak        |
| 6   | **Wijn + food pairing**                  | Geen dedicated speler combineert e-commerce + pairing intelligence           | **LAAG-MEDIUM** — Nice-to-have             |

---

## 5. Competitive Moat Assessment

| Moat Type                   | Haalbaarheid voor VINO12                                          | Tijdlijn      |
| --------------------------- | ----------------------------------------------------------------- | ------------- |
| **Data/personalisatie**     | ✅ Hoog — smaakprofielen + aankoophistorie → betere aanbevelingen | 6-12 maanden  |
| **Brand (premium curatie)** | ✅ Medium — sommelier-backed selectie als vertrouwensmerk         | 12-24 maanden |
| **Switching costs**         | 🔄 Laag-Medium — smaakprofiel + aankoophistorie creëert lock-in   | 6+ maanden    |
| **Network effects**         | ❌ Laag — geen marketplace model                                  | N/A           |
| **Scale**                   | ❌ Laag — e-Luscious heeft schaalvoordeel                         | N/A           |
| **First-mover**             | ❌ Niet van toepassing                                            | N/A           |

**Primaire moat strategie:** Data + personalisatie + premium brand trust.

---

## 6. Competitive Response Risico's

| Concurrent Actie                 | Waarschijnlijkheid      | Impact      | Onze Response                                |
| -------------------------------- | ----------------------- | ----------- | -------------------------------------------- |
| e-Luscious lanceert subscription | Hoog (12-18 mnd)        | Hoog        | First-mover voordeel + betere personalisatie |
| Gall & Gall verbetert online     | Medium (al bezig)       | Medium      | Differentiate op curatie, niet gemak         |
| Vivino lanceert NL-specifiek abo | Laag (focus op globaal) | Hoog        | Lokale expertise + NL suppliers              |
| Nieuwe startup in premium online | Medium                  | Laag-Medium | Execution speed + data voorsprong            |

---

## 7. Positioneringsstatement

```
Voor Nederlandse wijnliefhebbers (25-55 jaar)
die graag nieuwe premium wijnen ontdekken
maar overweldigd worden door keuze en onzekerheid,

is VINO12 een online wijnplatform
dat gepersonaliseerde, door sommeliers geselecteerde wijnen
direct bij je thuis bezorgt.

In tegenstelling tot prijsconcurrenten (Wijnvoordeel)
en traditionele slijters (Gall & Gall),
combineert VINO12 expert curatie met
moderne personalisatie voor een ontdekkingservaring
die je met elke bestelling beter leert kennen.
```

---

## 8. Regulatoire Overwegingen

| Regelgeving                 | Impact op VINO12                                                        |
| --------------------------- | ----------------------------------------------------------------------- |
| **18+ verificatie**         | Verplicht bij checkout + bij bezorging (ID check door koerier)          |
| **NVWA handhaving**         | Gedocumenteerde leeftijdsverificatie procedure vereist                  |
| **Accijns wijn >8,5%**      | €95,69/hectoliter (+8,4% verhoging jan 2024)                            |
| **Advertentie beperkingen** | TV/radio ban 6-21u; NIX18 logo verplicht; event sponsoring aanscherping |
| **65% volwassenen**         | voor alcoholreclame verbod → verdere aanscherping verwacht              |
| **Cross-border belasting**  | Prijsverschil drijft sommige consumenten naar DE/FR                     |

**Implicatie:** Alcohol advertising restrictions beperken Instagram/Google Ads mogelijkheden. Content marketing en community building worden belangrijker.

---

## 9. Belangrijkste Bronnen

- Statista: Wine Market Netherlands (2025)
- STAP: Dutch Alcohol Policy & Online Wine Sales
- WineBusiness.nl: NL Online Wijnverkoop
- Trustpilot: Reviews Wijnvoordeel (28K), Wijnbeurs (14.5K), Gall & Gall (1.3K)
- Thuiswinkel.org: E-commerce data
- Business.gov.nl: Alcohol Act, Age Check, Advertising Rules
- e-Luscious/Gilde Equity Management: Company data
- BestWineImporters: NL Wine Import Trends 2024
