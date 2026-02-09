# Concierge MVP Protocol

**VINO12 - Handmatige Bestelling Validatie**

---

## Overview

Dit protocol beschrijft hoe we **10-20 handmatige wijnbestellingen** uitvoeren om het VINO12 business model te valideren voordat we volledig automatiseren.

**Doel:** Valideer product-market fit, meet customer satisfaction, en documenteer operationele leerpunten voor automatisering.

**Methode:** "Wizard of Oz" - klanten ervaren volledige service, maar alles gebeurt handmatig achter de schermen.

---

## Waarom Concierge MVP?

### Benefits

- ✅ **Snelle validatie** - Geen maanden development nodig
- ✅ **Directe feedback** - Persoonlijke interactie met vroege klanten
- ✅ **Flexibiliteit** - Experimenteer met verschillende approaches
- ✅ **Leermoment** - Ontdek echte customer needs en edge cases
- ✅ **Operationele insights** - Begrijp wat geautomatiseerd moet worden

### Risks Mitigated

- 🚫 Bouwen wat niemand wil
- 🚫 Verkeerde aannames over customer journey
- 🚫 Onderschatten van operationele complexiteit
- 🚫 Missen van kritieke features

---

## Target: 10-20 Bestellingen

**Minimum:** 10 bestellingen (statistische significantie)
**Maximum:** 20 bestellingen (operationele capaciteit)
**Target completion:** 4 weken

### Customer Segmentation

| Segment             | Count | Kenmerken                              |
| ------------------- | ----- | -------------------------------------- |
| **Wijn Novices**    | 4-6   | Geen wijnkennis, zoekt begeleiding     |
| **Casual Drinkers** | 3-5   | Enige ervaring, wil ontdekken          |
| **Enthusiasts**     | 2-4   | Wijnliefhebbers, zoekt curate selectie |
| **Gift Buyers**     | 1-3   | Kopen voor iemand anders               |

**Why diversify?** Verschillende segmenten hebben verschillende needs - we willen breed leren.

---

## De Concierge Journey (5 Stappen)

### Stap 1: Acquisition (Dag 0)

**Kanalen:**

- Instagram DM campagne (vrienden, familie, netwerk)
- LinkedIn post (professioneel netwerk)
- WhatsApp groepen (wijnliefhebbers)

**Boodschap:**

```
🍷 VINO12 Beta Test - Gratis Proefbox!

We testen een nieuwe wijn discovery service.
10 mensen krijgen een gratis selectie van 3 flessen
(€50 waarde) in ruil voor eerlijke feedback.

Interesse? DM me!
```

**Qualification Questions:**

1. Drink je regelmatig wijn? (Ja/Nee)
2. Wat is je ervaring met wijn? (Beginner/Gemiddeld/Gevorderd)
3. Hoe ontdek je nu nieuwe wijnen? (Supermarkt/Slijter/Online/Anders)
4. Zou je betalen voor gepersonaliseerde wijn selecties? (Ja/Misschien/Nee)

**Selection Criteria:**

- Minimaal "Misschien" op vraag 4
- Spreiding over experience levels
- Geografisch bereikbaar (NL, verzendgebied)

---

### Stap 2: Personalization (Dag 1-2)

**Intake Call/Form (15 min):**

**Smaak Profiel:**

- Voorkeur: Rood/Wit/Rosé/Sparkling/Mix
- Sweetness: Droog/Medium/Zoet
- Body: Licht/Medium/Vol
- Budget per fles: €10-€15/€15-€25/€25+

**Context:**

- Drinking occasions: Solo/Dinner/Social/Special
- Food pairing: Vlees/Vis/Vegetarisch/Kaas
- Current favorites: Welke wijnen drink je graag?
- Dislikes: Wat vind je niet lekker?

**Logistics:**

- Adres (voor bezorging)
- Telefoonnummer
- Delivery preference: Doordeweeks/Weekend

**Document in:** `templates/concierge-mvp/customer-intake-form.md`

---

### Stap 3: Curation (Dag 2-3)

**Wijn Selectie (3 flessen):**

**Selection Criteria:**

- ✅ Match taste profile (70%+ match)
- ✅ Educational value (verschillende stijlen/regio's)
- ✅ Availability (bij lokale slijter of online)
- ✅ Price point (binnen budget + 10%)
- ✅ Discovery factor (iets nieuws voor ze)

**Manual Curation Process:**

1. Review intake notes
2. Browse wijn catalogus (vivino.com, gall.nl, etc.)
3. Select 3-5 kandidaten
4. Cross-reference reviews (Vivino rating >3.8)
5. Finalize 3 flessen
6. Write personalized note

**Personalized Note (Template):**

```
Hoi [Naam],

Op basis van je voorkeur voor [preference] en je liefde voor [favorite],
heb ik deze 3 wijnen voor je geselecteerd:

1. [Wijn 1] - [Land, Druif] - €[prijs]
   Waarom: [1-2 zinnen]

2. [Wijn 2] - [Land, Druif] - €[prijs]
   Waarom: [1-2 zinnen]

3. [Wijn 3] - [Land, Druif] - €[prijs]
   Waarom: [1-2 zinnen]

Proef ze in deze volgorde voor de beste ervaring!

Proost,
[Je naam]
```

**Time estimate:** 30-45 min per customer

---

### Stap 4: Fulfillment (Dag 3-5)

**Procurement Options:**

| Method                       | Pros                           | Cons                | When to Use               |
| ---------------------------- | ------------------------------ | ------------------- | ------------------------- |
| **Lokale slijter**           | Snel, persoonlijk advies       | Beperkt assortiment | Voor test klanten in stad |
| **Gall & Gall**              | Groot assortiment, betrouwbaar | Standaard selectie  | Mainstream wijnen         |
| **Online (wijnvoordeel.nl)** | Breed assortiment, bezorging   | Langere levertijd   | Specialty wijnen          |

**Packaging:**

- Kartonnen wijnbox (3-fles)
- Bubblewrap voor bescherming
- Printed personalized note
- VINO12 logo sticker (optional)
- Feedback QR code kaart

**Delivery:**

- **Zelf bezorgen** (lokaal, <10km): Persoonlijk contact, directe feedback
- **PostNL/DHL** (verder weg): Track & trace, professioneel
- **Delivery window:** Binnen 48 uur na aankondiging

**Kosten Tracking:**
Per bestelling documenteren:

- Wijn cost (€)
- Packaging (€)
- Delivery (€)
- Time spent (hours)

**Document in:** Order tracking spreadsheet

---

### Stap 5: Follow-up (Dag 7-14)

**Day 7: Initial Feedback**

WhatsApp/Email:

```
Hoi [Naam],

Heb je de wijnen al kunnen proeven?
Ik ben benieuwd wat je ervan vond!

Welke was je favoriet? 🍷
```

**Day 10: Survey Request**

Email met survey link (Google Forms/Typeform):

**Survey Structure:**

1. **Overall Satisfaction** (1-5 stars)
2. **Wine Quality** (1-5 per wine)
3. **Selection Match** (How well did wines match your taste?)
4. **Educational Value** (Did you learn something new?)
5. **NPS Question:** Zou je VINO12 aanbevelen aan vrienden? (0-10)
6. **Willingness to Pay:** Wat zou je betalen voor deze service per maand? (€15/€20/€25/€30+/Niks)
7. **Open Feedback:** Wat zou je veranderen?

**Template:** `templates/concierge-mvp/customer-survey.md`

**Day 14: Repeat Purchase Test**

```
Hoi [Naam],

Leuk dat je de vorige selectie waardeerde!

Wil je volgende maand weer een nieuwe selectie?
Deze keer voor €[prijs] (intro deal: 20% korting)

Ja/Nee?
```

**Success Metric:** >30% repeat intent = product-market fit signal

---

## Metrics to Track

### Primary Metrics

| Metric                     | Target     | Measurement                                           |
| -------------------------- | ---------- | ----------------------------------------------------- |
| **Customer Satisfaction**  | ≥4.0/5.0   | Survey question 1                                     |
| **NPS Score**              | ≥30        | (Promoters - Detractors) / Total × 100                |
| **Taste Match Accuracy**   | ≥70%       | "Selection matched my taste" (Agree/Strongly Agree %) |
| **Repeat Purchase Intent** | ≥30%       | Day 14 follow-up yes rate                             |
| **Willingness to Pay**     | ≥€20/month | Survey question 6 median                              |

### Operational Metrics

| Metric             | Target    | Why Important        |
| ------------------ | --------- | -------------------- |
| **Curation Time**  | <45 min   | Automation scope     |
| **Cost per Order** | <€40      | Unit economics       |
| **Delivery Time**  | <48 hours | Customer expectation |
| **Response Rate**  | >60%      | Engagement level     |

### Qualitative Insights

Document in learnings log:

- What surprises did customers mention?
- Which wines got best reactions?
- What operational pain points emerged?
- What would customers change?
- What features do they request?

---

## Success Criteria

**GO Decision (Proceed to build platform):**

- ✅ Customer Satisfaction ≥4.0
- ✅ NPS Score ≥30
- ✅ Repeat Purchase Intent ≥30%
- ✅ Median WTP ≥€20/month
- ✅ Operationally feasible to scale

**PIVOT Decision (Adjust approach):**

- ⚠️ Any metric below target
- ⚠️ Consistent negative feedback theme
- ⚠️ Operational complexity unmanageable

**NO-GO Decision (Stop project):**

- ❌ Customer Satisfaction <3.0
- ❌ NPS Score <0
- ❌ Repeat Purchase Intent <10%
- ❌ WTP <€15/month

---

## Operational Learnings Documentation

**After each order, document:**

### What Worked

- Which selection criteria led to happy customers?
- Which communication style got best response?
- Which delivery method was most efficient?

### What Didn't Work

- Where did we waste time?
- What caused customer confusion?
- What operational bottlenecks emerged?

### Edge Cases Discovered

- Allergies/dietary restrictions
- Delivery complications
- Payment preferences
- Special requests

### Automation Priorities

**High Priority (Must automate):**

- [ ] Taste profile intake
- [ ] Wine matching algorithm
- [ ] Order tracking
- [ ] Customer communication

**Medium Priority (Should automate):**

- [ ] Survey collection
- [ ] Analytics dashboard
- [ ] Repeat purchase flow

**Low Priority (Can stay manual initially):**

- [ ] Wine curation (sommelier touch)
- [ ] Customer support
- [ ] Content creation

**Template:** `templates/concierge-mvp/operational-learnings.md`

---

## Timeline

| Week       | Activity                       | Deliverable                     |
| ---------- | ------------------------------ | ------------------------------- |
| **Week 1** | Acquisition + First 5 orders   | 5 customers onboarded           |
| **Week 2** | Next 5 orders + First feedback | 10 total orders, initial NPS    |
| **Week 3** | Final 5-10 orders              | 15-20 total orders              |
| **Week 4** | Follow-ups + Analysis          | Complete dataset, learnings doc |

---

## Budget

**Per Order:**

- Wine (3x €12 avg): €36
- Packaging: €2
- Delivery: €7
- Total COGS: €45

**Total (20 orders):** €900

**Subsidized by:**

- Beta discount (free for first 10)
- Intro price (€20 for next 10 = €200 revenue)
- **Net cost:** €700

**Worth it?** Absolutely - validating €1.5M SOM with €700 investment = 0.05% validation cost.

---

## Tools & Templates

| Template              | Location                                           | Purpose             |
| --------------------- | -------------------------------------------------- | ------------------- |
| Customer Intake Form  | `templates/concierge-mvp/customer-intake-form.md`  | Taste profiling     |
| Order Tracking Sheet  | `templates/concierge-mvp/order-tracking.csv`       | Operations log      |
| Customer Survey       | `templates/concierge-mvp/customer-survey.md`       | Feedback collection |
| Operational Learnings | `templates/concierge-mvp/operational-learnings.md` | Documentation       |
| NPS Calculator        | `tools/concierge-mvp/nps-calculator.ts`            | Metrics analysis    |

---

## Next Steps

1. **Recruit 10-20 participants** (Week 1)
2. **Execute first 5 orders** (Week 1-2)
3. **Collect feedback** (Week 2-3)
4. **Analyze + document** (Week 3-4)
5. **Make GO/NO-GO decision** (Week 4)
6. **Feed learnings into product roadmap** (Week 4)

---

**Document Versie:** 1.0
**Laatst Bijgewerkt:** 2026-02-09
**Eigenaar:** Product Team VINO12
**Related:** VINO-139, VINO-132 (Product Validation Epic)
