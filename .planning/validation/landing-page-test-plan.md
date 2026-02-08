# VINO12 — Landing Page A/B Test Plan

**Issue:** VINO-137
**Datum:** 2026-02-08
**Status:** Voorbereiding (wacht op interview resultaten)

---

## Hypothese

```
Wij geloven dat een duidelijke value proposition
voor NL wijnliefhebbers (25-55, premium)
zal resulteren in email signups voor VINO12.

We weten dat dit klopt als email signup rate ≥ 15%
en landing page conversie ≥ 5% binnen 2 weken.
```

## Test Design

### 3 Varianten

| Variant | Value Proposition | Headline                                                 | Subtext                                                                       |
| ------- | ----------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **A**   | Curated selectie  | "Ontdek bijzondere wijnen, voor jou geselecteerd"        | "Elke maand een verrassende selectie premium wijnen, gekozen door experts"    |
| **B**   | Sommelier advies  | "Jouw persoonlijke sommelier, altijd binnen handbereik"  | "Vertel ons wat je lekker vindt en ontvang wijnaanbevelingen op maat"         |
| **C**   | Prijs/kwaliteit   | "Premium wijnen, eerlijke prijzen — direct bij je thuis" | "Geen tussenpersonen, geen opslag. Rechtstreeks van wijnmaker naar jouw deur" |

### Pagina Elementen (alle varianten)

| Element      | Inhoud                                                           |
| ------------ | ---------------------------------------------------------------- |
| Hero         | Variant-specifieke headline + hero image                         |
| Social proof | "X wijnliefhebbers gingen je voor" (zodra beschikbaar)           |
| 3 USPs       | Variant-specifiek (expert selectie / persoonlijk / direct trade) |
| CTA          | "Ontvang je eerste aanbevelingen" → email signup                 |
| Footer       | Over ons (kort), FAQ (bezorging, 18+ verificatie)                |

### Technische Setup

| Component     | Keuze                                           |
| ------------- | ----------------------------------------------- |
| Platform      | Framer of Next.js static pages                  |
| Hosting       | Vercel (eigen domein: vino12.nl of preview URL) |
| Analytics     | Plausible (privacy-first) of PostHog            |
| A/B routing   | Query parameter (?v=a/b/c) of random assignment |
| Email capture | Resend list of Mailchimp free tier              |
| Tracking      | UTM parameters per traffic source               |

### Traffic Generatie

| Kanaal            | Budget         | Targeting                                                       |
| ----------------- | -------------- | --------------------------------------------------------------- |
| **Instagram Ads** | €150-250       | NL, 25-55, interest: wijn, food & drink, lifestyle              |
| **Google Ads**    | €150-250       | Keywords: "wijn bestellen", "wijn online kopen", "premium wijn" |
| **Reddit**        | €0 (organisch) | r/wijn, r/thenetherlands                                        |
| **Totaal**        | €300-500       | Min. 100 bezoekers per variant (300 totaal)                     |

## Metrics

| Metric                                      | Type      | Drempelwaarde               |
| ------------------------------------------- | --------- | --------------------------- |
| Email signup rate                           | Primair   | ≥ 15%                       |
| Landing page conversie (visit → any action) | Primair   | ≥ 5%                        |
| Bounce rate                                 | Secundair | < 60%                       |
| Time on page                                | Secundair | > 30 sec                    |
| Traffic source CTR                          | Secundair | Google ≥ 3%, Instagram ≥ 1% |

## Tijdlijn

| Dag  | Activiteit                        |
| ---- | --------------------------------- |
| 1-3  | Design + build 3 landing pages    |
| 4    | Setup analytics + A/B routing     |
| 5-6  | Launch ads, drive initial traffic |
| 7-14 | Collect data, monitor dagelijks   |
| 15   | Analyse, winnaar bepalen          |

## Beslissing na Test

| Resultaat               | Actie                                        |
| ----------------------- | -------------------------------------------- |
| Eén variant ≥15% signup | Winnaar → basis voor merkpositionering       |
| Alle varianten 5-15%    | Meest beloftevolle tweaken, herhaal test     |
| Alle varianten <5%      | Fundamenteel probleem met propositie → pivot |

---

# VINO12 — Pricing Validatie Plan

**Issue:** VINO-138
**Datum:** 2026-02-08

## Hypothese

```
Wij geloven dat NL wijnliefhebbers bereid zijn €12-20 per fles te betalen
voor een curated selectie premium wijnen met thuisbezorging.

We weten dat dit klopt als Van Westendorp optimaal prijspunt
tussen €10-20 valt en ≥40% de prijs "acceptabel" vindt.
```

## Van Westendorp Prijsanalyse

### 4 Vragen (in JTBD interviews + follow-up survey)

```
Context: "Stel je voor dat je een online wijnshop bezoekt die
premium wijnen aanbiedt, geselecteerd door sommeliers,
met thuisbezorging in 2-3 dagen."

1. Bij welke prijs PER FLES zou je de kwaliteit in twijfel trekken?
   (te goedkoop)

2. Bij welke prijs PER FLES vind je het een goede deal?
   (goedkoop)

3. Bij welke prijs PER FLES begint het duur te worden,
   maar zou je het nog overwegen?
   (duur)

4. Bij welke prijs PER FLES zou je het nooit kopen?
   (te duur)
```

### Prijsmodellen te Testen

| Model               | Beschrijving                              | Verwacht prijspunt   |
| ------------------- | ----------------------------------------- | -------------------- |
| **Per fles**        | Losse verkoop, €X per fles                | €10-25               |
| **3-pack bundle**   | Thema-gebundeld (bijv. "Italiaans diner") | €30-60 (€10-20/fles) |
| **Maandelijks abo** | 2-3 flessen per maand                     | €25-50/maand         |
| **Kwartaal abo**    | 6 flessen per kwartaal                    | €60-120/kwartaal     |
| **Discovery box**   | 6 kleine samples (187ml)                  | €20-35               |

### Pricing Page Test

Bouw pricing page met 3 tiers:

| Tier        | Naam              | Inhoud                                                      | Verwachte prijs |
| ----------- | ----------------- | ----------------------------------------------------------- | --------------- |
| **Starter** | Ontdek            | 2 flessen/maand, basisadvies                                | €19-25/maand    |
| **Premium** | Sommelier's keuze | 3 flessen/maand, persoonlijk advies, tasting notes          | €35-45/maand    |
| **Luxe**    | Grand Cru         | 2 premium flessen/maand + 1 premium selectie, video content | €55-75/maand    |

### Analyse

- Plot Van Westendorp curves (te goedkoop, goedkoop, duur, te duur)
- Identificeer: Optimal Price Point (OPP) en Acceptable Price Range
- Vergelijk met concurrenten pricing
- Bepaal welk model (los vs abo) hogere conversie heeft

---

# VINO12 — Channel Strategie

**Issue:** VINO-140
**Datum:** 2026-02-08

## Hypothese

```
Wij geloven dat Instagram en Google Ads effectieve acquisitiekanalen zijn
voor NL wijnliefhebbers met een CAC < €25.

We weten dat dit klopt als we ≥50 email signups genereren
tegen ≤€25 per signup binnen 2 weken per kanaal.
```

## Kanaal 1: Instagram

### Ads Strategie

| Element       | Invulling                                                  |
| ------------- | ---------------------------------------------------------- |
| **Objective** | Lead generation (email signup)                             |
| **Audience**  | NL, 25-55, interests: wine, food & drink, cooking, gourmet |
| **Lookalike** | Na eerste 100 signups → 1% lookalike                       |
| **Format**    | Carousel (3-4 wijnen) + Single image + Story               |
| **Budget**    | €500 eerste test, €15-25/dag                               |
| **CTA**       | "Ontdek jouw wijnselectie" → landing page                  |

### Content Ideeën

1. "De 3 wijnen die elke wijnliefhebber moet proeven" (carousel)
2. "Waarom betaal je €15 voor een €8 wijn in de supermarkt?" (single image)
3. "Blind proeverij: €7 vs €20 wijn — welke is welke?" (video/story)
4. Sfeerbeelden: diner setting, kaas & wijn, seizoensgebonden

### Targeting Test Matrix

| Audience                     | Size (est.) | Test Budget |
| ---------------------------- | ----------- | ----------- |
| Wine enthusiasts (interest)  | 200K-400K   | €150        |
| Food & drink + 30-50 + urban | 300K-500K   | €150        |
| Lookalike email list         | Na fase 1   | €200        |

## Kanaal 2: Google Ads (SEA)

### Keywords

| Keyword Cluster     | Est. CPC   | Search Volume/mo |
| ------------------- | ---------- | ---------------- |
| "wijn bestellen"    | €0.80-1.50 | 2.000-5.000      |
| "wijn online kopen" | €0.60-1.20 | 1.000-3.000      |
| "premium wijn"      | €0.40-0.80 | 500-1.500        |
| "wijn abonnement"   | €0.50-1.00 | 200-500          |
| "sommelier advies"  | €0.30-0.60 | 100-300          |
| "wijn cadeau"       | €0.60-1.20 | 1.000-3.000      |

### Ads Structuur

| Campagne   | Ad Group       | Keywords                              |
| ---------- | -------------- | ------------------------------------- |
| Brand      | VINO12         | Brand terms                           |
| Generic    | Wijn bestellen | "wijn bestellen", "wijn kopen online" |
| Premium    | Premium wijn   | "premium wijn", "goede wijn kopen"    |
| Abonnement | Wijn abo       | "wijn abonnement", "wijn club"        |

### Budget Verdeling

| Kanaal     | Budget     | Duur      | Target       |
| ---------- | ---------- | --------- | ------------ |
| Instagram  | €500       | 2-3 weken | 50+ signups  |
| Google Ads | €500       | 2-3 weken | 50+ signups  |
| **Totaal** | **€1.000** | 3 weken   | 100+ signups |

## Success Metrics

| Metric                 | Instagram Target | Google Target |
| ---------------------- | ---------------- | ------------- |
| CAC (email signup)     | < €25            | < €20         |
| CTR                    | > 1%             | > 3%          |
| Landing page conversie | > 5%             | > 8%          |
| Email signups          | ≥ 50             | ≥ 50          |

## Beslissing na Test

| Resultaat                  | Actie                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Beide kanalen CAC < €25    | Gebruik beide, optimaliseer                                 |
| Eén kanaal CAC < €25       | Focus op winnaar, hertest verliezer                         |
| Beide CAC > €25 maar < €40 | Optimaliseer targeting, lagere budget test                  |
| Beide CAC > €40            | Fundamenteel acquisitie probleem → exploreer andere kanalen |

### Alternatieve Kanalen (indien SEA/Social faalt)

| Kanaal                              | Type           | Investering                        |
| ----------------------------------- | -------------- | ---------------------------------- |
| Wijn bloggers/influencers           | Organic/barter | Lage kosten, trage opbouw          |
| Wijnproeverij events                | Offline        | €200-500/event                     |
| Partnerships (kaasboer, restaurant) | Cross-sell     | Revenue share                      |
| SEO/Content                         | Organisch      | Gratis maar langzaam (3-6 maanden) |
| Referral programma                  | Viral          | Na product launch                  |
