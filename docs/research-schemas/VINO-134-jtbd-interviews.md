# VINO-134: JTBD Interviews (10x Wijnliefhebbers)

> **Parent**: VINO-132 | **Doorlooptijd**: 2 weken | **Bronnen**: 60 Perplexity citaties
> **Doel**: Begrijp waarom mensen online wijn kopen en welke "jobs" ze proberen te vervullen

---

## 1. Screening Criteria

### Deelnemersprofiel (n=10)

| Criterium       | Vereiste                                             |
| --------------- | ---------------------------------------------------- |
| Leeftijd        | 25-55 jaar                                           |
| Wijn uitgaven   | >€50/maand aan wijn                                  |
| Online aankopen | Minimaal 2x online wijn besteld afgelopen 12 maanden |
| Locatie         | Nederland                                            |
| Spreiding       | Mix van: singles, stellen, gezinnen                  |

### Wervingskanalen

| Kanaal              | Methode                                 | Target       |
| ------------------- | --------------------------------------- | ------------ |
| Wijnverenigingen    | Direct benaderen via lokale proeverijen | 3 deelnemers |
| Instagram/Facebook  | Post in wijngroepen (#wijnliefhebber)   | 3 deelnemers |
| Persoonlijk netwerk | Warme introductie, sneeuwbal            | 2 deelnemers |
| Wijnbar/slijterij   | Flyering bij premium wijnlocaties       | 2 deelnemers |

### Incentive

- €25 bol.com cadeaukaart per interview (45-60 min)
- Optioneel: fles Italiaanse wijn ter waarde van €15

---

## 2. Interview Script (Nederlands)

### Opening (5 min)

```
"Bedankt dat je meedoet. Ik wil graag begrijpen hoe je wijn koopt
en wat je belangrijk vindt. Er zijn geen goede of foute antwoorden —
ik wil gewoon jouw verhaal horen.

Mag ik dit gesprek opnemen voor mijn notities? Het blijft vertrouwelijk."
```

### Blok A: Laatste Aankoopmoment (15 min)

**Timeline-vragen** — Reconstrueer het meest recente online wijn-aankoop moment:

| #   | Vraag                                                                                    | Doel                     |
| --- | ---------------------------------------------------------------------------------------- | ------------------------ |
| A1  | "Wanneer heb je voor het laatst online wijn besteld? Vertel me precies wat er gebeurde." | Concrete context ophalen |
| A2  | "Waar was je op dat moment? Wat deed je?"                                                | Situatie begrijpen       |
| A3  | "Was er een specifieke aanleiding? Een etentje, feest, of gewoon voor jezelf?"           | Trigger/push force       |
| A4  | "Hoe ben je bij die specifieke webshop terechtgekomen?"                                  | Ontdekkingskanaal        |
| A5  | "Wat heb je uiteindelijk besteld en waarom precies die wijn(en)?"                        | Selectiecriteria         |
| A6  | "Heb je ook overwogen om naar een slijterij te gaan? Waarom wel/niet?"                   | Alternatieven/inertia    |

### Blok B: Vier Krachten (15 min)

| Kracht                              | Vraag                                                             | Noteren                    |
| ----------------------------------- | ----------------------------------------------------------------- | -------------------------- |
| **Push** (weg van huidige situatie) | "Wat stoorde je aan hoe je daarvoor wijn kocht? Wat werkte niet?" | Frustraties, pijnpunten    |
| **Pull** (naar nieuwe oplossing)    | "Wat trok je aan bij online bestellen? Wat hoopte je te vinden?"  | Verwachtingen, dromen      |
| **Angst** (bij overstappen)         | "Had je twijfels bij het online bestellen? Zo ja, welke?"         | Risico's, onzekerheid      |
| **Inertie** (blijven bij oud)       | "Wat zou je ervan weerhouden om opnieuw online te bestellen?"     | Gewoontes, switching costs |

### Blok C: Job Statements (10 min)

| #   | Vraag                                                                                           | Format             |
| --- | ----------------------------------------------------------------------------------------------- | ------------------ |
| C1  | "Als je het in één zin moest samenvatten: wat probeer je te bereiken als je online wijn koopt?" | → Job statement    |
| C2  | "Stel je moet vanavond een bijzondere fles meenemen naar een diner. Wat doe je?"                | → Sociale job      |
| C3  | "Hoe belangrijk is het voor je om te weten waar de wijn vandaan komt en hoe die gemaakt is?"    | → Emotionele job   |
| C4  | "Wat zou de perfecte wijnwinkel-ervaring zijn voor jou?"                                        | → Ideale oplossing |

### Blok D: Abonnement/Club Verkenning (10 min)

| #   | Vraag                                                                                 |
| --- | ------------------------------------------------------------------------------------- |
| D1  | "Ken je wijnabonnementen? Heb je er ooit een gehad?"                                  |
| D2  | "Wat zou je aanspreken aan een maandelijks wijnpakket met Italiaanse wijnen?"         |
| D3  | "Wat zou je ervan weerhouden om je aan te melden?"                                    |
| D4  | "Hoeveel flessen per maand zou ideaal zijn? En wat zou je er maximaal voor betalen?"  |
| D5  | "Zou je het fijn vinden om zelf te kiezen, of liever verrast worden door een expert?" |

### Afsluiting (5 min)

```
"Is er nog iets dat ik niet heb gevraagd maar wat je wel belangrijk
vindt over hoe je wijn koopt?

[Bedank + incentive uitreiken]"
```

---

## 3. Opname Template

### Per Interview Vastleggen

```yaml
interview:
  id: "JTBD-001"
  datum: "2026-02-XX"
  deelnemer:
    alias: "Deelnemer A" # Geen echte namen (AVG)
    leeftijd_range: "35-44"
    huishouden: "stel zonder kinderen"
    wijn_budget_maand: "€80-120"
    online_frequentie: "maandelijks"

  timeline:
    laatste_aankoop: "2026-01-15"
    aanleiding: "Diner met vrienden"
    kanaal: "Vivino app → doorverwezen naar webshop"
    besteld: "2x Barolo, 1x Chianti"
    bedrag: "€67"

  vier_krachten:
    push:
      - "Slijterij had beperkt Italiaans aanbod"
      - "Geen advies op maat bij Albert Heijn"
    pull:
      - "Meer keuze, reviews van andere kopers"
      - "Bezorging op zaterdag"
    angst:
      - "Kan niet proeven voor aankoop"
      - "Bezorgschade (kapotte flessen)"
    inertie:
      - "Gewend aan Gall & Gall"
      - "Moet creditcard hebben"

  jobs:
    functioneel: "Gemakkelijk goede Italiaanse wijn vinden zonder expert te zijn"
    sociaal: "Indruk maken met een bijzondere fles bij een etentje"
    emotioneel: "Het gevoel van een Italiaanse vakantie herbeleven"

  abonnement:
    interesse: "ja/nee/misschien"
    ideaal_aantal_flessen: 3
    max_budget_maand: "€60"
    voorkeur: "mix expert keuze + eigen keuze"

  quotes:
    - "Ik wil niet 200 wijnen zien, ik wil dat iemand zegt: deze moet je proberen"
    - "iDEAL is een must, creditcard is een dealbreaker"
```

---

## 4. Analyse Framework

### Job Statement Formaat

```
Wanneer ik [SITUATIE],
wil ik [MOTIVATIE],
zodat ik [GEWENST RESULTAAT].
```

**Voorbeeld**:

```
Wanneer ik gasten ontvang voor een Italiaans diner,
wil ik een perfecte wijn-spijs combinatie vinden,
zodat ik kan genieten zonder me zorgen te maken over de keuze.
```

### Opportunity Score Berekening

Per job, laat deelnemers scoren op 1-10 schaal:

| Variabele            | Vraag                                               |
| -------------------- | --------------------------------------------------- |
| **Importance (I)**   | "Hoe belangrijk is [job] voor je?" (1-10)           |
| **Satisfaction (S)** | "Hoe goed lost je huidige oplossing dit op?" (1-10) |

**Formule**:

```
Opportunity Score = Importance + MAX(Importance - Satisfaction, 0)
```

| Score Range | Interpretatie     | Actie                  |
| ----------- | ----------------- | ---------------------- |
| > 15        | **Zeer kansrijk** | Primaire positionering |
| 12-15       | **Kansrijk**      | Secundaire feature     |
| 10-12       | **Neutraal**      | Nice-to-have           |
| < 10        | **Over-served**   | Geen prioriteit        |

### Verwachte Output na 10 Interviews

| Deliverable                     | Format                           |
| ------------------------------- | -------------------------------- |
| 5-8 gevalideerde job statements | Tabel                            |
| Top 3 opportunity scores        | Ranked lijst                     |
| Vier-krachten heatmap           | Visual (push/pull/angst/inertie) |
| Abonnement interesse %          | Percentage + voorwaarden         |
| Quote wall (15-20 beste quotes) | Lijst voor marketing             |
| Persona hypotheses (2-3 types)  | Beschrijvend                     |

---

## 5. Checklist

- [ ] 10 deelnemers geworven (mix kanalen)
- [ ] Interviews ingepland (45-60 min, video of in-person)
- [ ] Opname-toestemming verkregen (AVG)
- [ ] Alle interviews afgenomen en opgenomen
- [ ] Template per interview ingevuld (YAML/Sheets)
- [ ] Job statements geformuleerd (5-8)
- [ ] Opportunity scores berekend
- [ ] Vier-krachten analyse samengevat
- [ ] Quote wall samengesteld
- [ ] Bevindingen doorvertaald naar VINO-138 (pricing) en VINO-139 (MVP)
