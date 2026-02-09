# VINO-139: Concierge MVP (10 Handmatige Bestellingen)

> **Parent**: VINO-132 | **Doorlooptijd**: 2-3 weken | **Bronnen**: 60 Perplexity citaties
> **Doel**: Valideer de volledige klantervaring met 10 echte bestellingen, handmatig uitgevoerd

---

## 1. Wat is een Concierge MVP?

Handmatig de volledige klantjourney uitvoeren alsof de webshop live is, maar zonder afhankelijkheid van technologie. Je bent de "conciërge" die elke stap persoonlijk afhandelt.

**Waarom**: Voordat je schaalt, bewijs dat klanten:

1. Bereid zijn te betalen
2. Tevreden zijn met het product
3. Opnieuw zouden bestellen

---

## 2. Werving van 10 Klanten

### Kanalen

| Kanaal                  | Methode                                          | Target      | Conversie         |
| ----------------------- | ------------------------------------------------ | ----------- | ----------------- |
| **JTBD deelnemers**     | Directe uitnodiging na interview                 | 3-4 klanten | Hoog (al engaged) |
| **Instagram**           | DM naar wijn-enthousiastelingen (#italiansewijn) | 2-3 klanten | Medium            |
| **Persoonlijk netwerk** | WhatsApp naar wijnliefhebbers in je kring        | 2-3 klanten | Hoog              |
| **LinkedIn**            | Post over Italiaans wijn concept                 | 1-2 klanten | Laag              |

### Pitch Script

```
"Ik start VINO12: een curated selectie van 12 bijzondere Italiaanse
wijnen, rechtstreeks van kleine wijnmakers. Ik zoek 10 early adopters
die een proefpakket willen bestellen.

Je krijgt 3 handgeselecteerde flessen voor €[prijs uit VINO-138],
inclusief persoonlijke proefnotities en food pairing tips.

Interesse? Ik stuur je een link om te bestellen."
```

---

## 3. Bestelling & Fulfillment Checklist

### Per Bestelling

```yaml
order:
  id: "MVP-001"
  datum_bestelling: "2026-03-XX"
  klant:
    alias: "Klant A" # AVG
    kanaal: "JTBD interview"
    postcode: "1012XX"

  bestelling:
    wijnen:
      - naam: "Chianti Classico Riserva"
        inkoop: €7.50
        verkoop: €16.99
      - naam: "Barolo DOCG"
        inkoop: €12.00
        verkoop: €24.99
      - naam: "Vermentino di Sardegna"
        inkoop: €5.50
        verkoop: €13.99
    totaal_verkoop: €55.97
    verzendkosten: €6.95
    totaal_klant: €62.92

  betaling:
    methode: "Tikkie / iDEAL" # Geen Mollie nodig voor MVP
    status: "betaald"
    datum: "2026-03-XX"

  fulfillment:
    verpakking: "3-fles wijnverzenddoos (Rajapack)"
    proefnotities: "ja" # Uitgeprint A5 kaartje per wijn
    extras: "Handgeschreven bedankkaartje"
    verzender: "PostNL"
    track_trace: "3SXXXX..."
    datum_verzonden: "2026-03-XX"
    datum_bezorgd: "2026-03-XX"
    bezorgstatus: "afgeleverd"

  feedback:
    nps_score: null # Na 7 dagen
    tevredenheid: null # Na 7 dagen
    herhaalaankoop: null # Na 14 dagen
```

---

## 4. Unit Economics Template

### Per Order Berekening

| Kostenpost             | Berekening                                   | Verwacht   |
| ---------------------- | -------------------------------------------- | ---------- |
| **COGS (wijn inkoop)** | Som inkoop 3 flessen                         | €25.00     |
| **Verpakking**         | 3-fles verzenddoos + vulmateriaal + kaartjes | €8.00      |
| **Verzending**         | PostNL pakket (tot 10 kg)                    | €6.95      |
| **Betaalkosten**       | Tikkie (gratis) / iDEAL (€0.29)              | €0.29      |
| **Totale kosten**      | COGS + verpakking + verzending + betaal      | **€40.24** |
| **Omzet**              | Verkoopprijs + verzendkosten                 | **€62.92** |
| **Brutowinst**         | Omzet - Totale kosten                        | **€22.68** |
| **Brutomarge**         | Brutowinst / Omzet × 100                     | **36%**    |

### Samenvatting 10 Orders

| Metric                | Formule                             | Target           |
| --------------------- | ----------------------------------- | ---------------- |
| Totale omzet          | SOM(omzet per order)                | €500-700         |
| Totale COGS           | SOM(kosten per order)               | €300-400         |
| Gemiddelde brutomarge | AVG(marge per order)                | >35%             |
| Break-even volume     | Vaste kosten / Brutomarge per order | XX orders/maand  |
| CAC (voor deze 10)    | Marketing spend / 10                | <€25 (organisch) |

---

## 5. Customer Journey Tracking

### Touchpoint Effort Matrix

| Stap | Touchpoint                    | Kanaal          | Jouw Tijdsinvestering | Klantervaring (1-5) |
| ---- | ----------------------------- | --------------- | --------------------- | ------------------- |
| 1    | Eerste contact                | WhatsApp/DM     | 5 min                 | \_                  |
| 2    | Productinfo sturen            | WhatsApp + PDF  | 10 min                | \_                  |
| 3    | Bestelling ontvangen          | Tikkie/iDEAL    | 2 min                 | \_                  |
| 4    | Bevestigingsmail              | Handmatig email | 5 min                 | \_                  |
| 5    | Wijn inkopen                  | Leverancier     | 30 min (eenmalig)     | n.v.t.              |
| 6    | Verpakken                     | Thuis           | 15 min                | n.v.t.              |
| 7    | Verzenden (PostNL)            | Servicepunt     | 10 min                | \_                  |
| 8    | Track & Trace sturen          | WhatsApp        | 2 min                 | \_                  |
| 9    | Bezorgbevestiging             | WhatsApp        | 2 min                 | \_                  |
| 10   | Feedback vragen (dag 7)       | WhatsApp        | 5 min                 | \_                  |
| 11   | Herhaalaankoop check (dag 14) | WhatsApp        | 5 min                 | \_                  |

**Totale tijd per order**: ~90 min (excl. inkoop)
**Doel**: Identificeer welke stappen te automatiseren zijn.

---

## 6. Feedback Survey (Na 7 Dagen)

### WhatsApp-vriendelijke Vragen

Stuur via WhatsApp, kort en informeel:

```
Hey [naam]! Je VINO12 pakket is nu een week geleden bezorgd.
Ik heb 5 korte vragen — duurt 2 minuten:

1. Hoe tevreden ben je over de wijnen? (1-10)

2. Welke wijn vond je het lekkerst? En waarom?

3. Waren de proefnotities en food pairing tips nuttig? (ja/beetje/nee)

4. Zou je opnieuw bestellen bij VINO12? (zeker/waarschijnlijk/misschien/nee)

5. Zou je VINO12 aanbevelen aan een vriend? (0-10)
   [Dit is je NPS score]

Bonus: Wat zou je anders willen? (open)
```

### NPS Berekening

| Score | Categorie     |
| ----- | ------------- |
| 9-10  | **Promoter**  |
| 7-8   | **Passief**   |
| 0-6   | **Detractor** |

```
NPS = (% Promoters) - (% Detractors)
```

| NPS          | Interpretatie | Actie                     |
| ------------ | ------------- | ------------------------- |
| +50 tot +100 | Uitstekend    | Doorgaan, schalen         |
| +30 tot +49  | Goed          | Doorgaan, optimaliseren   |
| 0 tot +29    | OK            | Verbeterpunten aanpakken  |
| <0           | Problematisch | Fundamenteel heroverwegen |

---

## 7. Herhaalaankoop Check (Na 14 Dagen)

```
Hey [naam]! Hoe gaat het met de wijnen?

Ik heb volgende week een nieuw pakket beschikbaar met
3 andere Italiaanse wijnen. Interesse?

[Ja → nieuwe bestelling opnemen]
[Nee → "Waarom niet?" doorvragen]
```

### Herhaalaankoop Metrics

| Metric                  | Berekening                         | Target        |
| ----------------------- | ---------------------------------- | ------------- |
| Herhaalaankoop %        | Klanten die opnieuw bestellen / 10 | >50%          |
| Herhaalaankoop snelheid | Gemiddeld dagen tot 2e bestelling  | <30 dagen     |
| Churn reden             | Meest genoemde reden bij "nee"     | Categoriseren |

---

## 8. Go/No-Go Thresholds (uit Concierge MVP)

| Metric                  | No-Go (<) | Conditional | Go (>) |
| ----------------------- | --------- | ----------- | ------ |
| NPS                     | +20       | +20 tot +40 | +40    |
| Herhaalaankoop intentie | 50%       | 50-70%      | 70%    |
| Tevredenheid (gem.)     | 7.0       | 7.0-8.0     | 8.0    |
| Brutomarge              | 30%       | 30-40%      | 40%    |
| Operationele tijd/order | >2 uur    | 1-2 uur     | <1 uur |

---

## 9. Benodigdheden

| Item                        | Leverancier                          | Kosten       |
| --------------------------- | ------------------------------------ | ------------ |
| 3-fles verzenddozen (20x)   | Rajapack / VerzendVerpakking.nl      | ~€3/stuk     |
| Vulmateriaal (luchtkussens) | Rajapack                             | ~€15/rol     |
| Proefnotitie kaartjes (A5)  | Drukwerk / Canva + thuis printen     | ~€0.50/stuk  |
| Bedankkaartjes              | Handgeschreven                       | €0           |
| PostNL verzendlabels        | PostNL zakelijk of servicepunt       | €6.95/pakket |
| Tikkie account              | ABN AMRO (gratis)                    | €0           |
| Wijn voorraad (30 flessen)  | Italiaanse leverancier / groothandel | ~€200-300    |

**Totale investering**: ~€350-500 voor 10 orders

---

## 10. Checklist

- [ ] 10 klanten geworven (mix kanalen)
- [ ] Prijspunt bepaald (uit VINO-138)
- [ ] Wijn ingekocht (30 flessen, 3 soorten)
- [ ] Verpakkingsmateriaal besteld
- [ ] Proefnotities geschreven en geprint
- [ ] Betaalmethode opgezet (Tikkie)
- [ ] Alle 10 bestellingen ontvangen en betaald
- [ ] Alle 10 pakketten verzonden met T&T
- [ ] Feedback survey verstuurd (dag 7) — alle 10 ontvangen
- [ ] NPS berekend
- [ ] Herhaalaankoop check (dag 14) — resultaten vastgelegd
- [ ] Unit economics per order berekend
- [ ] Journey touchpoint effort matrix ingevuld
- [ ] Go/No-Go thresholds getoetst
- [ ] Bevindingen doorvertaald naar VINO-140 (Channel Test)
