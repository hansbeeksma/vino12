# Wispr Flow Setup Guide — VINO12

## 1. Installatie

1. Ga naar [wisprflow.ai](https://wisprflow.ai)
2. Download de macOS app
3. Installeer en open de app
4. Maak een account aan (abonnement ~€10-20/maand)
5. Geef de gevraagde systeemrechten:
   - **Accessibility** (Systeeminstellingen → Privacy & Beveiliging → Toegankelijkheid)
   - **Microfoon** toegang

## 2. Hotkey Configuratie

Open Wispr Flow instellingen en stel je hotkey in:

| Optie          | Toetscombinatie          | Wanneer                |
| -------------- | ------------------------ | ---------------------- |
| **Aanbevolen** | `Fn` (twee keer drukken) | Conflicteert met niks  |
| Alternatief 1  | `⌥ Option` (twee keer)   | Als Fn bezet is        |
| Alternatief 2  | `Hyper key` (Caps Lock)  | Met Karabiner-Elements |

**Test de hotkey in deze apps:**

- [ ] Safari / Chrome (Google Docs, email)
- [ ] Notes / Notities
- [ ] Slack
- [ ] WhatsApp Desktop
- [ ] VS Code / Cursor

## 3. Taalinstellingen

Wispr Flow herkent automatisch Nederlands en Engels. Controleer:

1. Open Wispr Flow instellingen → **Language**
2. Zorg dat **Dutch (Nederlands)** en **English** beide actief zijn
3. Wispr Flow switcht automatisch op basis van wat je spreekt

## 4. Basistest

Dicteer de volgende test-zinnen om de accuracy te controleren:

**Nederlands:**

> "De Pinot Noir uit de Bourgogne heeft tonen van rode kers en viooltje, met zijdezachte tannines."

**Engels:**

> "Our Sauvignon Blanc from Marlborough pairs perfectly with fresh oysters and goat cheese."

**Mix (zoals in dagelijks gebruik):**

> "De nieuwe Albariño uit Rías Baixas is perfect voor de zomer collectie. Price point rond de 14 euro."

## 5. Personal Dictionary

Wispr Flow leert automatisch nieuwe termen. Om het leerproces te versnellen:

1. Dicteer bewust alle wijn-specifieke termen uit `wine-dictionary.txt`
2. Corrigeer fouten direct in de tekst (Wispr Flow leert hiervan)
3. Na ~50 dicteersessies zijn de meeste termen geleerd

**Zie:** `wine-dictionary.txt` voor de complete termenlijst.

## 6. Voice Snippets

Veelgebruikte zinnen/templates zijn beschikbaar in `voice-snippets.md`.
Gebruik deze als basis voor snelle content creatie.

## 7. Troubleshooting

| Probleem                         | Oplossing                                              |
| -------------------------------- | ------------------------------------------------------ |
| Hotkey werkt niet                | Check Accessibility rechten in Systeeminstellingen     |
| Slechte accuracy                 | Spreek iets langzamer, zorg voor rustige omgeving      |
| Nederlandse termen fout          | Dicteer de term een paar keer, Wispr Flow leert        |
| App reageert niet                | Herstart de app (⌘Q → open opnieuw)                    |
| Wispr Flow herkent taal verkeerd | Begin je zin met een duidelijk Nederlands/Engels woord |
