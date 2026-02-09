# VINO-140: Channel Test (Instagram + Google Ads)

> **Parent**: VINO-132 | **Doorlooptijd**: 2-4 weken | **Bronnen**: 60 Perplexity citaties
> **Doel**: Bepaal welk advertentiekanaal het beste werkt voor VINO12 met €500-1000 testbudget

---

## 1. Test Opzet

| Parameter       | Waarde                           |
| --------------- | -------------------------------- |
| Budget          | €500-1000 totaal (50/50 split)   |
| Duur            | 2-4 weken                        |
| Kanalen         | Instagram Ads + Google Ads       |
| Doelgroep       | NL, 25-55 jaar, wijninteresse    |
| Primaire KPI    | Cost per Acquisition (CAC)       |
| Secundaire KPIs | CTR, CPC, ROAS, Add-to-Cart rate |

---

## 2. Instagram Ads Framework

### Campagnestructuur

```
Campaign: VINO12_IG_Channel_Test
├── Ad Set 1: Breed Wijn (€125)
│   ├── Ad 1A: Carousel (3 flessen + verhaal)
│   ├── Ad 1B: Video (15s unboxing)
│   └── Ad 1C: Single Image (hero fles)
│
├── Ad Set 2: Italiaans Lifestyle (€125)
│   ├── Ad 2A: Carousel (Toscane + wijnen)
│   ├── Ad 2B: Video (15s proeverij moment)
│   └── Ad 2C: Single Image (tafel setting)
│
└── Ad Set 3: Lookalike (€100-250)  ← Activeer na 3-5 dagen
    └── Op basis van beste performers
```

### Targeting

| Ad Set                  | Targeting                                                   | Verwacht Bereik |
| ----------------------- | ----------------------------------------------------------- | --------------- |
| **Breed Wijn**          | Interesses: wijn, Vivino, Gall & Gall, wijnproeverij        | 200K-400K       |
| **Italiaans Lifestyle** | Interesses: Italië, Italiaans eten, La Dolce Vita, culinair | 300K-500K       |
| **Lookalike**           | 1% lookalike van website bezoekers / engaged users          | 100K-200K       |

### Geo & Demo

| Parameter     | Instelling                                               |
| ------------- | -------------------------------------------------------- |
| Locatie       | Nederland                                                |
| Leeftijd      | 25-55                                                    |
| Taal          | Nederlands                                               |
| Plaatsing     | Instagram Feed + Stories + Reels (niet Audience Network) |
| Optimalisatie | Conversies (Add to Cart of Purchase)                     |

### Creative Specificaties

| Format        | Afmetingen          | Duur   | Best Practices                             |
| ------------- | ------------------- | ------ | ------------------------------------------ |
| Single Image  | 1080×1080 (1:1)     | n.v.t. | Fles prominent, warm licht, minimale tekst |
| Carousel      | 1080×1080 per slide | n.v.t. | 3-5 slides, verhaal opbouwen               |
| Video (Reels) | 1080×1920 (9:16)    | 15-30s | Hook in eerste 3s, ondertiteld             |
| Stories       | 1080×1920 (9:16)    | 15s    | Swipe-up CTA, urgentie                     |

### Copy Templates

**Ad 1A (Carousel)**:

```
Slide 1: "12 wijnen. 12 verhalen. Recht uit Italië."
Slide 2: [Fles] "Chianti Classico — van een familiebedrijf uit de 4e generatie"
Slide 3: [Fles] "Barolo DOCG — de koning van Piemonte"
Slide 4: "Ontdek jouw favoriet →"
CTA: "Shop nu"
```

**Ad 2B (Video)**:

```
[0-3s] Close-up: kurk eruit trekken
[3-7s] Inschenken in glas, warm licht
[7-12s] Voice-over: "Italiaanse wijnen, geselecteerd voor jou"
[12-15s] Logo + "vino12.nl" + CTA
```

---

## 3. Google Ads Framework

### Campagnestructuur

```
Campaign: VINO12_Google_Channel_Test
├── Ad Group 1: Brand + Generiek (€100)
│   └── Keywords: "italiaanse wijn kopen", "wijn bestellen online"
│
├── Ad Group 2: Product Specifiek (€100)
│   └── Keywords: "barolo kopen", "chianti bestellen", "prosecco online"
│
├── Ad Group 3: Abonnement (€75)
│   └── Keywords: "wijn abonnement", "wijnclub nederland"
│
└── Ad Group 4: Concurrent (€75-225)
    └── Keywords: "wijnvoordeel alternatief", "grand cru club review"
```

### Zoekwoorden & Biedstrategie

| Ad Group              | Keywords (Broad Match Modified)                                                 | Verwacht CPC |
| --------------------- | ------------------------------------------------------------------------------- | ------------ |
| **Brand + Generiek**  | +italiaanse +wijn +kopen, +wijn +bestellen +online, +italiaans +wijn +nederland | €0.50-1.50   |
| **Product Specifiek** | +barolo +kopen, +chianti +online, +amarone +bestellen, +prosecco +bezorgen      | €0.30-1.00   |
| **Abonnement**        | +wijn +abonnement, +wijnclub, +wijn +maandelijks +pakket                        | €1.00-2.50   |
| **Concurrent**        | +wijnvoordeel +alternatief, +vivino +nederland, +grand +cru +club               | €0.80-2.00   |

### Negatieve Keywords

```
-gratis, -goedkoop, -recept, -druif, -maken, -cursus,
-vacature, -stage, -restaurant, -horeca, -groothandel
```

### Ad Copy Templates

**Responsive Search Ad (Ad Group 1)**:

| Element                      | Varianten                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Headlines (max 30 tekens)    | "Italiaanse Wijnen Online" / "12 Gecureerde Wijnen" / "Recht Uit Italië" / "Gratis Verzending v.a. €50"                                                                  |
| Descriptions (max 90 tekens) | "Ontdek 12 handgeselecteerde Italiaanse wijnen van kleine wijnmakers. Bezorgd met iDEAL." / "Van Barolo tot Vermentino. Expert-geselecteerd, thuisbezorgd in Nederland." |
| Display URL                  | vino12.nl/italiaanse-wijnen                                                                                                                                              |

### Landing Page Eisen

| Element             | Vereiste                                              |
| ------------------- | ----------------------------------------------------- |
| URL                 | vino12.nl (productpagina of dedicated landingspagina) |
| Laadtijd            | <3 seconden (Core Web Vitals)                         |
| Mobile responsive   | Ja (Google Mobile-First)                              |
| CTA                 | Duidelijk boven de vouw                               |
| Vertrouwenssignalen | Reviews, veilig betalen badges, leeftijdscheck        |

---

## 4. Nederlandse Regelgeving (Alcohol Reclame)

### Verplichtingen

| Regel               | Vereiste                                                               | Toepassing                   |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------- |
| **Leeftijdscheck**  | 18+ gate op website + ads                                              | Meta: leeftijd 18+ instellen |
| **Disclaimer**      | "Niet verkopen aan personen onder de 18"                               | Op alle ads + landingspagina |
| **Geen misleiding** | Geen claims over gezondheid of prestatie                               | Geen "wijn maakt gelukkig"   |
| **Reclame Code**    | Conformiteit met Nederlandse Reclame Code voor Alcoholhoudende dranken | Check stiva.nl               |
| **Instagram/Meta**  | Alcohol advertenties alleen 18+ targeting                              | In Ad Set targeting          |
| **Google**          | Alcohol ads toegestaan in NL, 18+ targeting                            | In campagne settings         |

### Meta (Instagram) Alcohol Policy

- Account moet geverifieerd zijn
- Targeting: minimaal 18 jaar
- Geen user-generated content die minderjarigen toont
- Geen gamificatie of wedstrijden met alcohol als prijs

---

## 5. Tracking & Attributie

### UTM Schema

```
utm_source=instagram&utm_medium=paid&utm_campaign=channel_test&utm_content=carousel_breed_wijn
utm_source=google&utm_medium=cpc&utm_campaign=channel_test&utm_content=brand_generiek
```

| Parameter      | Conventie                     |
| -------------- | ----------------------------- |
| `utm_source`   | `instagram` / `google`        |
| `utm_medium`   | `paid` / `cpc`                |
| `utm_campaign` | `channel_test`                |
| `utm_content`  | `{ad_set}_{creative_variant}` |

### Conversie Events

| Event              | Waar               | Tracking                            |
| ------------------ | ------------------ | ----------------------------------- |
| `PageView`         | Landingspagina     | Plausible + Meta Pixel + Google Tag |
| `ViewContent`      | Productpagina      | Plausible custom event              |
| `AddToCart`        | Winkelwagen        | Plausible custom event              |
| `InitiateCheckout` | Afrekenen          | Plausible custom event              |
| `Purchase`         | Bevestigingspagina | Plausible + server-side             |

### Cookie-Compliance (GDPR)

| Tier            | Tracking                                  | Toestemming nodig?       |
| --------------- | ----------------------------------------- | ------------------------ |
| **Essentieel**  | Plausible (cookieloos)                    | Nee                      |
| **Marketing**   | Meta Pixel, Google Ads tag                | Ja (cookie consent)      |
| **Server-side** | Conversie API (Meta CAPI, Google offline) | Ja (legitimate interest) |

---

## 6. Performance Dashboard

### Dagelijks Bijhouden

```csv
datum,kanaal,ad_set,creative,spend,impressies,clicks,ctr,cpc,add_to_cart,purchases,cac,roas
2026-03-01,instagram,breed_wijn,carousel_3flessen,12.50,2340,47,2.01%,0.27,5,1,12.50,4.47
2026-03-01,google,brand_generiek,rsa_v1,15.00,890,23,2.58%,0.65,3,0,n.v.t.,0
```

### KPI Targets per Kanaal

| KPI               | Instagram Target | Google Target | Uitleg               |
| ----------------- | ---------------- | ------------- | -------------------- |
| **CTR**           | >1.5%            | >2.0%         | Click-through rate   |
| **CPC**           | <€1.00           | <€1.50        | Cost per click       |
| **Conversie %**   | >2.0%            | >3.0%         | Clicks → Purchase    |
| **CAC**           | <€40             | <€35          | Cost per acquisition |
| **ROAS**          | >3:1             | >4:1          | Return on ad spend   |
| **Add-to-Cart %** | >5%              | >8%           | Clicks → Add to Cart |

### Beslissingsmatrix (na 2 weken)

| Scenario           | Instagram          | Google        | Actie                                 |
| ------------------ | ------------------ | ------------- | ------------------------------------- |
| Beide CAC < target | Winner + Runner-up | Beide schalen | 70/30 budget split naar winner        |
| Eén CAC < target   | Winner             | Loser         | 100% budget naar winner               |
| Beide CAC > target | Optimaliseren      | Optimaliseren | Creative refresh, targeting aanpassen |
| Beide hopeloos     | Stop               | Stop          | Organisch + email focus (Plonk-model) |

---

## 7. A/B Test Matrix

### Instagram Creative Tests

| Test | Variabele   | A             | B                     | Metric     |
| ---- | ----------- | ------------- | --------------------- | ---------- |
| 1    | Format      | Carousel      | Video (15s)           | CTR        |
| 2    | Hook        | Product focus | Lifestyle/Italië      | Engagement |
| 3    | CTA         | "Shop nu"     | "Ontdek de collectie" | Click rate |
| 4    | Prijs in ad | Ja (€13,99)   | Nee (alleen "vanaf")  | Conv. rate |

### Google Ad Copy Tests

| Test | Variabele | A                   | B                      | Metric        |
| ---- | --------- | ------------------- | ---------------------- | ------------- |
| 1    | Headline  | "Italiaanse Wijnen" | "12 Gecureerde Wijnen" | CTR           |
| 2    | USP       | "Gratis verzending" | "Handgeselecteerd"     | Conv. rate    |
| 3    | Prijs     | In description      | Niet vermeld           | Quality Score |

---

## 8. Opschalings-Criteria

Wanneer opschalen van test naar structureel budget?

| Criterium                     | Threshold              | Bewijs nodig    |
| ----------------------------- | ---------------------- | --------------- |
| Minimaal 50 clicks per ad set | Statistisch relevant   | Ad manager data |
| CAC stabiel over 7+ dagen     | Geen dalende trend     | Trendlijn       |
| ROAS > 3:1                    | Winstgevend            | Revenue / Spend |
| Conversie % > 1.5%            | Minimaal viable        | Funnel data     |
| CPA trend dalend              | Learning phase voorbij | Week-over-week  |

---

## 9. Checklist

- [ ] Meta Business Manager account opgezet + geverifieerd
- [ ] Google Ads account aangemaakt
- [ ] Meta Pixel geïnstalleerd op vino12.nl
- [ ] Google Ads tag geïnstalleerd
- [ ] Cookie consent banner live (GDPR)
- [ ] Leeftijdsverificatie op ads (18+)
- [ ] Creatives gemaakt (3 Instagram, 3 Google)
- [ ] UTM parameters ingesteld
- [ ] Conversie events geconfigureerd (Plausible + ad platforms)
- [ ] Campagnes live gezet
- [ ] Dagelijks performance dashboard bijgewerkt
- [ ] Na 7 dagen: eerste optimalisatieronde
- [ ] Na 14 dagen: A/B test winners bepaald
- [ ] Na 21 dagen: eindanalyse + CAC per kanaal
- [ ] Beslissingsmatrix ingevuld
- [ ] Opschalings-criteria getoetst
- [ ] Bevindingen doorvertaald naar VINO-141 (Go/No-Go)
