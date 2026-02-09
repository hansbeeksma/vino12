# Pricing Experiment Protocol

**VINO12 - Real-World Pricing Validation**

---

## Overview

**Doel:** Valideer prijzen met **revealed preferences** (echte gedrag) via landing page experiments en waitlist signups.

**Principe:** Van Westendorp geeft **stated preferences** ("wat zou je betalen"), dit protocol test **revealed preferences** ("wat betaal je echt").

**Methodologie:** A/B testing met verschillende prijzen op landing page, meten van conversion rates.

**Timeline:** 2-4 weken per experiment.

---

## Why Test Real Behavior?

### The Gap Between Saying and Doing

**Stated Preferences (Van Westendorp):**

- "Ik zou €30/maand betalen voor dit"
- Hypothetische scenario, geen commitment

**Revealed Preferences (Real behavior):**

- Klikken op "Meld je aan voor €30/maand"
- Invullen van email + betaalgegevens
- Daadwerkelijke conversie

**Typical gap:** 30-50% lower conversion than stated willingness to pay.

**Example:**

```
Van Westendorp zegt: 70% accepteert €30/maand
Landing page test toont: 35% converteert bij €30/maand

→ Revealed preference is 2x lager dan stated
```

**Implication:** Gebruik Van Westendorp voor range, test real behavior voor finale prijs.

---

## Experiment Types

### Type 1: Waitlist Signup (Low Commitment)

**Setup:** Landing page met pricing, vraag alleen email.

**Commitment level:** ⭐ Low

**Conversion baseline:** 5-15%

**Validity:** Medium (email is gratis, maar toont interesse)

**Best for:** Early stage, breed testen

### Type 2: Pre-Order with Payment (High Commitment)

**Setup:** Landing page met pricing, vraag betaalgegevens (credit card).

**Commitment level:** ⭐⭐⭐ High

**Conversion baseline:** 0.5-2%

**Validity:** High (echte betaling = revealed preference)

**Best for:** Final validation before launch

### Type 3: Limited Early Access (Medium Commitment)

**Setup:** Landing page met pricing, vraag €10 deposit voor early access.

**Commitment level:** ⭐⭐ Medium

**Conversion baseline:** 2-5%

**Validity:** High (betaling is commitment, maar lager bedrag)

**Best for:** Balancing validity and conversion volume

---

## Type 1: Waitlist A/B Test

### Hypothesis

**H0 (Null):** Pricing heeft geen effect op waitlist signups.

**H1 (Alt):** Lagere prijs leidt tot hogere waitlist conversie.

**Metric:** Conversion rate (visitors → waitlist signups)

**Decision rule:** If H1 confirmed (statistically significant lift at lower price), choose lower price. If no difference, choose higher price (more revenue).

### Landing Page Setup

**Traffic split:** 50/50 tussen variant A en B

**Variant A:** €25/maand

**Variant B:** €35/maand

**Everything else identical:**

- Copy
- Design
- Call-to-action
- Images

**Only difference:** Pricing display

### Page Structure

**Section 1: Hero**

```
VINO12
Ontdek wijnen die perfect bij jouw smaak passen

[Visual: Wijnfles + glas op mooie tafel]

[CTA Button: "Meld je aan voor de waitlist"]
```

**Section 2: How It Works**

```
Hoe werkt het?

1. Vul je smaakprofiel in
   [Icon: Checkmark]
2. Ontvang maandelijks 3 gepersonaliseerde wijnen
   [Icon: Wijnfles]
3. Leer en verfijn je voorkeuren
   [Icon: Graph up]
```

**Section 3: Pricing** (VARIANT DIFFERENCE)

**Variant A:**

```
Probeer VINO12 voor €25/maand

✓ 3 premium wijnen per maand (€15-€40 per fles)
✓ Persoonlijke aanbevelingen
✓ Food pairing suggesties
✓ Gratis verzending

Eerste maand 50% korting - slechts €12.50

[CTA Button: "Ja, ik wil dit proberen"]
```

**Variant B:**

```
Probeer VINO12 voor €35/maand

✓ 3 premium wijnen per maand (€20-€50 per fles)
✓ Persoonlijke aanbevelingen
✓ Food pairing suggesties
✓ Gratis verzending
✓ Exclusieve member content

Eerste maand 50% korting - slechts €17.50

[CTA Button: "Ja, ik wil dit proberen"]
```

**Section 4: Social Proof**

```
"VINO12 heeft me geholpen om wijnen te ontdekken die ik anders nooit
geprobeerd zou hebben. Elke maand is een verrassing!"
— Sophie, Amsterdam
```

**Section 5: FAQ**

```
Kan ik opzeggen?
→ Ja, maandelijks opzegbaar. Geen lange termijn verplichtingen.

Wanneer lanceren jullie?
→ We verwachten maart 2026. Waitlist members krijgen voorrang.

Wat als ik een wijn niet lekker vind?
→ Geen probleem! Je kunt aangeven wat je niet lekker vond en we passen
   je profiel aan voor de volgende maand.
```

**Section 6: Final CTA**

```
Wees er vroeg bij

We lanceren met beperkte plekken. Meld je aan voor de waitlist
en krijg 50% korting op je eerste maand.

[Email Input Field]
[CTA Button: "Meld me aan"]

Geen spam. Je krijgt 1 email wanneer we live gaan.
```

### Tracking Setup

**Analytics tool:** Google Analytics 4, Plausible, of Fathom

**Events to track:**

1. **Page View**
   - Event: `page_view`
   - Property: `variant` (A or B)
2. **CTA Click** (any button)
   - Event: `cta_click`
   - Property: `variant`, `button_location` (hero, pricing, footer)
3. **Email Submit**
   - Event: `waitlist_signup`
   - Property: `variant`, `price_shown`

**Conversion funnel:**

```
Page View → CTA Click → Email Submit

Variant A: 1000 → 300 → 80 (8% conversion)
Variant B: 1000 → 320 → 65 (6.5% conversion)

→ A performs better (higher conversion)
→ But: Check if revenue is also higher
```

### Sample Size Calculation

**Formula:**

```
n = (Z^2 * p * (1-p)) / E^2

Where:
Z = 1.96 (95% confidence level)
p = expected conversion rate (estimate: 10%)
E = margin of error (5%)

n = (1.96^2 * 0.10 * 0.90) / 0.05^2
n = (3.84 * 0.09) / 0.0025
n = 138 per variant
→ Total needed: ~280 visitors
```

**For 80% statistical power to detect 2% difference:**

→ Need **~800 visitors per variant** (1600 total)

**Traffic sources:**

- Google Ads (€500 budget @ €0.50 CPC = 1000 clicks)
- Facebook Ads (€300 budget @ €0.30 CPC = 1000 clicks)
- Organic (SEO, social media) = 200-500 visitors

**Timeline:** 2-4 weeks depending on traffic

### Decision Framework

**Scenario 1: Clear Winner (A is 20%+ better)**

```
Variant A (€25): 10% conversion (100/1000)
Variant B (€35): 6% conversion (60/1000)

→ A wins. Use €25 pricing.
```

**Scenario 2: No Statistical Difference**

```
Variant A (€25): 8% conversion (80/1000)
Variant B (€35): 7.5% conversion (75/1000)

→ No significant difference (p > 0.05)
→ Choose B (higher revenue, same conversion)
```

**Scenario 3: B Wins Despite Higher Price**

```
Variant A (€25): 8% conversion
Variant B (€35): 8.5% conversion

→ B wins (higher conversion AND higher price)
→ Perception of quality at higher price point
```

---

## Type 2: Pre-Order with Payment

### When to Use

- After waitlist test shows >5% conversion
- When you need high-confidence pricing data
- Before building full product

### Setup

**Payment processor:** Stripe, Mollie (iDEAL in NL)

**Pre-order offer:**

```
Vroege toegang tot VINO12

Reserveer nu je plek voor [€25/€35] per maand.

✓ Eerste maand 50% korting
✓ Levenslange "Founder" pricing (nooit prijsverhoging)
✓ Eerste 100 leden krijgen gratis welkomstpakket (€50 waarde)

We starten levering in maart 2026.
Je wordt pas belast vanaf de eerste levering.

[CTA: "Reserveer nu"]
```

**Payment flow:**

1. Email + naam
2. Betaalgegevens (credit card of iDEAL mandate)
3. Bevestiging email

**Commitment:** Echte betaling, maar **geen direct charge**. Pre-authorize only.

### Conversion Expectations

**Baseline:** 0.5-2% of traffic

**Example:**

```
1000 visitors → 10-20 pre-orders

If conversion < 0.5%:
→ Pricing te hoog of value proposition zwak
→ Test lagere prijs of verbeter messaging

If conversion > 2%:
→ Strong signal, pricing is goed
```

### Legal Requirements (NL)

**Pre-order disclosures:**

- Verwachte leverdatum (maart 2026)
- Recht op annulering (14 dagen herroepingsrecht)
- Terugbetalingsbeleid

**GDPR:**

- Privacy policy link
- Consent voor marketing emails
- Data processing statement

---

## Type 3: Early Access Deposit

### Setup

**€10 deposit voor early access:**

```
Word early member voor slechts €10

Betaal nu €10 en krijg:
✓ Gegarandeerde toegang bij launch (maart 2026)
✓ €10 credit voor je eerste bestelling
✓ Exclusief founder member badge
✓ Early access pricing: [€25/€35] per maand (levenslang)

Normale prijs na launch: €40/maand

[CTA: "Claim early access voor €10"]
```

**Why this works:**

- Low barrier (€10 vs €25-35)
- Strong commitment (betaling = revealed preference)
- Upside for user (discount, credit, badge)

**Payment:** Via Mollie/Stripe, direct charge (niet pre-auth)

### Conversion Expectations

**Baseline:** 2-5% of traffic

**Example:**

```
1000 visitors → 20-50 deposits

If 50 deposits at €10 each:
→ Revenue: €500
→ Validated interest: 5% willing to pay
→ CAC validation: If you spent €500 on ads, break-even
```

---

## Multi-Price Testing (Advanced)

### 3-Way Split Test

If you have **high traffic** (5000+ visitors expected), test 3 prices:

**Variant A:** €22/maand (low)
**Variant B:** €30/maand (medium)
**Variant C:** €38/maand (high)

**Sample per variant:** 1666 visitors each

**Goal:** Find demand curve (elasticity)

**Analysis:**

```
Variant A: 12% conversion → Revenue per 1000: €2,640
Variant B: 8% conversion → Revenue per 1000: €2,400
Variant C: 5% conversion → Revenue per 1000: €1,900

→ Optimal: Variant A (highest revenue per 1000 visitors)
→ But: Check LTV, not just first-month revenue
```

### Price Anchoring Test

Test effect of showing **original price** crossed out:

**Control:**

```
€30/maand
```

**Treatment:**

```
€40/maand €30/maand
Lancerings aanbieding
```

**Hypothesis:** Anchoring increases perceived value, boosts conversion.

**Metric:** Does treatment have higher conversion than control at same price?

---

## Landing Page Optimization

### Copy Testing

Beyond pricing, test messaging to maximize conversion:

**Value Prop Variants:**

**A: Feature-focused**

```
"3 premium wijnen per maand, gepersonaliseerd voor jou"
```

**B: Outcome-focused**

```
"Stop met giswerk. Ontdek wijnen die je echt lekker vindt."
```

**C: Social-focused**

```
"Word lid van 500+ wijnliefhebbers die elke maand iets nieuws ontdekken"
```

**Test:** Which drives highest conversion at same price?

### CTA Testing

**CTA Button variants:**

**A: Direct**

```
"Meld je aan"
```

**B: Benefit-driven**

```
"Start met ontdekken"
```

**C: Risk-reversal**

```
"Probeer het gratis de eerste maand"
```

**Metric:** Click-through rate (page view → CTA click)

---

## Traffic Sources & Budget

### Paid Ads

**Google Ads:**

- **Keywords:** "wijn abonnement", "wijn per maand", "wijnen online"
- **Budget:** €500 (1000 clicks @ €0.50 CPC)
- **Landing page:** Direct to experiment page

**Facebook/Instagram Ads:**

- **Targeting:** NL, 25-55 jaar, interesse in wijn, food, lifestyle
- **Budget:** €300 (1000 clicks @ €0.30 CPC)
- **Creative:** Video van unboxing wijnpakket

**Reddit Ads:**

- **Subreddits:** r/wine, r/thenetherlands
- **Budget:** €100 (200 clicks @ €0.50 CPC)

**Total budget:** €900 for 2200 visitors

### Organic

**SEO:**

- Blog posts: "Beste wijn abonnementen NL 2026"
- Guest posts op food/lifestyle blogs

**Social Media:**

- Instagram posts met influencers (micro-influencers, 10k-50k followers)
- LinkedIn posts in wijn communities

**Email:**

- Send to JTBD interview respondenten (if consented)

**Expected:** 500-1000 organic visitors

### Partnership

**Wine bars/slijterijen:**

- QR code flyers: "Scan voor exclusieve early access"
- Commission deal: €5 per signup

**Events:**

- Wine tasting events, sponsor met landing page QR code

---

## Analysis Template

### Metrics Dashboard

**Overall:**

| Metric               | Value |
| -------------------- | ----- |
| Total Visitors       | 2500  |
| Waitlist Signups     | 200   |
| Conversion Rate      | 8%    |
| Cost Per Acquisition | €4.50 |
| Projected LTV (12mo) | €360  |
| LTV:CAC Ratio        | 80:1  |

**By Variant:**

| Variant    | Price | Visitors | Signups | Conv Rate | Revenue (1st mo)                      | Stat Sig?    |
| ---------- | ----- | -------- | ------- | --------- | ------------------------------------- | ------------ |
| A          | €25   | 1250     | 110     | 8.8%      | €2,750                                | p=0.03 ✓     |
| B          | €35   | 1250     | 90      | 7.2%      | €3,150                                | (baseline)   |
| **Winner** | **B** | -        | -       | -         | **Higher revenue despite lower conv** | **Choose B** |

**By Traffic Source:**

| Source   | Visitors | Signups | Conv Rate | CPA   |
| -------- | -------- | ------- | --------- | ----- |
| Google   | 1000     | 90      | 9%        | €5.56 |
| Facebook | 1000     | 80      | 8%        | €3.75 |
| Reddit   | 200      | 15      | 7.5%      | €6.67 |
| Organic  | 300      | 15      | 5%        | €0    |

**Insight:** Facebook has best CPA, Google has best conversion. Allocate more to Facebook.

---

## Decision Framework

### Green Light (Launch)

**Criteria:**

- [x] Conversion rate >5% at target price
- [x] LTV:CAC ratio >3:1
- [x] Statistical significance (p<0.05) on price winner
- [x] Sample size >800 per variant

**Action:** Launch at winning price.

### Yellow Light (Iterate)

**Criteria:**

- Conversion rate 2-5% (lukewarm)
- LTV:CAC ratio 1-3:1 (tight margins)
- No statistical winner, but trends visible

**Action:** Run second test with adjusted messaging or lower price.

### Red Light (Pivot)

**Criteria:**

- Conversion rate <2% despite good traffic
- LTV:CAC ratio <1:1 (not profitable)
- High bounce rate (>80%)

**Action:**

1. Customer interviews (why didn't you sign up?)
2. Revisit value proposition
3. Consider different pricing model (per fles vs abonnement)

---

## Integration with Van Westendorp

### Combined Strategy

**Step 1:** Van Westendorp survey (n=100+)

→ Output: RAP = €22 - €38

**Step 2:** Waitlist A/B test

- Variant A: €25 (low end of RAP)
- Variant B: €35 (high end of RAP)

→ Output: Which converts better?

**Step 3:** Pre-order test at winning price

→ Output: Validate with real payment commitment

**Result:**

```
Van Westendorp: €22-€38 acceptable
Waitlist test: €25 converts 9%, €35 converts 7.5% (no sig diff, choose €35)
Pre-order test: €35 gets 1.5% conversion (strong signal)

→ Launch price: €35/maand
```

---

## Deliverables

### Landing Pages

- [ ] Variant A page (low price)
- [ ] Variant B page (high price)
- [ ] Thank you page
- [ ] Email confirmation template

### Tracking

- [ ] GA4 setup with custom events
- [ ] Conversion goals configured
- [ ] A/B test traffic split (50/50)

### Ads

- [ ] Google Ads campaign (keywords, copy, budget)
- [ ] Facebook Ads campaign (targeting, creative, budget)
- [ ] UTM parameters for tracking

### Analysis

- [ ] Dashboard met real-time metrics
- [ ] Weekly reports (traffic, conversion, CPA)
- [ ] Statistical significance calculator
- [ ] Final report met beslissing

---

## Resources

**Tools:**

- **Landing page:** Webflow, Framer, Carrd (€10-30/maand)
- **A/B testing:** Google Optimize (gratis, deprecated 2023), VWO, Optimizely
- **Analytics:** Google Analytics 4 (gratis), Plausible (€9/maand)
- **Payments:** Mollie (NL-focused), Stripe
- **Email:** Mailchimp, Loops, Resend

**Legal:**

- AVG/GDPR compliance checklist
- Algemene Voorwaarden template (pre-order)
- Privacy Policy generator (iubenda, termly)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-09
**Owner:** Product Team VINO12
**Related:** VINO-138 (Pricing Validation)
