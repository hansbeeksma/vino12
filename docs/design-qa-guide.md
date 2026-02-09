# Design QA Guide — VINO12

Handleiding voor designers om UI afwijkingen te identificeren en rapporteren.

---

## 1. Design Token Verificatie

VINO12 gebruikt een brutalist design system met specifieke tokens.

### Kleuren

| Token       | Hex       | Gebruik                                   |
| ----------- | --------- | ----------------------------------------- |
| `wine`      | `#722F37` | Primaire brand kleur, CTA achtergrond     |
| `champagne` | `#F5F0E8` | Secundaire achtergrond, sectie highlights |
| `ink`       | `#1A1A1A` | Tekst, borders                            |
| `offwhite`  | `#FAFAF5` | Body achtergrond                          |
| `gold`      | `#C5A55A` | Premium accenten, badges                  |

### Typografie

| Token            | Font             | Gebruik                           |
| ---------------- | ---------------- | --------------------------------- |
| `--font-display` | IBM Plex Mono    | Headlines, titels, display tekst  |
| `--font-accent`  | Space Mono       | Labels, accenten, uppercase tekst |
| `--font-body`    | Darker Grotesque | Body tekst, beschrijvingen        |

### Spacing

Brutalist spacing volgt Tailwind defaults met custom section padding:

- `section-padding`: `py-16 md:py-24`
- `container-brutal`: `max-w-7xl mx-auto px-4`

### Verificatie Checklist

- [ ] Kleuren matchen de token tabel exact
- [ ] Fonts zijn correct per element type (display/accent/body)
- [ ] Spacing is consistent per breakpoint
- [ ] Border widths zijn `2px solid` (brutalist standaard)

---

## 2. Component Mapping (Figma → Code)

| Figma Component  | Shadcn/ui / Custom                 | Bestandspad                          |
| ---------------- | ---------------------------------- | ------------------------------------ |
| Button Primary   | `BrutalButton variant="primary"`   | `src/components/ui/BrutalButton.tsx` |
| Button Secondary | `BrutalButton variant="secondary"` | `src/components/ui/BrutalButton.tsx` |
| Button Gold      | `BrutalButton variant="gold"`      | `src/components/ui/BrutalButton.tsx` |
| Card             | `BrutalCard`                       | `src/components/ui/BrutalCard.tsx`   |
| Badge            | `BrutalBadge`                      | `src/components/ui/BrutalBadge.tsx`  |
| Premium Badge    | `PremiumBadge`                     | `src/components/ui/PremiumBadge.tsx` |
| Section Label    | `SectionLabel`                     | `src/components/ui/SectionLabel.tsx` |
| Progress Bar     | `ProgressBar`                      | `src/components/ui/ProgressBar.tsx`  |
| Marquee Strip    | `MarqueeStrip`                     | `src/components/ui/MarqueeStrip.tsx` |
| Feature Gate     | `FeatureGate`                      | `src/components/ui/FeatureGate.tsx`  |

### Storybook Referentie

Alle bovenstaande componenten hebben Storybook stories:

```bash
npm run storybook
# Open http://localhost:6006
```

Stories beschikbaar voor: BrutalButton, BrutalCard, SectionLabel, BrutalBadge, ProgressBar.

---

## 3. Responsiveness Checklist

### Breakpoints

| Breakpoint | Tailwind | Min-Width | Typisch Apparaat |
| ---------- | -------- | --------- | ---------------- |
| Mobile     | default  | 0px       | iPhone SE/14     |
| `sm`       | `sm:`    | 640px     | Landscape phone  |
| `md`       | `md:`    | 768px     | iPad             |
| `lg`       | `lg:`    | 1024px    | iPad Pro, laptop |
| `xl`       | `xl:`    | 1280px    | Desktop          |
| `2xl`      | `2xl:`   | 1536px    | Large desktop    |

### Per-Pagina Check

| Pagina           | Route          | Kritieke Elementen                |
| ---------------- | -------------- | --------------------------------- |
| Homepage         | `/`            | Hero sectie, CollectionGrid, CTA  |
| Wijnen overzicht | `/wijnen`      | Grid layout (1/2/3 kolommen)      |
| Wijn detail      | `/wijn/[slug]` | Product afbeelding + info layout  |
| Winkelwagen      | `/winkelwagen` | Cart items, totalen, CTA          |
| Checkout         | `/afrekenen`   | Formulier layout, Mollie redirect |

### Responsiveness Verificatie

- [ ] Alle pagina's getest op mobile (375px)
- [ ] Grid layouts schalen correct (1→2→3 kolommen)
- [ ] Tekst is leesbaar op alle schermgroottes
- [ ] Touch targets zijn minimaal 44x44px
- [ ] Geen horizontale scroll op mobile
- [ ] Afbeeldingen schalen proportioneel

---

## 4. Pixel-Perfect Vergelijking

### Tools

1. **Figma Overlay** — Browser extensie voor overlay vergelijking
2. **Browser DevTools** — Responsive mode + screenshot
3. **Playwright Visual Tests** — Automatische screenshot vergelijking

### Workflow

1. Open de implementatie in de browser
2. Open het Figma design naast de browser
3. Vergelijk element voor element:
   - Positie en alignment
   - Spacing (margins/paddings)
   - Kleur en typografie
   - Border en schaduw
4. Noteer afwijkingen met screenshots

### Tolerantie

| Aspect        | Acceptabel  | Actie Nodig    |
| ------------- | ----------- | -------------- |
| Positie       | ±2px        | >2px verschil  |
| Kleur         | Exact match | Elke afwijking |
| Font-size     | Exact match | Elke afwijking |
| Spacing       | ±4px        | >4px verschil  |
| Border-radius | ±1px        | >1px verschil  |

---

## 5. Design Bug Reporting

### Template voor Plane Issues

Gebruik dit format bij het aanmaken van design bugs:

```markdown
**Type:** Design Bug
**Pagina:** [pagina naam + route]
**Breakpoint:** [mobile/tablet/desktop + px]
**Browser:** [Chrome/Safari/Firefox + versie]

## Beschrijving

[Korte beschrijving van de afwijking]

## Screenshots

- **Figma (verwacht):** [screenshot]
- **Implementatie (actueel):** [screenshot]

## Details

| Aspect          | Figma    | Implementatie |
| --------------- | -------- | ------------- |
| [bijv. kleur]   | [waarde] | [waarde]      |
| [bijv. spacing] | [waarde] | [waarde]      |

## Prioriteit

- [ ] Blokkerend (launch-critical)
- [ ] Hoog (zichtbaar voor gebruiker)
- [ ] Medium (subtiele afwijking)
- [ ] Laag (perfectionist fix)
```

### Labels voor Design Bugs

| Label        | Kleur   | Wanneer                      |
| ------------ | ------- | ---------------------------- |
| `design-bug` | #EC4899 | Elke visuele afwijking       |
| `responsive` | #3B82F6 | Breakpoint-specifieke issues |
| `typography` | #8B5CF6 | Font/tekst afwijkingen       |
| `spacing`    | #F59E0B | Margin/padding issues        |
| `color`      | #EF4444 | Kleur afwijkingen            |

---

## Quick Start Checklist

Bij elke nieuwe feature of pagina:

1. [ ] Open Figma design en implementatie naast elkaar
2. [ ] Check design tokens (kleuren, fonts, spacing)
3. [ ] Verifieer component mapping (juiste variant?)
4. [ ] Test op 3 breakpoints: mobile (375px), tablet (768px), desktop (1280px)
5. [ ] Maak screenshots van afwijkingen
6. [ ] Rapporteer via Plane met het bug template
