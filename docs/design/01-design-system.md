---
project: "VINO12"
version: "1.0.0"
last_updated: "2026-02-08"
maturity: "scaling"
status: "draft"
owner: "Sam Swaab"
figma_url: ""
design_tokens_path: "src/lib/design-tokens.ts"
---

# VINO12 Design System

> Neo-Brutalist Wine E-Commerce — "6 Rood. 6 Wit. Perfecte Balans."

Referentie: `docs/DESIGN-SYSTEM.md` (origineel), `src/lib/design-tokens.ts` (tokens)

---

## Design Principles

| #   | Principle                 | Description                                                                      | Application                                                 |
| --- | ------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | **Brutale Eerlijkheid**   | Geen afgeronde hoeken, geen subtiele gradients. Direct, eerlijk, en ongepolijst. | 0px border-radius everywhere, thick borders, offset shadows |
| 2   | **Typografisch Gedreven** | IBM Plex Mono als display font geeft industrieel, no-nonsense karakter.          | Mono typography for headings, prices, labels                |
| 3   | **Chiaroscuro Contrast**  | Sterke licht-donker contrasten. Elke kleurkeuze is bewust en krachtig.           | Ink on offwhite (16.8:1), wine accents on light backgrounds |
| 4   | **Gestructureerde Chaos** | Strakke grids gecombineerd met brutale offsets en schaduwen.                     | Modular grid + brutal shadows that break the grid           |

**Trade-off decisions:**

| When we face...              | We choose...          | Over...                               |
| ---------------------------- | --------------------- | ------------------------------------- |
| Polish vs authenticity       | Authenticity          | Polish feels fake for wine            |
| Animation vs instant         | Instant state changes | Transitions dilute brutalist impact   |
| Luxury signals vs directness | Directness            | Target audience values honesty        |
| Flexibility vs consistency   | Consistency           | Brutalist style requires strict rules |

---

## Design Tokens

> Source of truth: `src/lib/design-tokens.ts`

### Token Architecture

```
design-tokens.ts (TypeScript definitions)
    ↓
tailwind.config.ts (Tailwind integration)
    ↓
globals.css (CSS Custom Properties)
    ↓
Components (runtime)
```

### Color Tokens

| Token       | Hex       | Usage                              |
| ----------- | --------- | ---------------------------------- |
| `wine-500`  | `#722F37` | Primary brand, CTAs, selection     |
| `ink`       | `#000000` | Text, borders, shadows             |
| `offwhite`  | `#FAFAF5` | Page background                    |
| `champagne` | `#F7E6CA` | Secondary background, hover states |
| `burgundy`  | `#660033` | Premium accent, hero sections      |
| `emerald`   | `#00674F` | Success, "op voorraad"             |

**Wine scale:** 50-950 (11 steps) — See `design-tokens.ts` for full scale.

**Semantic colors:**
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#00674F` | Positive actions, availability |
| `error` | `#C41E3A` | Errors, destructive |
| `warning` | `#E89B00` | Caution |
| `info` | `#2563EB` | Informational |

### Typography Tokens

| Role    | Font             | Fallback   | Usage                    |
| ------- | ---------------- | ---------- | ------------------------ |
| Display | IBM Plex Mono    | monospace  | Headings, hero, prices   |
| Body    | Darker Grotesque | sans-serif | Body text, descriptions  |
| Accent  | Space Mono       | monospace  | Labels, badges, metadata |

**Type scale:** Major Third (1.25 ratio) — 10/12/14/16/20/25/31/39/49/61px

### Brutal Tokens

| Token                        | Value                       | Usage                            |
| ---------------------------- | --------------------------- | -------------------------------- |
| `brutal.borderWidth.DEFAULT` | `4px`                       | Standard component borders       |
| `brutal.borderWidth.lg`      | `6px`                       | Featured/hero components         |
| `brutal.shadow.DEFAULT`      | `4px 4px 0 rgba(0,0,0,0.8)` | Standard offset shadow           |
| `brutal.shadow.wine`         | `4px 4px 0 #722F37`         | CTA buttons                      |
| `brutal.borderRadius`        | `0px`                       | Always. Everywhere.              |
| `brutal.hover.translate`     | `4px`                       | Hover: translate + remove shadow |

### Animation Tokens

| Token              | Value                          | Usage                          |
| ------------------ | ------------------------------ | ------------------------------ |
| `duration.instant` | `0ms`                          | Default: instant state changes |
| `easing.brutal`    | `steps(1)`                     | No interpolation               |
| `easing.smooth`    | `cubic-bezier(0.4, 0, 0.2, 1)` | Marquee, carousel only         |

---

## Component Inventory

### UI Primitives

| Component    | Status | Category | A11y                      |
| ------------ | ------ | -------- | ------------------------- |
| BrutalButton | Stable | `ui/`    | Keyboard, focus ring      |
| BrutalCard   | Stable | `ui/`    | Semantic article          |
| BrutalBadge  | Stable | `ui/`    | Decorative/informative    |
| MarqueeStrip | Stable | `ui/`    | `aria-hidden`, decorative |
| PremiumBadge | Stable | `ui/`    | `aria-label`              |
| ProgressBar  | Stable | `ui/`    | `role="progressbar"`      |
| SectionLabel | Stable | `ui/`    | Heading element           |
| FeatureFlag  | Stable | `ui/`    | N/A (dev-only)            |
| FeatureGate  | Stable | `ui/`    | N/A (dev-only)            |

### Wine Components

| Component          | Status | Category | A11y                           |
| ------------------ | ------ | -------- | ------------------------------ |
| WineCard           | Stable | `wine/`  | Article, alt text, price label |
| WineDetail         | Stable | `wine/`  | Heading hierarchy              |
| StarRating         | Stable | `wine/`  | Radio group / img              |
| TastingProfile     | Stable | `wine/`  | Visual + text                  |
| BodyScale          | Stable | `wine/`  | Labeled scale                  |
| PairingTags        | Stable | `wine/`  | List semantics                 |
| ReviewForm         | Beta   | `wine/`  | Form labels, validation        |
| ReviewSection      | Stable | `wine/`  | Heading + list                 |
| BottleSilhouette   | Stable | `wine/`  | Decorative `alt=""`            |
| WishlistButton     | Beta   | `wine/`  | Toggle, `aria-pressed`         |
| RecentlyViewed     | Beta   | `wine/`  | List, `aria-label`             |
| TrackView          | Beta   | `wine/`  | Analytics, hidden              |
| WineSpotlightSlide | Stable | `wine/`  | Carousel item                  |

### Shop Components

| Component            | Status | Category | A11y                       |
| -------------------- | ------ | -------- | -------------------------- |
| AddToCartButton      | Stable | `shop/`  | Loading state, `aria-busy` |
| CartButton           | Stable | `shop/`  | Badge count, `aria-label`  |
| CartDrawer           | Stable | `shop/`  | Dialog, focus trap         |
| BadgeDisplay         | Stable | `shop/`  | Informative badges         |
| SocialProofIndicator | Beta   | `shop/`  | Live region                |

### Layout Components

| Component | Status | Category  | A11y                 |
| --------- | ------ | --------- | -------------------- |
| Header    | Stable | `layout/` | Banner, nav landmark |
| Footer    | Stable | `layout/` | Contentinfo landmark |

### Section Components

| Component         | Status | Category    | A11y             |
| ----------------- | ------ | ----------- | ---------------- |
| HeroSection       | Stable | `sections/` | h1, skip target  |
| CollectionGrid    | Stable | `sections/` | Grid, heading    |
| CtaSection        | Stable | `sections/` | CTA link/button  |
| PhilosophySection | Stable | `sections/` | Content section  |
| StoriesCarousel   | Beta   | `sections/` | Carousel pattern |
| WineCarousel      | Beta   | `sections/` | Carousel pattern |
| WineJourney       | Beta   | `sections/` | Stepper pattern  |

### Motion/Effects

| Component          | Status | Category   | A11y                      |
| ------------------ | ------ | ---------- | ------------------------- |
| AnimatedSection    | Stable | `motion/`  | `prefers-reduced-motion`  |
| StaggerGrid        | Stable | `motion/`  | `prefers-reduced-motion`  |
| CelebrationBurst   | Beta   | `effects/` | Decorative, hidden        |
| CursorTrail        | Beta   | `effects/` | Decorative, hidden        |
| HeroGradient       | Stable | `effects/` | Decorative, `aria-hidden` |
| WineParticles      | Beta   | `effects/` | Decorative, hidden        |
| WinePourEffect     | Beta   | `effects/` | Decorative, hidden        |
| WineMeshBackground | Beta   | `effects/` | Decorative, hidden        |
| SectionGradientBg  | Stable | `effects/` | Decorative                |
| PhysicsPlayground  | Alpha  | `effects/` | Experimental              |

### Compliance

| Component     | Status | Category      | A11y                     |
| ------------- | ------ | ------------- | ------------------------ |
| AgeGate       | Stable | `compliance/` | Alert dialog, focus trap |
| CookieConsent | Stable | `compliance/` | Banner, dismiss          |

### Specialist Components

| Component            | Status | Category     | A11y                     |
| -------------------- | ------ | ------------ | ------------------------ |
| SearchBar            | Beta   | `search/`    | Search role, combobox    |
| WineScanner (CV)     | Alpha  | `cv/`        | Camera access, fallback  |
| ScanResult           | Alpha  | `cv/`        | Result display           |
| ARSceneViewer        | Alpha  | `ar/`        | Fallback image           |
| ARWineOverlay        | Alpha  | `ar/`        | Fallback content         |
| WineBottle3D         | Alpha  | `three/`     | Fallback image           |
| WineBottleShowcase   | Alpha  | `three/`     | Fallback image           |
| VoiceCommandButton   | Alpha  | `voice/`     | `aria-label`, mic access |
| VoiceCommandFeedback | Alpha  | `voice/`     | Live region              |
| VoiceCommandWrapper  | Alpha  | `voice/`     | Container                |
| StoryProgressBar     | Beta   | `instagram/` | Progress indicator       |
| StorySlide           | Beta   | `instagram/` | Slide content            |
| LogoutButton         | Stable | `auth/`      | Button semantics         |
| JsonLd               | Stable | `seo/`       | Hidden, SEO-only         |

### Ideas/Creative (Admin)

| Component            | Status | Category    | A11y             |
| -------------------- | ------ | ----------- | ---------------- |
| IdeaCard             | Beta   | `ideas/`    | Card pattern     |
| IdeaDetail           | Beta   | `ideas/`    | Detail view      |
| IdeasDashboard       | Beta   | `ideas/`    | Dashboard        |
| AnalysisView         | Beta   | `ideas/`    | Data display     |
| ActionPlan           | Beta   | `ideas/`    | Checklist        |
| BoardCard            | Beta   | `creative/` | Card pattern     |
| BoardDetail          | Beta   | `creative/` | Detail view      |
| BoardGrid            | Beta   | `creative/` | Grid layout      |
| ContributorDashboard | Beta   | `creative/` | Dashboard        |
| IdeaInputForm        | Beta   | `creative/` | Form             |
| NoteCard             | Beta   | `creative/` | Card pattern     |
| NoteEditor           | Beta   | `creative/` | Rich text editor |
| QuickIdeaInput       | Beta   | `creative/` | Inline form      |
| VoiceRecorder        | Beta   | `creative/` | Audio recording  |

**Totaal: 80 componenten** (9 stable UI, 13 wine, 5 shop, 2 layout, 7 sections, 10 effects, 2 compliance, 18 specialist, 14 ideas/creative)

---

## Patterns

### Hover Pattern (Brutal)

```
Default:  shadow + no translate
Hover:    translate(4px, 4px) + shadow: none
Active:   translate(4px, 4px) + shadow: none + bg darken
```

No transitions. Instant state changes. Brutalist.

### Card Pattern

All cards share: 4px border, brutal-shadow, offwhite background, 0px radius.

### Price Display

```
Font: IBM Plex Mono, 700
Format: "€28,50" (Dutch locale)
Size: heading-md (31px) on detail, body-lg (20px) on cards
```

### Badge Pattern

```
Font: Space Mono, 700, 12px, uppercase, 0.1em tracking
Border: 2px solid ink
Variants: transparent | champagne | wine background
```

---

_Template: ~/Development/shared/communicating-design/templates/01-design-system.md_
