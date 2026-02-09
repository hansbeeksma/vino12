# VINO-138: Pricing Validation (Per Fles / Abonnement / Bundles)

> **Parent**: VINO-132 | **Doorlooptijd**: 2 weken | **Bronnen**: 60 Perplexity citaties
> **Doel**: Bepaal optimale prijspunten voor losse flessen, abonnementen en bundels

---

## 1. Methode-Overzicht

| Methode                   | Wat het meet                              | Sample        | Duur          |
| ------------------------- | ----------------------------------------- | ------------- | ------------- |
| **Van Westendorp PSM**    | Prijsperceptie (te goedkoop → te duur)    | n=30-50       | Online survey |
| **Gabor-Granger**         | Vraagcurve per prijspunt                  | n=30-50       | Online survey |
| **Choice-Based Conjoint** | Trade-off voorkeuren (prijs vs. features) | n=50-100      | Online survey |
| **Concurrentiebenchmark** | Marktpositionering                        | Desk research | 1 dag         |

---

## 2. Van Westendorp Price Sensitivity Meter

### Survey Vragen (Nederlands)

Toon een productbeschrijving + foto van een VINO12 fles (bijv. Chianti Classico):

| Code    | Vraag                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| **VW1** | "Bij welke prijs per fles zou je deze wijn **te goedkoop** vinden, waardoor je twijfelt aan de kwaliteit?" |
| **VW2** | "Bij welke prijs per fles vind je deze wijn een **koopje** — een goede deal voor de kwaliteit?"            |
| **VW3** | "Bij welke prijs per fles wordt deze wijn **duur** — je koopt hem nog wel, maar moet nadenken?"            |
| **VW4** | "Bij welke prijs per fles is deze wijn **te duur** — je zou hem nooit kopen, ongeacht de kwaliteit?"       |

### Antwoord Format

| Vraag             | Bereik    | Stappen |
| ----------------- | --------- | ------- |
| VW1 (Te goedkoop) | €3 - €20  | €1      |
| VW2 (Koopje)      | €5 - €25  | €1      |
| VW3 (Duur)        | €10 - €40 | €1      |
| VW4 (Te duur)     | €15 - €60 | €1      |

### Analyse: 4 Intersectiepunten

Plot cumulatieve frequentie-curven en vind:

| Intersectie                               | Betekenis                           | Verwacht VINO12 |
| ----------------------------------------- | ----------------------------------- | --------------- |
| **PMC** (Point of Marginal Cheapness)     | "Te goedkoop" × "Koopje" kruispunt  | ~€9             |
| **PME** (Point of Marginal Expensiveness) | "Duur" × "Te duur" kruispunt        | ~€22            |
| **OPP** (Optimal Price Point)             | "Te goedkoop" × "Te duur" kruispunt | ~€15-17         |
| **IDP** (Indifference Price Point)        | "Koopje" × "Duur" kruispunt         | ~€13-14         |

**Acceptabel prijsbereik**: PMC → PME (verwacht: €9-22)

### Opname Template

```csv
respondent_id,leeftijd,geslacht,wijn_frequentie,vw1_te_goedkoop,vw2_koopje,vw3_duur,vw4_te_duur
R001,38,V,wekelijks,7,11,18,28
R002,45,M,maandelijks,5,9,15,22
...
```

---

## 3. Gabor-Granger Vraagcurve

### Prijsladders

Test sequentieel of respondent zou kopen op elk prijspunt:

#### Losse Fles

| Stap | Prijs  | Vraag: "Zou je deze wijn kopen voor €X?" |
| ---- | ------ | ---------------------------------------- |
| 1    | €8,99  | Ja / Nee                                 |
| 2    | €10,99 | Ja / Nee                                 |
| 3    | €12,99 | Ja / Nee                                 |
| 4    | €14,99 | Ja / Nee                                 |
| 5    | €16,99 | Ja / Nee                                 |
| 6    | €19,99 | Ja / Nee                                 |
| 7    | €22,99 | Ja / Nee                                 |
| 8    | €24,99 | Ja / Nee                                 |
| 9    | €29,99 | Ja / Nee                                 |
| 10   | €34,99 | Ja / Nee                                 |

#### Maandabonnement (3 flessen)

| Stap | Prijs/maand | Vraag: "Zou je dit abonnement nemen voor €X/maand?" |
| ---- | ----------- | --------------------------------------------------- |
| 1    | €34,99      | Ja / Nee                                            |
| 2    | €39,99      | Ja / Nee                                            |
| 3    | €44,99      | Ja / Nee                                            |
| 4    | €49,99      | Ja / Nee                                            |
| 5    | €54,99      | Ja / Nee                                            |
| 6    | €59,99      | Ja / Nee                                            |
| 7    | €69,99      | Ja / Nee                                            |
| 8    | €79,99      | Ja / Nee                                            |

#### Kwartaalpakket (6 flessen)

| Stap | Prijs/kwartaal | Vraag: "Zou je dit pakket bestellen voor €X?" |
| ---- | -------------- | --------------------------------------------- |
| 1    | €59,99         | Ja / Nee                                      |
| 2    | €69,99         | Ja / Nee                                      |
| 3    | €79,99         | Ja / Nee                                      |
| 4    | €89,99         | Ja / Nee                                      |
| 5    | €99,99         | Ja / Nee                                      |
| 6    | €119,99        | Ja / Nee                                      |
| 7    | €139,99        | Ja / Nee                                      |

### Analyse

Per prijspunt: bereken **koopintentie %** → plot vraagcurve.
**Revenue-maximalisatie**: Prijs × Koopintentie % = Revenue index.

```
Prijs   | Koopintentie | Revenue Index
€12,99  | 85%          | 11.04
€14,99  | 72%          | 10.79
€16,99  | 58%          | 9.85   ← verlaagt
€19,99  | 35%          | 6.99   ← steep decline
```

**Optimale prijs** = hoogste Revenue Index.

### Opname Template

```csv
respondent_id,product_type,price_8.99,price_10.99,price_12.99,price_14.99,price_16.99,price_19.99,price_22.99,price_24.99,price_29.99,price_34.99
R001,fles,ja,ja,ja,ja,nee,nee,nee,nee,nee,nee
R002,fles,ja,ja,ja,nee,nee,nee,nee,nee,nee,nee
```

---

## 4. Choice-Based Conjoint (CBC)

### Attributen & Niveaus

| Attribuut           | Niveau 1              | Niveau 2                 | Niveau 3                       |
| ------------------- | --------------------- | ------------------------ | ------------------------------ |
| **Prijs per fles**  | €12,99                | €16,99                   | €21,99                         |
| **Aantal flessen**  | 2 flessen             | 3 flessen                | 6 flessen                      |
| **Frequentie**      | Maandelijks           | Elke 2 maanden           | Per kwartaal                   |
| **Selectiemethode** | Expert kiest voor jou | Jij kiest uit selectie   | Mix (1 expert + rest zelf)     |
| **Extra's**         | Geen                  | Proefnotities + recepten | + Online proeverij (1x/kwart.) |

### Conjoint Keuzetaak (voorbeeld)

Respondent ziet steeds 3 opties + "geen van deze":

```
┌──────────────────┬──────────────────┬──────────────────┐
│    Optie A       │    Optie B       │    Optie C       │
├──────────────────┼──────────────────┼──────────────────┤
│ €16,99/fles      │ €12,99/fles      │ €21,99/fles      │
│ 3 flessen        │ 2 flessen        │ 6 flessen        │
│ Maandelijks      │ Per kwartaal     │ Elke 2 maanden   │
│ Expert kiest     │ Jij kiest        │ Mix              │
│ Proefnotities    │ Geen extra's     │ + Online proeverij│
│                  │                  │                  │
│ = €50,97/maand   │ = €25,98/kwart.  │ = €131,94/2mnd   │
├──────────────────┼──────────────────┼──────────────────┤
│     ○ Kies A     │     ○ Kies B     │     ○ Kies C     │
└──────────────────┴──────────────────┴──────────────────┘
                   ○ Geen van deze
```

**Minimaal 8-12 keuzetaken per respondent** (orthogonaal design).

### Analyse Output

| Output                   | Beschrijving                                    |
| ------------------------ | ----------------------------------------------- |
| **Part-worth utilities** | Relatieve waarde per attribuut-niveau           |
| **Relative importance**  | % belang per attribuut (verwacht: prijs 35-45%) |
| **Willingness-to-Pay**   | Prijspremie voor elk niveau vs. baseline        |
| **Market simulator**     | "Wat als" scenario's voor bundel-configuratie   |

### Opname Template

```csv
respondent_id,task_nr,optie_a_prijs,optie_a_flessen,optie_a_freq,...,keuze
R001,1,16.99,3,maandelijks,...,A
R001,2,21.99,2,kwartaal,...,geen
```

---

## 5. Concurrentiebenchmark

### Nederlandse Markt — Directe Concurrenten

| Concurrent          | Prijs/fles | Abonnement       | USP                          |
| ------------------- | ---------- | ---------------- | ---------------------------- |
| **Wijnvoordeel.nl** | €5-15      | €49,95/6 flessen | Laagste prijs, breed         |
| **Grand Cru Club**  | €12-25     | €69/3 flessen    | Premium selectie             |
| **Vindict**         | €10-20     | €49/3 flessen    | Ontdekking, onbekende makers |
| **Grapedistrict**   | €8-18      | €39,95/3 flessen | Biologisch focus             |
| **Henri Bloem**     | €7-15      | Geen             | Traditioneel, winkelketen    |

### VINO12 Positionering

```
Prijs/fles →  €5    €10    €15    €20    €25    €30
              │      │      │      │      │      │
Wijnvoordeel  ████████░░░░░░
Henri Bloem   ░░░████████░░░
Grapedistrict ░░░░████████░░
Vindict       ░░░░░░████████
VINO12        ░░░░░░░░████████████  ← Premium Italiaans
Grand Cru     ░░░░░░░░░░████████████
```

**VINO12 sweet spot**: €13-25 per fles (boven massamarkt, onder ultra-premium).

---

## 6. Gecombineerd Opname Schema (Google Sheets)

### Sheet: "Pricing Raw Data"

| Kolom                                    | Type                | Bron           |
| ---------------------------------------- | ------------------- | -------------- |
| `respondent_id`                          | Text                | Uniek          |
| `datum`                                  | Date                | Survey         |
| `leeftijd`                               | Number              | Screening      |
| `geslacht`                               | Select              | Screening      |
| `wijn_budget_maand`                      | Number              | Screening      |
| `online_frequentie`                      | Select              | Screening      |
| `vw1_te_goedkoop`                        | Number (€)          | Van Westendorp |
| `vw2_koopje`                             | Number (€)          | Van Westendorp |
| `vw3_duur`                               | Number (€)          | Van Westendorp |
| `vw4_te_duur`                            | Number (€)          | Van Westendorp |
| `gg_fles_8.99` ... `gg_fles_34.99`       | Boolean             | Gabor-Granger  |
| `gg_abo_34.99` ... `gg_abo_79.99`        | Boolean             | Gabor-Granger  |
| `cbc_task1_keuze` ... `cbc_task12_keuze` | Select (A/B/C/geen) | Conjoint       |

### Sheet: "Pricing Analysis"

| Cel                 | Formule                      | Output       |
| ------------------- | ---------------------------- | ------------ |
| `OPP`               | Intersectie VW1 × VW4 curven | €XX,XX       |
| `IDP`               | Intersectie VW2 × VW3 curven | €XX,XX       |
| `Revenue Max Fles`  | MAX(Prijs × Koopintentie%)   | €XX,XX       |
| `Revenue Max Abo`   | MAX(Prijs × Koopintentie%)   | €XX,XX/maand |
| `Prijs Importance%` | Conjoint part-worth          | XX%          |

---

## 7. Checklist

- [ ] Survey tool gekozen (Typeform / Google Forms / Survicate)
- [ ] Van Westendorp vragen geprogrammeerd met productfoto
- [ ] Gabor-Granger ladder voor 3 producttypes
- [ ] Conjoint design gegenereerd (orthogonaal, 8-12 taken)
- [ ] Survey getest met 3 pilot-respondenten
- [ ] n=30-50 respondenten geworven (via JTBD deelnemers + uitbreiding)
- [ ] Data verzameld en opgeschoond
- [ ] VW intersectiepunten berekend (OPP, IDP, PMC, PME)
- [ ] GG vraagcurven geplot + revenue-optimale prijs bepaald
- [ ] CBC part-worth utilities berekend
- [ ] Concurrentiebenchmark ingevuld
- [ ] Prijsaanbeveling geformuleerd (fles + abo + bundel)
- [ ] Doorvertaald naar VINO-139 (Concierge MVP pricing)
