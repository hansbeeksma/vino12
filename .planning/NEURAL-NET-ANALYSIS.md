# VINO12 Neural Net Analyse — Cross-Industry Success Mapping

**Datum**: 8 februari 2026
**Bronnen**: Perplexity Deep Research (50+ bronnen), SVB D2C Wine Reports, Wine Australia 2024
**Status**: Gevalideerd en geimplementeerd via feature flags

---

## Executive Summary

VINO12 heeft een solide commerciele basis (Tier 1+2 = ~60% code), maar ~25% van de codebase bestaat uit over-engineered features (Tier 4: AR, CV Scanner, Voice Commerce, Blockchain) met onbewezen ROI. De meest relevante benchmark (Plonk Wine Club: $12.1M/jaar met 2 medewerkers) bewijst dat expert curation + email-first effectiever is dan technologie-forward.

**Beslissing**: Launch met Tier 1+2, feature-flag Tier 3+4.

---

## Feature Tiers

### Tier 1: ESSENTIEEL (Always ON)

| Feature                   | Bestanden                                          | Status |
| ------------------------- | -------------------------------------------------- | ------ |
| Productcatalogus          | `wines.json`, `/wijnen`, `WineCard`, `WineDetail`  | ON     |
| Winkelwagen + Checkout    | `cart/store.ts`, `/afrekenen`, `/winkelwagen`      | ON     |
| Betalingen (Mollie/iDEAL) | `lib/mollie.ts`, `api/checkout`, `webhooks/mollie` | ON     |
| Leeftijdsverificatie      | `AgeGate.tsx`, `api/age-verify`, middleware        | ON     |
| SEO & Structured Data     | `JsonLd.tsx`, `sitemap.ts`, `robots.ts`            | ON     |
| Email (Resend)            | `lib/resend.ts`, `email/templates.ts`              | ON     |
| Privacy/GDPR              | `CookieConsent`, `gdpr/export`, `gdpr/delete`      | ON     |

### Tier 2: HOOG WAARDEVOL (ON at launch)

| Feature                   | Flag                      | Status |
| ------------------------- | ------------------------- | ------ |
| Reviews & Ratings         | `reviews.enabled`         | ON     |
| Zoekfunctionaliteit       | `search.advanced`         | ON     |
| Wine Club / Subscriptions | `wineclub.enabled`        | ON     |
| Personalisatie (Gorse)    | `recommendations.enabled` | ON     |
| Account Management        | `account.enabled`         | ON     |
| Wishlist                  | `wishlist.enabled`        | ON     |
| Pairing Informatie        | `pairings.enabled`        | ON     |

### Tier 3: NICE-TO-HAVE (OFF at launch)

| Feature                      | Flag                    | Trigger                        |
| ---------------------------- | ----------------------- | ------------------------------ |
| Gamification (Badges/Points) | `gamification.enabled`  | >500 actieve klanten           |
| Social Proof Indicators      | `social.proof`          | >100 reviews                   |
| Leaderboard                  | `leaderboard.enabled`   | >1000 actieve users            |
| 3D Wine Bottles              | `three.bottles`         | A/B test bij voldoende traffic |
| Visual Effects (Particles)   | `effects.particles`     | Brand experience beslissing    |
| Cursor Trail                 | `effects.cursor_trail`  | Brand experience beslissing    |
| Celebration Burst            | `effects.celebration`   | Brand experience beslissing    |
| Hero Gradient                | `effects.hero_gradient` | Brand experience beslissing    |
| Instagram Stories            | `instagram.stories`     | Social media strategie         |

### Tier 4: OVER-ENGINEERED (OFF)

| Feature                 | Flag                 | Trigger                                  |
| ----------------------- | -------------------- | ---------------------------------------- |
| AR Wine Labels          | `ar.enabled`         | Marketing campagne budget + paid traffic |
| Computer Vision Scanner | `cv.scanner`         | Native app ontwikkeling + 10K+ wijnen    |
| Voice Commerce          | `voice.enabled`      | >5000 klanten + brand awareness          |
| Blockchain Traceability | `blockchain.enabled` | Premium lijn (>50 euro) + schaal         |
| Creative Boards         | `admin.creative`     | Vervangen door Notion/Trello             |
| AI Idea Analysis        | `admin.ideas`        | Interne tool evaluatie                   |
| WhatsApp Webhook        | `whatsapp.webhook`   | WhatsApp Business API setup              |

---

## Referentiebedrijven

| Bedrijf          | Omzet  | Kernstrategie                   | VINO12 Relevantie |
| ---------------- | ------ | ------------------------------- | ----------------- |
| Plonk Wine Club  | $12.1M | Expert curation + email-first   | ZEER HOOG         |
| Naked Wines      | $366M  | Community funding               | HOOG              |
| Stumptown Coffee | -      | 66% e-commerce subscriptions    | HOOG              |
| Nespresso        | $6.5B  | Engagement-centered             | HOOG (model)      |
| Sephora BI       | -      | 80% loyalty-driven transactions | HOOG              |

---

## KPI Targets (Launch)

| KPI                  | Target    | Benchmark                   |
| -------------------- | --------- | --------------------------- |
| Conversie Rate       | 1.5-2.0%  | EMEA premium: 1.5-3%        |
| AOV                  | EUR 60-80 | Premium curated: EUR 50-100 |
| CAC                  | <EUR 50   | Industry benchmark          |
| Monthly Churn (subs) | <10%      | Curation model: 10-15%      |
| Email Open Rate      | >25%      | Wine vertical: 25-35%       |
| LTV/CAC Ratio        | >3:1      | Top performers: 4:1-5:1     |

---

## Implementatie

Feature flags zijn geimplementeerd in:

- `src/lib/feature-flags.ts` — Configuratie en defaults
- `src/components/ui/FeatureFlag.tsx` — React component wrapper
- Override via env: `NEXT_PUBLIC_FF_<FLAG_NAME>=true|false`

Alle Tier 4 features zijn gedeactiveerd via:

- Route-level redirects (AR, Scan, Verificatie pages)
- API-level guards (Voice, Traceability, Gamification routes)
- Layout-level guards (Admin Creative, Admin Ideas)
- Component-level conditionals (Header nav links)

Alle Tier 3 features zijn gedeactiveerd via:

- Component wrapping met `<FeatureFlag>` (Effects, Celebrations)
- Conditional rendering (3D toggle, Stories, Social Proof, Badges)
- API-level guards (Gamification endpoints)
