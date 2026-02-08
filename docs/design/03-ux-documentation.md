---
project: "VINO12"
version: "1.0.0"
last_updated: "2026-02-08"
maturity: "foundation"
status: "draft"
owner: "Sam Swaab"
---

# VINO12 UX Documentation

> User Experience Documentation — Wine E-Commerce

---

## User Personas

### Persona 1: De Thuissommelier

| Attribute          | Details                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| **Age**            | 30-45                                                                       |
| **Occupation**     | Professional (kantoor)                                                      |
| **Tech savviness** | High                                                                        |
| **Wine knowledge** | Gemiddeld — weet wat lekker is, kent de basics                              |
| **Goals**          | Ontdekken, gemak, indruk maken bij etentjes                                 |
| **Frustrations**   | Keuzestress, pretentieus taalgebruik, hoge verzendkosten                    |
| **Quote**          | "Ik wil gewoon een goede rode voor vanavond, zonder cursus wijnwetenschap." |

**Behavior:** Bestelt via mobiel, 6-12 flessen/maand, vergelijkt prijs-kwaliteit, deelt in WhatsApp.

### Persona 2: De Cadeau-gever

| Attribute          | Details                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| **Age**            | 25-55                                                                                 |
| **Occupation**     | Divers                                                                                |
| **Tech savviness** | Medium                                                                                |
| **Wine knowledge** | Laag — weet niet welke wijn "goed" is                                                 |
| **Goals**          | Snel een indrukwekkend cadeau vinden, geen foute keuze maken                          |
| **Frustrations**   | Onzekerheid over keuze, onduidelijke cadeauopties, lange levertijden                  |
| **Quote**          | "Ik wil iets moois meenemen naar een verjaardag zonder er een uur over na te denken." |

**Behavior:** Koopt incidenteel (2-4x per jaar), zoekt op "cadeau" of "premium", wil snelle checkout.

### Persona 3: De Wijnkenner

| Attribute          | Details                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Age**            | 35-60                                                                                   |
| **Occupation**     | Professional, hoger opgeleid                                                            |
| **Tech savviness** | Medium-High                                                                             |
| **Wine knowledge** | Hoog — kent druivensoorten, regio's, jaargangen                                         |
| **Goals**          | Specifieke wijnen vinden, nieuwe ontdekkingen, uitgebreide info                         |
| **Frustrations**   | Te weinig detail, geen filtermogelijkheden op regio/druif, oppervlakkige beschrijvingen |
| **Quote**          | "Ik zoek een Nebbiolo uit Piemonte, jaargang 2018 of eerder."                           |

**Behavior:** Leest proefnotities, vergelijkt jaargangen, bestelt in bulk, trouw aan goede leverancier.

---

## Primary User Flows

### Flow 1: Product Discovery → Purchase

```
Landing Page → Browse Wines → Product Detail → Add to Cart → Cart → Checkout → Payment → Confirmation
```

| Step        | Screen             | Success Criteria                                    |
| ----------- | ------------------ | --------------------------------------------------- |
| 1. Land     | Homepage           | Hero communiceert "6 rood, 6 wit"                   |
| 2. Browse   | `/wijnen`          | Filter op type (rood/wit), sorteer op prijs/rating  |
| 3. Detail   | `/wijnen/[slug]`   | Wijninfo, proefprofiel, reviews, prijs, add-to-cart |
| 4. Add      | Product detail     | Toast "toegevoegd", cart counter update             |
| 5. Cart     | CartDrawer         | Overzicht, aantal wijzigen, verwijderen             |
| 6. Checkout | `/afrekenen`       | Adres, betaalmethode (iDEAL)                        |
| 7. Pay      | Mollie redirect    | iDEAL betaling                                      |
| 8. Confirm  | `/bestelling/[nr]` | Bevestiging, ordernummer, verwachte levering        |

**Error paths:**
| Error | Recovery |
|-------|----------|
| Uitverkocht | "Helaas uitverkocht" + alternatieven |
| Betaling mislukt | Terug naar checkout + foutmelding |
| Ongeldig adres | Inline validatie + suggestie |

### Flow 2: Gift Purchase

```
Landing → Gift Section → Select Wine → Gift Options → Checkout → Confirmation
```

### Flow 3: Search → Purchase

```
Search Icon → Type Query → Results → Product Detail → Purchase
```

---

## Information Architecture

### Sitemap

```
VINO12
├── Home (/)
├── Wijnen (/wijnen)
│   ├── Product Detail (/wijnen/[slug])
│   └── [Filter: rood/wit]
├── Winkelwagen (/winkelwagen)
├── Afrekenen (/afrekenen)
├── Bestelling (/bestelling/[nr])
├── Over Ons (/over-ons)
├── Contact (/contact)
├── Voorwaarden (/voorwaarden)
├── Privacy (/privacy)
└── Admin (/admin)
    ├── Dashboard
    ├── Bestellingen
    ├── Producten
    └── Ideas
```

### Navigation

| Level   | Type         | Items                         |
| ------- | ------------ | ----------------------------- |
| Primary | Header nav   | Wijnen, Over Ons              |
| Utility | Header right | Zoeken, Winkelwagen           |
| Footer  | Link grid    | Voorwaarden, Privacy, Contact |

---

## Key Design Decisions

| Decision                   | Rationale                                   |
| -------------------------- | ------------------------------------------- |
| 12 wijnen limiet (6R + 6W) | Elimineert keuzestress, curated quality     |
| Dutch URL slugs            | Target market is NL, SEO voordeel           |
| iDEAL first                | 60%+ NL online betaalt met iDEAL            |
| No account required        | Verlaagt drempel, gastbestelling            |
| 18+ gate                   | Wettelijke verplichting, server-side cookie |

---

_Template: ~/Development/shared/communicating-design/templates/03-ux-documentation.md_
