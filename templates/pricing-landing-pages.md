# Pricing Landing Page Variants - A/B Test

**Purpose:** Test optimal pricing via revealed preferences (real user behavior)
**Method:** 50/50 traffic split A/B test met verschillende prijzen
**Tracking:** GA4 events voor page_view, cta_click, waitlist_signup
**Duration:** Run tot minimaal 800 visitors per variant

---

## Test Structure

### Control Group (Variant A)

**Prijs:** Van Westendorp OPP (€35/maand voor 2 flessen)
**Rationale:** "Safe" prijs gebaseerd op stated preferences

### Test Group (Variant B)

**Prijs:** 20% hoger dan OPP (€42/maand voor 2 flessen)
**Rationale:** Test if users accept premium positioning

### Alternative Test (Variant C) - Optional

**Prijs:** 15% lager dan OPP (€30/maand voor 2 flessen)
**Rationale:** Test budget segment demand

---

## Landing Page Wireframes

### Common Elements (All Variants)

**Header:**

```
┌────────────────────────────────────────────────────────┐
│  [VINO12 Logo]                    [Login]  [Contact]   │
└────────────────────────────────────────────────────────┘
```

**Footer:**

```
┌────────────────────────────────────────────────────────┐
│  © 2026 VINO12  |  Privacy  |  Voorwaarden  |  Contact │
└────────────────────────────────────────────────────────┘
```

---

## Variant A: Control (€35/maand)

### Hero Section

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│              [Hero Image: Wijnflessen]                  │
│                                                         │
│         Ontdek wijnen die echt bij je passen           │
│                                                         │
│    Gepersonaliseerde wijnaanbevelingen op basis van     │
│              jouw unieke smaakprofiel                   │
│                                                         │
│            ┌──────────────────────────┐                │
│            │  Start je wijnreis →     │  (CTA Button)  │
│            └──────────────────────────┘                │
│                                                         │
│           Vanaf €35/maand voor 2 flessen                │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Copy:**

- **H1:** "Ontdek wijnen die echt bij je passen"
- **H2:** "Gepersonaliseerde wijnaanbevelingen op basis van jouw unieke smaakprofiel"
- **CTA:** "Start je wijnreis →"
- **Price anchor:** "Vanaf €35/maand voor 2 flessen"

---

### How It Works

```
┌────────────────────────────────────────────────────────┐
│                   Hoe werkt het?                        │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐          │
│  │  [Icon]  │   │  [Icon]  │   │  [Icon]  │          │
│  │          │   │          │   │          │          │
│  │  Stap 1  │   │  Stap 2  │   │  Stap 3  │          │
│  │  Profiel │   │ Aanbevel │   │ Ontvang  │          │
│  │  Maken   │   │  ingen   │   │  & Geniet│          │
│  └──────────┘   └──────────┘   └──────────┘          │
│                                                         │
│  Vul 5 min je    Ontvang wijn-  Elke maand 2          │
│  smaakprofiel    aanbevelingen   flessen aan je        │
│  in: zoet/droog  die passen bij  deur. Pas aan         │
│  body, tannines  jouw voorkeuren wanneer je wilt.      │
│  regio, druiven                                         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Icons:** Gebruik simple line icons (bijv. van Lucide or Heroicons)

---

### Pricing Card

```
┌────────────────────────────────────────────────────────┐
│                Kies je abonnement                       │
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │                                               │     │
│  │         VINO12 Maandelijks                    │     │
│  │                                               │     │
│  │              €35 /maand                       │     │ <- VARIANT A PRICE
│  │                                               │     │
│  │  ✓ 2 gepersonaliseerde flessen per maand     │     │
│  │  ✓ Smaakprofiel aangepast aan jouw smaak     │     │
│  │  ✓ Ontdek nieuwe wijnen elke maand           │     │
│  │  ✓ Flexibel: pauzeer of annuleer elk moment  │     │
│  │  ✓ Gratis verzending                          │     │
│  │                                               │     │
│  │       ┌────────────────────────┐             │     │
│  │       │  Word early adopter →  │  (CTA)      │     │
│  │       └────────────────────────┘             │     │
│  │                                               │     │
│  │  Lancering Q2 2026 · Korting voor vroege     │     │
│  │         aanmelders: 20% eerste 3 maanden     │     │
│  │                                               │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**CTA Button:**

- Text: "Word early adopter →"
- Color: Primary brand color (e.g., wine red #8B0000)
- Size: Large, prominent
- Action: Scroll to waitlist form

---

### Social Proof

```
┌────────────────────────────────────────────────────────┐
│            Wat anderen zeggen (concept)                │
│                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────┐ │
│  │ "Eindelijk een │  │ "Ontdekte      │  │ "Mijn    │ │
│  │  manier om wijn│  │  prachtige     │  │  nieuwe  │ │
│  │  te ontdekken  │  │  Italiaanse    │  │  vrijdag │ │
│  │  zonder gedoe!"│  │  wijnen die ik │  │  avond   │ │
│  │                │  │  nooit had     │  │  ritual" │ │
│  │  - Lisa, A'dam │  │  geprobeerd"   │  │          │ │
│  │  ★★★★★         │  │  - Mark, Utrecht│ │ - Emma   │ │
│  └────────────────┘  └────────────────┘  └──────────┘ │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Note:** These zijn concept testimonials voor early testing. Vervang met echte customer reviews na launch.

---

### Waitlist Form (Commitment Test)

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│       Krijg 20% korting als early adopter              │
│                                                         │
│  Schrijf je in voor de waitlist en ontvang als een    │
│  van de eersten toegang tot VINO12. Plus: 20% korting │
│  op je eerste 3 maanden.                               │
│                                                         │
│  ┌──────────────────────────────────────────┐         │
│  │  Email adres                             │         │
│  │  _______________________________________ │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│  ┌──────────────────────────────────────────┐         │
│  │  Voornaam (optioneel)                    │         │
│  │  _______________________________________ │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│      ┌────────────────────────────┐                   │
│      │  Schrijf me in voor €28 →  │  (CTA Button)     │
│      └────────────────────────────┘                   │
│            (€35 - 20% = €28)                           │
│                                                         │
│  Door je in te schrijven ga je akkoord met onze       │
│  voorwaarden en privacybeleid.                         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Key elements:**

- Email field (required)
- Voornaam field (optional, helpt met personalisatie)
- CTA toont discounted price (€28 vs €35 voor Variant A)
- Trust signals: Privacy link, GDPR-compliant

**Form submission:**

- Success message: "Je bent toegevoegd aan de waitlist! Check je inbox voor bevestiging."
- Confirmation email: Automated via Resend
- Add to Mailchimp/Klaviyo lijst: "VINO12 Waitlist - Variant A"

---

## Variant B: Test (€42/maand)

**Identical layout to Variant A**, EXCEPT:

### Pricing Card Differences

```
│              €42 /maand                       │ <- VARIANT B PRICE
│                                               │
│  ✓ 2 premium gepersonaliseerde flessen        │ <- ADD "premium"
│  ✓ Smaakprofiel door wine expert gecureerd   │ <- Enhanced copy
│  ✓ Ontdek exclusieve wijnen elke maand       │ <- "exclusieve"
│  ✓ Flexibel: pauzeer of annuleer elk moment  │
│  ✓ Gratis verzending                          │
│  ✓ Maandelijkse tasting notes van sommelier  │ <- Extra feature
```

**Waitlist CTA adjustment:**

```
│      Schrijf me in voor €33.60 →  │  (CTA Button)
│            (€42 - 20% = €33.60)
```

**Rationale:**

- Premium positioning ("premium", "exclusieve", "sommelier")
- Extra feature: Tasting notes (low cost add-on)
- Test if perceived value justifies 20% higher price

---

## Variant C: Budget (€30/maand) - Optional

**Identical layout to Variant A**, EXCEPT:

### Pricing Card Differences

```
│              €30 /maand                       │ <- VARIANT C PRICE
│                                               │
│  ✓ 2 gepersonaliseerde flessen per maand     │
│  ✓ Smaakprofiel aangepast aan jouw smaak     │
│  ✓ Ontdek nieuwe wijnen elke maand           │
│  ✓ Flexibel: pauzeer of annuleer elk moment  │
│  ✓ Verzending: €4,95/maand                    │ <- NOT free
```

**Waitlist CTA adjustment:**

```
│      Schrijf me in voor €24 →  │  (CTA Button)
│            (€30 - 20% = €24)
```

**Rationale:**

- Budget-conscious segment test
- Offset lower price with shipping fee (net: €34.95 ≈ Variant A)
- Test if "lower sticker price" drives more signups

---

## A/B Test Setup

### URL Structure

**Variant A (Control):**

```
https://vino12.nl/join?variant=a
```

**Variant B (Test):**

```
https://vino12.nl/join?variant=b
```

**Variant C (Optional):**

```
https://vino12.nl/join?variant=c
```

### Traffic Split

**Tool:** Vercel Edge Config or Google Optimize

**Split:**

- Variant A: 50%
- Variant B: 50%

OR (if testing 3 variants):

- Variant A: 33%
- Variant B: 33%
- Variant C: 33%

**Session persistence:** Cookie-based (same user sees same variant on return)

---

## Tracking Setup

### GA4 Events

**Event 1: Page View**

```javascript
gtag("event", "page_view", {
  page_title: "VINO12 Pricing Landing Page",
  page_location: window.location.href,
  variant: "A", // or 'B', 'C'
  price_point: "35.00", // or '42.00', '30.00'
});
```

**Event 2: CTA Click (Hero)**

```javascript
gtag("event", "cta_click", {
  cta_location: "hero",
  cta_text: "Start je wijnreis",
  variant: "A",
  price_point: "35.00",
});
```

**Event 3: CTA Click (Pricing Card)**

```javascript
gtag("event", "cta_click", {
  cta_location: "pricing_card",
  cta_text: "Word early adopter",
  variant: "A",
  price_point: "35.00",
});
```

**Event 4: Waitlist Signup**

```javascript
gtag("event", "waitlist_signup", {
  variant: "A",
  price_point: "35.00",
  discounted_price: "28.00", // With 20% early adopter discount
  value: 28.0, // For conversion value tracking
});
```

### Funnel Metrics

| Metric                   | Definition                      | Goal                |
| ------------------------ | ------------------------------- | ------------------- |
| **Page Views**           | Unique visitors per variant     | ~800 each           |
| **CTA Click Rate**       | (CTA clicks / page views) × 100 | >15%                |
| **Waitlist Signup Rate** | (Signups / page views) × 100    | >5% (strong signal) |
| **Cost per Signup**      | Ad spend / signups              | <€5                 |

---

## Success Criteria

### Green Light Scenarios (Launch at this price)

| Variant     | Scenario                                        | Action                              |
| ----------- | ----------------------------------------------- | ----------------------------------- |
| **A (€35)** | Signup rate >5%, higher than B                  | Launch at €35                       |
| **B (€42)** | Signup rate >5%, equal or higher than A         | Launch at €42 (premium positioning) |
| **C (€30)** | Signup rate >>8%, significantly higher than A/B | Launch at €30 (budget segment)      |

### Yellow Light Scenarios (Iterate)

| Variant                           | Scenario               | Action                                |
| --------------------------------- | ---------------------- | ------------------------------------- |
| **All**                           | Signup rate 2-5%       | Adjust copy, value props, or discount |
| **B higher price, lower signups** | B rate <3%, A rate >5% | Price elasticity issue, test €38      |

### Red Light Scenarios (Pivot)

| Variant                      | Scenario                        | Action                               |
| ---------------------------- | ------------------------------- | ------------------------------------ |
| **All**                      | Signup rate <2%                 | Value proposition issue, not pricing |
| **High clicks, low signups** | CTA click rate >15%, signup <2% | Friction in form or commitment level |

---

## Implementation Checklist

### Pre-Launch

- [ ] Design variants in Figma (use design-standards skill)
- [ ] Build landing pages in Next.js (Vercel deployment)
- [ ] Set up Vercel Edge Config for A/B split
- [ ] Configure GA4 events (4 events per variant)
- [ ] Set up Resend confirmation email flow
- [ ] Create Mailchimp/Klaviyo lists per variant
- [ ] Test form submissions end-to-end
- [ ] QA on desktop + mobile (Chrome, Safari, Firefox)

### During Test

- [ ] Monitor daily: Page views, CTA clicks, signups
- [ ] Check GA4 dashboard weekly
- [ ] Verify email confirmations sent
- [ ] Watch for bot spam (unusual signup patterns)
- [ ] Adjust ad spend if one variant clearly winning

### Post-Test (After 800+ visitors each)

- [ ] Export data from GA4
- [ ] Calculate conversion rates per variant
- [ ] Run statistical significance test (chi-square)
- [ ] Compare with Van Westendorp stated preferences
- [ ] Decide on launch price
- [ ] Prepare findings presentation

---

## Statistical Significance

**Minimum sample size:** 800 visitors per variant

**Formula:**

```
n = (Z² × p × (1-p)) / E²
```

Where:

- Z = 1.96 (95% confidence)
- p = expected conversion rate (assume 5%)
- E = margin of error (2%)

**Result:** ~456 per variant (round up to 800 for safety)

**Test significance:**

Use online calculator (e.g., https://www.optimizely.com/ab-testing-calculator/) with:

- Visitors A: 800
- Conversions A: 40 (5%)
- Visitors B: 800
- Conversions B: 48 (6%)

If p-value <0.05 → statistically significant difference.

---

## Alternative: Pre-Order Test (Higher Commitment)

**Instead of waitlist, test pre-orders with payment.**

### Modified CTA Section

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│       Reserveer nu met 50% korting                     │
│                                                         │
│  Pre-order je eerste maand VINO12 nu voor €17,50      │
│  (normaal €35). Bezorging in april 2026.              │
│                                                         │
│      ┌────────────────────────────┐                   │
│      │  Betaal €17,50 en reserveer│  (CTA Button)     │
│      └────────────────────────────┘                   │
│                                                         │
│  100% geld-terug-garantie als je niet tevreden bent.  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Payment:** Mollie iDEAL integration

**Pros:**

- Stronger signal (actual payment vs email)
- Revenue validation
- Lower risk of fake signups

**Cons:**

- Higher friction (conversion rate will be lower)
- Requires payment processing setup
- Refund handling

---

## Design Assets Needed

### Images

1. **Hero image:**
   - Wine bottles (2-3 flessen)
   - Clean, modern aesthetic
   - Neutral background
   - High quality (at least 2000px wide)

2. **Step icons:**
   - Icon 1: Profile/user silhouette
   - Icon 2: Wine glass with sparkle
   - Icon 3: Package/delivery box

3. **Social proof avatars (optional):**
   - Placeholder avatars if no real customers yet

### Brand Assets

- Logo (SVG format)
- Brand colors (hex codes)
- Typography (Google Fonts or custom)

**Recommendation:** Use stock photos from Unsplash/Pexels for MVP, commission custom photography post-launch.

---

## Technical Stack

**Frontend:**

- Next.js 14 (App Router)
- Tailwind CSS
- Shadcn/ui components
- React Hook Form (form validation)

**Backend:**

- Vercel serverless functions (form submission)
- Resend (email confirmation)
- Supabase (store waitlist emails)
- GA4 (tracking)

**A/B Testing:**

- Vercel Edge Config (traffic split)
- Middleware for variant assignment

---

## Next Steps After Landing Page Test

### If Successful (>5% signup rate)

1. **Launch MVP:**
   - Build taste profile quiz (5 min)
   - Integrate with wine supplier API
   - Set up Mollie payment flow
   - Launch to waitlist

2. **Email waitlist:**
   - "We're live! Use code EARLY20 for 20% off"
   - Segment by variant (personalize messaging)

3. **Monitor conversions:**
   - Waitlist → paid signup rate
   - Track actual pricing acceptance

### If Unsuccessful (<2% signup rate)

1. **Revisit value proposition:**
   - Run Mom Test interviews (templates available)
   - Identify real pain points
   - Adjust messaging

2. **Test different pricing model:**
   - Per bottle instead of subscription?
   - Gift boxes for occasions?
   - Premium tier with sommelier calls?

3. **Consider pivot:**
   - Maybe market isn't ready
   - Or execution needs refinement

---

_Landing page design for: VINO12 Pricing Validation (VINO-138)_
_Version: 1.0_
_Created: 2026-02-08_
