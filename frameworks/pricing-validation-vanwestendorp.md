# Van Westendorp Price Sensitivity Meter

**VINO12 - Pricing Validation Framework**

---

## Overview

**Doel:** Bepaal de optimale prijspunten voor VINO12 via Van Westendorp Price Sensitivity Meter analyse.

**Methodologie:** 4 prijsvragen stellen aan target audience, datapunten plotten, optimal price range afleiden.

**Sample Size:** Minimum 50 respondenten, ideaal 100+ voor betrouwbare resultaten.

**Timeline:** 1-2 weken data verzamelen + 2-3 dagen analyse.

---

## Van Westendorp Methode

### De 4 Kernvragen

Vraag respondenten om **specifieke prijspunten** te noemen voor elk van deze vragen:

#### 1. Too Cheap (Te Goedkoop)

> "Bij welke prijs zou je beginnen te twijfelen aan de kwaliteit van VINO12? Dus: bij welke prijs is het ZO GOEDKOOP dat je denkt 'dit kan niet goed zijn'?"

**Psychologie:** Meet kwaliteitsperceptie ondergrens.

**Let op:**

- Respondenten moeten **specifiek bedrag** noemen (niet "onder de €10")
- Vraag door als ze vaag zijn: "Wat is dan precies die prijs?"

#### 2. Bargain (Koopje)

> "Bij welke prijs zou je denken: 'Dit is een koopje, dit is echt goede value for money'?"

**Psychologie:** Meet ideale prijs vanuit consumentenperspectief.

**Let op:**

- Dit is NIET "wat zou je willen betalen"
- Dit is "wat is objectief goede waarde"

#### 3. Expensive (Duur)

> "Bij welke prijs vind je VINO12 aan de dure kant, maar zou je het nog steeds overwegen?"

**Psychologie:** Meet bovengrens van acceptatie.

**Let op:**

- "Duur maar nog acceptabel"
- NIET "te duur om te kopen"

#### 4. Too Expensive (Te Duur)

> "Bij welke prijs is VINO12 ZO DUUR dat je het absoluut niet zou kopen, ongeacht de kwaliteit?"

**Psychologie:** Meet absolute maximum.

**Let op:**

- Harde dealbreaker prijs
- "Ongeacht hoe goed het is"

---

## Data Verzameling

### Survey Setup

**Platform:** Typeform, Google Forms, of Tally

**Intro tekst:**

```
We ontwikkelen VINO12, een service die je helpt om wijnen te ontdekken
die perfect bij jouw smaak passen.

We willen graag begrijpen wat een eerlijke prijs is voor deze service.
Er zijn geen goede of foute antwoorden - we zijn oprecht nieuwsgierig
naar jouw mening.

Je antwoorden zijn anoniem en helpen ons een faire prijs te bepalen.
```

**Concept Beschrijving (voordat je de 4 vragen stelt):**

```
VINO12 is een maandelijks abonnement waarbij je:

✓ Een persoonlijk smaakprofiel krijgt op basis van je voorkeuren
✓ Elke maand 3 wijnen ontvangt die passen bij jouw smaak
✓ Uitgebreide informatie krijgt over elke wijn (herkomst, smaakprofiel, food pairing)
✓ Toegang hebt tot een online platform om je voorkeuren bij te sturen

Alle wijnen zijn uit het premium segment (normaal €15-€40 per fles).
```

**Vraag Volgorde:**

1. Too Cheap
2. Bargain
3. Expensive
4. Too Expensive

**Input Type:** Open numeriek veld (alleen cijfers, geen € symbool nodig)

### Targeting

**Where to distribute:**

- **Online communities:** Reddit (r/Netherlandswine, r/wine), Facebook wijngroepen
- **Email:** Respondenten uit JTBD interviews (als ze interesse toonden)
- **Social media:** LinkedIn, Instagram (wijn influencers, horeca)
- **Partnerships:** Slijterijen, wijnbars (flyer met QR code)

**Incentive:** €10 bol.com bon bij voltooiing + kans op gratis eerste maand VINO12

### Screening

**Minimum kwalificaties:**

- [ ] Woont in Nederland
- [ ] 25-55 jaar oud
- [ ] Koopt minstens 2x per maand wijn
- [ ] Budget €15+ per fles

**Screener vragen toevoegen VOOR prijsvragen:**

```
1. Hoe vaak koop je wijn voor jezelf?
   - Meerdere keren per week
   - Wekelijks
   - 2-3 keer per maand ✓
   - 1 keer per maand ✓
   - Minder dan 1 keer per maand ✗

2. Wat is je gemiddelde budget per fles wijn?
   - < €10 ✗
   - €10-€15 ✗
   - €15-€25 ✓
   - €25-€40 ✓
   - €40+ ✓
```

---

## Data Analyse

### Stap 1: Data Cleaning

**Verwijder:**

- Incomplete responses (niet alle 4 vragen beantwoord)
- Illogische antwoorden (Too Cheap > Too Expensive)
- Extreme outliers (>3 standaarddeviaties van mediaan)
- Respondenten die screening niet halen

**Accepteer:**

- Too Cheap = Bargain (sommige mensen zien geen verschil)
- Expensive = Too Expensive (maximale prijs gelijkstellen)

### Stap 2: Cumulatieve Distributies Berekenen

Voor elke prijsvraag, bereken het **percentage respondenten** dat die prijs of **hoger/lager** noemde.

**Voorbeeld dataset (n=100):**

| Respondent | Too Cheap | Bargain | Expensive | Too Expensive |
| ---------- | --------- | ------- | --------- | ------------- |
| R1         | €15       | €25     | €40       | €50           |
| R2         | €10       | €20     | €35       | €45           |
| R3         | €20       | €30     | €45       | €60           |
| ...        | ...       | ...     | ...       | ...           |

**Cumulatieve curves:**

1. **Too Cheap:** % dat prijs X of **HOGER** noemde
2. **Bargain:** % dat prijs X of **HOGER** noemde
3. **Expensive:** % dat prijs X of **LAGER** noemde
4. **Too Expensive:** % dat prijs X of **LAGER** noemde

### Stap 3: Plot de 4 Curves

**X-as:** Prijs (€)
**Y-as:** Percentage respondenten (0-100%)

**4 Lijnen:**

- **Too Cheap** (rood) - Dalende curve (van 100% bij €0 naar 0% bij hoge prijs)
- **Bargain** (groen) - Dalende curve
- **Expensive** (oranje) - Stijgende curve (van 0% bij €0 naar 100% bij hoge prijs)
- **Too Expensive** (rood) - Stijgende curve

### Stap 4: Identificeer de 4 Kruispunten

**Kruispunt 1: Point of Marginal Cheapness (PMC)**

- **Too Cheap** kruist **Expensive**
- **Betekenis:** Onder deze prijs beginnen te veel mensen te twijfelen aan kwaliteit

**Kruispunt 2: Point of Marginal Expensiveness (PME)**

- **Bargain** kruist **Too Expensive**
- **Betekenis:** Boven deze prijs vinden te veel mensen het te duur

**Kruispunt 3: Optimal Price Point (OPP)**

- **Too Cheap** kruist **Too Expensive**
- **Betekenis:** Prijs waarbij minste % mensen bezwaar heeft

**Kruispunt 4: Indifference Price Point (IPP)**

- **Bargain** kruist **Expensive**
- **Betekenis:** Prijs waarbij evenveel mensen het goedkoop als duur vinden

### Stap 5: Bepaal Range of Acceptable Pricing (RAP)

**RAP = tussen PMC en PME**

Dit is je **veilige prijsrange** waar de meerderheid van je markt de prijs acceptabel vindt.

**Voorbeeld resultaat:**

```
PMC (ondergrens): €22
PME (bovengrens): €38
OPP (optimaal): €28
IPP (neutraal): €30

→ Range of Acceptable Pricing: €22 - €38
→ Aanbevolen startprijs: €28 - €30
```

---

## Pricing Models voor VINO12

### Model 1: Per Fles (A la carte)

**Vraag:**

> "Als je wijnen per stuk zou kunnen kopen via VINO12 (met persoonlijke aanbevelingen en uitleg), wat zou je dan per fles willen betalen?"

**Van Westendorp vragen (aangepast):**

1. Te goedkoop: \_\_\_\_
2. Koopje: \_\_\_\_
3. Duur: \_\_\_\_
4. Te duur: \_\_\_\_

**Expected range:** €18 - €35 per fles

### Model 2: Maandelijks Abonnement (3 flessen)

**Vraag:**

> "Als je een maandelijks abonnement neemt waarbij je 3 gepersonaliseerde wijnen ontvangt, wat zou je dan per maand willen betalen?"

**Van Westendorp vragen:**

1. Te goedkoop: \_\_\_\_
2. Koopje: \_\_\_\_
3. Duur: \_\_\_\_
4. Te duur: \_\_\_\_

**Expected range:** €50 - €90 per maand

### Model 3: Kwartaal Abonnement (9 flessen)

**Vraag:**

> "Als je een kwartaalabonnement neemt (eenmalig per 3 maanden 9 wijnen), wat zou je dan per kwartaal willen betalen?"

**Van Westendorp vragen:**

1. Te goedkoop: \_\_\_\_
2. Koopje: \_\_\_\_
3. Duur: \_\_\_\_
4. Te duur: \_\_\_\_

**Expected range:** €135 - €240 per kwartaal

### Model 4: Bundles (6-pack)

**Vraag:**

> "Als je een 6-pack thema-bundle koopt (bijv. 'Italiaanse Rode Wijnen' of 'Zomerse Witte Wijnen'), wat zou je daarvoor willen betalen?"

**Van Westendorp vragen:**

1. Te goedkoop: \_\_\_\_
2. Koopje: \_\_\_\_
3. Duur: \_\_\_\_
4. Te duur: \_\_\_\_

**Expected range:** €90 - €180 per 6-pack

---

## Survey Structuur (Multi-Model)

### Optie A: Binnen-respondent (Within-subject)

**Elke respondent beantwoordt alle 4 modellen.**

**Voordeel:** Meer datapunten per respondent
**Nadeel:** Survey fatigue, anchor bias (eerste prijs beïnvloedt volgende)

**Structure:**

1. Concept intro
2. Screener
3. Model 1 (per fles) - 4 vragen
4. Model 2 (maandelijks) - 4 vragen
5. Model 3 (kwartaal) - 4 vragen
6. Model 4 (bundle) - 4 vragen
7. Demographics

**Duur:** 8-10 minuten

### Optie B: Tussen-respondent (Between-subject)

**Elke respondent ziet 1 of 2 modellen.**

**Voordeel:** Geen anchor bias, kortere survey
**Nadeel:** Meer respondenten nodig

**Structure:**

1. Concept intro
2. Screener
3. Random assignment → Model 1, 2, 3, of 4
4. 4 Van Westendorp vragen voor dat model
5. Demographics

**Duur:** 4-5 minuten

**Required sample:**

- 50+ respondenten per model
- Totaal 200+ respondenten

### Optie C: Hybrid (Aanbevolen)

**Elke respondent ziet 2 modellen (primair + secundair).**

**Structure:**

1. Concept intro
2. Screener
3. Primair model (bijv. maandelijks abonnement) - 4 vragen
4. Secundair model (bijv. per fles) - 4 vragen
5. Demographics

**Sample split:**

- 50% krijgt: Maandelijks + Per fles
- 50% krijgt: Kwartaal + Bundle

**Duur:** 6-7 minuten
**Required:** 100+ respondenten (50 per groep)

---

## Analysis Template

### Excel/Google Sheets Setup

**Sheet 1: Raw Data**

| ID  | Too_Cheap_M | Bargain_M | Expensive_M | TooExp_M | Too_Cheap_F | Bargain_F | ... |
| --- | ----------- | --------- | ----------- | -------- | ----------- | --------- | --- |
| R1  | 50          | 65        | 85          | 100      | 18          | 22        | ... |
| R2  | 45          | 60        | 90          | 110      | 15          | 20        | ... |
| ... | ...         | ...       | ...         | ...      | ...         | ...       | ... |

**Sheet 2: Cumulative Distributions**

Voor elk model, rijen met prijspunten (€0 - €150 in stappen van €1):

| Price | TC_Cum | Bargain_Cum | Exp_Cum | TE_Cum |
| ----- | ------ | ----------- | ------- | ------ |
| €0    | 100%   | 100%        | 0%      | 0%     |
| €1    | 100%   | 100%        | 0%      | 0%     |
| ...   | ...    | ...         | ...     | ...    |
| €50   | 45%    | 78%         | 62%     | 23%    |
| ...   | ...    | ...         | ...     | ...    |

**Sheet 3: Kruispunten**

| Model             | PMC  | PME  | OPP  | IPP  | RAP Low | RAP High |
| ----------------- | ---- | ---- | ---- | ---- | ------- | -------- |
| Maandelijks       | €22  | €38  | €28  | €30  | €22     | €38      |
| Per fles          | €18  | €32  | €24  | €26  | €18     | €32      |
| Kwartaal          | €150 | €220 | €180 | €190 | €150    | €220     |
| Bundle (6-pack)   | €95  | €165 | €120 | €130 | €95     | €165     |
| **Aanbevolen PX** | -    | -    | -    | -    | **€25** | **€35**  |

**Sheet 4: Visualizations**

- Chart 1: Maandelijks abonnement curves
- Chart 2: Per fles curves
- Chart 3: Kwartaal curves
- Chart 4: Bundle curves

---

## Interpretation Guidelines

### Strong Signal (Go Ahead)

- **Narrow RAP:** PMC en PME liggen dicht bij elkaar (€20-30 range)
- **Clear OPP:** OPP ligt binnen RAP en is goed gedefinieerd
- **High conviction:** >70% van respondenten binnen RAP

**Actie:** Launch met aanbevolen prijs (OPP of net onder IPP)

### Moderate Signal (Test)

- **Wide RAP:** PMC en PME liggen ver uit elkaar (€15-50 range)
- **Unclear OPP:** OPP ligt buiten RAP of is vaag
- **Medium conviction:** 50-70% van respondenten binnen RAP

**Actie:** A/B test met 2 prijspunten (laag en hoog binnen RAP)

### Weak Signal (Reconsider)

- **No clear RAP:** Curves kruisen niet logisch
- **Extreme spread:** Respondenten zitten overal
- **Low conviction:** <50% consensus

**Actie:**

1. Re-interview met betere concept uitleg
2. Segment analysis (misschien meerdere segments met verschillende willingness to pay)
3. Overweeg pricing model te herzien

---

## Segment Analysis (Advanced)

Als je **brede spreiding** ziet, splits data op segmenten:

### Mogelijke Segmenten

**1. Experience Level:**

- Beginners (willen goedkoper, minder risico)
- Enthusiasts (willen premium, meer exploratie)

**2. Budget:**

- €15-€25 per fles segment
- €25-€40 per fles segment

**3. Purchase Frequency:**

- 2-3x per maand (wekelijkse drinkers)
- 1x per maand (occasionele drinkers)

**Approach:**

- Run Van Westendorp apart voor elk segment
- Bepaal of je **verschillende pricing tiers** nodig hebt

**Voorbeeld:**

```
Segment A (Beginners):
→ RAP: €18 - €30
→ Aanbevolen: €22/maand

Segment B (Enthusiasts):
→ RAP: €28 - €45
→ Aanbevolen: €35/maand

→ Conclusie: Launch met 2 tiers (Basic €22, Premium €35)
```

---

## Pricing Tiers (If Needed)

Als segment analyse wijst op meerdere willingness to pay groepen:

### Tier Structure

**Tier 1: Starter** (€22/maand)

- 2 wijnen per maand
- Basis smaakprofiel
- Email aanbevelingen

**Tier 2: Explorer** (€35/maand)

- 3 wijnen per maand
- Geavanceerd smaakprofiel
- Food pairing suggesties
- Online platform toegang

**Tier 3: Connoisseur** (€55/maand)

- 4 wijnen per maand
- Premium selectie (€30-€50 per fles)
- 1-op-1 sommelier chat
- Exclusieve events

**Van Westendorp per tier:**

Run aparte surveys met concept beschrijving van elke tier, bepaal RAP voor elk.

---

## Next Steps After Van Westendorp

### 1. Confirm with Real Behavior

**Van Westendorp geeft stated preferences, niet revealed preferences.**

Test met:

- **Waitlist signup** met prijsindicatie
- **Pre-order** met daadwerkelijke betaling
- **Landing page A/B test** met verschillende prijzen

### 2. Competitive Benchmarking

Vergelijk je RAP met:

- Vivino Premium (€8.99/maand)
- Wijnabonnementen NL (€40-80/maand voor 3 flessen)
- Premium wine clubs (€100+/maand)

**Check:** Ligt je prijs logisch t.o.v. concurrentie?

### 3. Unit Economics

Valideer of pricing winstgevend is:

```
Revenue per maand: €30
COGS (3 flessen @ €12 inkoopprijs): €36
Fulfillment (verpakking, verzending): €8
→ Gross margin: €30 - €36 - €8 = -€14 (NIET HAALBAAR!)

→ Conclusie: Pricing moet minimaal €50/maand zijn, of inkoopprijs omlaag
```

---

## Deliverables

### Survey

- [ ] Typeform/Google Forms link
- [ ] Screener vragen ingebouwd
- [ ] 4 Van Westendorp vragen per model
- [ ] Demographics vragen
- [ ] Incentive verwerkt

### Analysis

- [ ] Excel/Sheets template met cumulatieve distributies
- [ ] 4 Charts (1 per pricing model)
- [ ] Kruispunten berekend (PMC, PME, OPP, IPP)
- [ ] RAP bepaald per model
- [ ] Segment analysis (indien relevant)

### Report

- [ ] Executive summary met aanbevolen prijs
- [ ] Visualisaties van 4 curves per model
- [ ] Segment breakdowns
- [ ] Next steps (waitlist test, A/B test, competitive check)

---

## Resources

**Tools:**

- Survey: Typeform (€25/maand), Google Forms (gratis), Tally (gratis)
- Analysis: Excel, Google Sheets, R (gratis)
- Visualization: Excel Charts, Plotly (Python), ggplot2 (R)

**References:**

- _Pricing Strategy_ - Madhavan Ramanujam & Georg Tacke
- _Monetizing Innovation_ - Madhavan Ramanujam & Georg Tacke
- Original Van Westendorp paper (1976)

**Templates:**

- `templates/vanwestendorp-survey.md` - Survey template
- `templates/vanwestendorp-analysis.xlsx` - Excel analysis template

---

**Document Version:** 1.0
**Last Updated:** 2026-02-09
**Owner:** Product Team VINO12
**Related:** VINO-138 (Pricing Validation)
