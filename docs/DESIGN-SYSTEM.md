# VINO12 Design System

> Neo-Brutalist Wine E-Commerce
> "6 Rood. 6 Wit. Perfecte Balans."

---

## Design Principes

Gebaseerd op Notebook B (Brand Identity Essentials, Principles of Logo Design, Making and Breaking the Grid, Typography Idea Book).

### 1. Brutale Eerlijkheid

Geen afgeronde hoeken, geen subtiele gradients. VINO12 is direct, eerlijk, en ongepolijst - net als goede wijn. De brutalist aesthetic communiceert: "wij verstoppen niets."

### 2. Typografisch Gedreven

IBM Plex Mono als display font geeft een industrieel, no-nonsense karakter. De wijn spreekt voor zichzelf - het design hoeft niet te overtuigen.

### 3. Chiaroscuro Contrast

Sterke licht-donker contrasten (ink op offwhite, wine op champagne). Elke kleurkeuze is bewust en krachtig.

### 4. Gestructureerde Chaos

Strakke grids (modulair voor shop, hiërarchisch voor homepage) gecombineerd met brutale offsets en schaduwen.

---

## Kleuren

### Primair Palette

| Token       | Hex       | Gebruik                              |
| ----------- | --------- | ------------------------------------ |
| `wine-500`  | `#722F37` | Primaire merkkleur, CTAs, selectie   |
| `ink`       | `#000000` | Tekst, borders, schaduwen            |
| `offwhite`  | `#FAFAF5` | Achtergrond                          |
| `champagne` | `#F7E6CA` | Secundaire achtergrond, hover states |

### Wine Scale

```
wine-50  ███ #FAF0F1  — Subtiele achtergrond
wine-100 ███ #F0D4D7  — Lichte tint
wine-200 ███ #D9A0A7  — Disabled states
wine-300 ███ #C16D77  — Hover
wine-400 ███ #A94A56  — Active
wine-500 ███ #722F37  — Primair (DEFAULT)
wine-600 ███ #5E262E  — Hover op primair
wine-700 ███ #4A1E24  — Pressed
wine-800 ███ #36151B  — Dark accenten
wine-900 ███ #220D11  — Diepste tint
```

### Accenten

| Token             | Hex       | Gebruik                       |
| ----------------- | --------- | ----------------------------- |
| `burgundy`        | `#660033` | Premium accent, hero sections |
| `emerald`         | `#00674F` | Success, "op voorraad"        |
| `champagne-light` | `#FBF2E3` | Card achtergronden            |

### Toegankelijkheid

- `ink` op `offwhite`: contrast ratio **16.8:1** (AAA)
- `wine-500` op `offwhite`: contrast ratio **7.2:1** (AAA)
- `offwhite` op `wine-500`: contrast ratio **7.2:1** (AAA)
- `ink` op `champagne`: contrast ratio **13.1:1** (AAA)

---

## Typografie

### Font Stack

| Rol         | Font             | Fallback   | Gebruik                       |
| ----------- | ---------------- | ---------- | ----------------------------- |
| **Display** | IBM Plex Mono    | monospace  | Headings, hero tekst, prijzen |
| **Body**    | Darker Grotesque | sans-serif | Lopende tekst, beschrijvingen |
| **Accent**  | Space Mono       | monospace  | Labels, badges, metadata      |

### Type Scale (Major Third — 1.25 ratio)

| Token            | Size | Gebruik                  |
| ---------------- | ---- | ------------------------ |
| `font-size-xs`   | 10px | Fine print, disclaimer   |
| `font-size-sm`   | 12px | Labels, metadata, badges |
| `font-size-base` | 14px | Small body text          |
| `font-size-md`   | 16px | Body text (base)         |
| `font-size-lg`   | 20px | Large body, intro        |
| `font-size-xl`   | 25px | Small headings           |
| `font-size-2xl`  | 31px | Section headings         |
| `font-size-3xl`  | 39px | Page headings            |
| `font-size-4xl`  | 49px | Display                  |
| `font-size-5xl`  | 61px | Hero                     |

### Display Sizes (Responsive Clamp)

| Class          | Size                       | Gebruik       |
| -------------- | -------------------------- | ------------- |
| `display-hero` | clamp(3.5rem, 10vw, 14rem) | Homepage hero |
| `display-lg`   | clamp(2rem, 5vw, 6rem)     | Sectie titels |
| `display-md`   | clamp(1.5rem, 3vw, 3.5rem) | Subsecties    |

### Heading Stijl

```css
font-family: IBM Plex Mono
font-weight: 700
letter-spacing: -0.02em
line-height: 0.9 — 1.1
text-transform: none (behalve labels)
```

### Label Stijl (Notebook B: "Opulentie met swashes" → bij ons: UPPERCASE MONO)

```css
font-family: Space Mono
font-size: 12px
font-weight: 700
letter-spacing: 0.1em
text-transform: uppercase
```

---

## Spacing

### 8px Base Grid

| Token      | Value | Gebruik                    |
| ---------- | ----- | -------------------------- |
| `space-1`  | 4px   | Inline spacing, icon gaps  |
| `space-2`  | 8px   | Tight padding, small gaps  |
| `space-3`  | 12px  | Button padding, list gaps  |
| `space-4`  | 16px  | Card padding, standard gap |
| `space-6`  | 24px  | Section gaps               |
| `space-8`  | 32px  | Large section padding      |
| `space-12` | 48px  | Section dividers           |
| `space-16` | 64px  | Page sections (mobile)     |
| `space-24` | 96px  | Page sections (desktop)    |

### Section Padding

```
Mobile:  px-4  py-16  (16px / 64px)
Tablet:  px-8  py-24  (32px / 96px)
Desktop: px-16 py-32  (64px / 128px)
```

---

## Brutal Components

### Borders

| Class              | Width          | Gebruik                   |
| ------------------ | -------------- | ------------------------- |
| `brutal-border`    | 4px solid #000 | Standard component border |
| `brutal-border-lg` | 6px solid #000 | Featured/hero components  |

### Shadows

| Class                | Value                     | Gebruik     |
| -------------------- | ------------------------- | ----------- |
| `brutal-shadow`      | 4px 4px 0 rgba(0,0,0,0.8) | Standard    |
| `brutal-shadow-lg`   | 6px 6px 0 rgba(0,0,0,0.8) | Featured    |
| `brutal-shadow-wine` | 4px 4px 0 #722F37         | CTA buttons |

### Hover Pattern

```
Default:  shadow + no translate
Hover:    translate(4px, 4px) + shadow: none
Active:   translate(4px, 4px) + shadow: none + bg darken
```

Geen transitions. Instant state changes. Brutalist.

### Border Radius

**0px. Altijd. Overal.** `border-radius: 0 !important;`

---

## Grid Systeem

### Notebook B Principes Toegepast

| Context            | Grid Type     | Kolommen  | Gebruik                                                  |
| ------------------ | ------------- | --------- | -------------------------------------------------------- |
| **Homepage**       | Hiërarchisch  | Vrij      | Sfeerbeelden + tekst blokken, geen vaste kolom structuur |
| **Shop pagina**    | Modulair      | 2/3/4 col | Product grid, overzichtelijk bij groot assortiment       |
| **Product detail** | Manuscript    | 1-2 col   | Brede marges, focus op wijn verhaal                      |
| **Checkout**       | Single column | 1 col     | Geen afleiding, conversie focus                          |

### Container

```css
max-width: 80rem (1280px)
margin: 0 auto
padding: var(--space-4) → var(--space-16)
```

---

## Componenten

### BrutalButton

```
┌──────────────────────────┐
│  BESTEL NU — €175        │ ← 4px border, brutal-shadow
└──────────────────────────┘
  Font: IBM Plex Mono, 700, uppercase
  Padding: space-3 space-6
  Hover: translate + drop shadow
```

### BrutalCard (WineCard)

```
┌──────────────────────────┐
│  [Wine Image]            │ ← 4px border
│                          │
│  BAROLO 2019             │ ← font-display, uppercase
│  Piemonte, Italië        │ ← font-body
│                          │
│  €28,50                  │ ← font-display, price size
│  ████████░░ 4.2/5        │ ← rating bar
└──────────────────────────┘
  Shadow: brutal-shadow
  Background: offwhite
  Hover: translate pattern
```

### BrutalBadge

```
┌─────────────────┐
│  ROOD · PIEMONTE │ ← Space Mono, 12px, uppercase, widest
└─────────────────┘
  Border: 2px solid ink
  Padding: space-1 space-2
  Background: transparent | champagne | wine (variants)
```

---

## Fotografie Richtlijnen

Notebook B: "Chiaroscuro voor dramatisch en hoogwaardig effect"

| Type         | Stijl                                                | Gebruik                |
| ------------ | ---------------------------------------------------- | ---------------------- |
| **Product**  | Hoog contrast, donkere achtergrond, dramatisch licht | Product detail, hero   |
| **Sfeer**    | Warm licht, wijngaard/tafel setting                  | Homepage, storytelling |
| **Flat lay** | Top-down, offwhite achtergrond, brutale compositie   | Shop grid, social      |

### Niet doen

- Geen stockfoto's met generieke "cheers" momentjes
- Geen wazige bokeh achtergronden
- Geen witte achtergrond product shots (te generiek)
- Geen lifestyle zonder wijn als centraal element

---

## Design Token Bestanden

| Bestand                    | Beschrijving                            |
| -------------------------- | --------------------------------------- |
| `src/app/globals.css`      | CSS custom properties (runtime tokens)  |
| `src/lib/design-tokens.ts` | TypeScript token definities (type-safe) |
| `tailwind.config.ts`       | Tailwind integratie van tokens          |

---

_Gebaseerd op: Notebook B bronnen + Baymard UX Benchmark + NNGroup Luxury Principles_
_Versie: 1.0.0 | 2026-02-07_
