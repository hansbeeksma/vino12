---
project: "VINO12"
version: "1.0.0"
last_updated: "2026-02-08"
maturity: "foundation"
status: "draft"
owner: "Sam Swaab"
wcag_target: "AA"
wcag_version: "2.2"
---

# VINO12 Accessibility

> WCAG 2.2 Level AA Compliance — Neo-Brutalist Wine E-Commerce

---

## Accessibility Statement

VINO12 streeft naar digitale toegankelijkheid voor alle gebruikers. We conformeren aan WCAG 2.2 Level AA. Het neo-brutalist design biedt van nature hoge contrastverhoudingen en duidelijke visuele grenzen.

### Conformance Target

| Standard   | Target              | Status      |
| ---------- | ------------------- | ----------- |
| WCAG 2.2   | Level AA            | In Progress |
| EN 301 549 | Applicable sections | Planned     |

---

## Color & Contrast

### Bestaande Contrast Ratios

De neo-brutalist palette scoort hoog op contrast:

| Combinatie                                    | Ratio  | AA (4.5:1) | AAA (7:1) |
| --------------------------------------------- | ------ | ---------- | --------- |
| `ink (#000)` op `offwhite (#FAFAF5)`          | 16.8:1 | Pass       | Pass      |
| `wine-500 (#722F37)` op `offwhite (#FAFAF5)`  | 7.2:1  | Pass       | Pass      |
| `offwhite (#FAFAF5)` op `wine-500 (#722F37)`  | 7.2:1  | Pass       | Pass      |
| `ink (#000)` op `champagne (#F7E6CA)`         | 13.1:1 | Pass       | Pass      |
| `wine-500 (#722F37)` op `champagne (#F7E6CA)` | 5.6:1  | Pass       | Fail      |
| `emerald (#00674F)` op `offwhite (#FAFAF5)`   | 5.8:1  | Pass       | Fail      |

### Non-text Contrast (WCAG 1.4.11)

| UI Element               | Color      | Background | Ratio  | Pass (3:1) |
| ------------------------ | ---------- | ---------- | ------ | ---------- |
| Brutal border (4px #000) | `ink`      | `offwhite` | 16.8:1 | Pass       |
| BrutalButton border      | `ink`      | `offwhite` | 16.8:1 | Pass       |
| Focus ring               | `wine-500` | `offwhite` | 7.2:1  | Pass       |
| Form field border        | `ink`      | `offwhite` | 16.8:1 | Pass       |

### Color Independence

- Wine type indicators use LABEL TEXT + color (not color alone)
- Stock status uses text ("Op voorraad" / "Uitverkocht") + icon + color
- Error states use icon + border + text + color
- Rating uses numeric score + star icons + color

---

## Keyboard Navigation

### Focus Style

```css
/* Brutalist focus: thick, visible, high contrast */
:focus-visible {
  outline: 4px solid #722f37;
  outline-offset: 2px;
}
```

The 4px wine-colored outline matches the brutal aesthetic while being highly visible.

### Key Flows

| Flow               | Tab Stops                                               | Notes                                  |
| ------------------ | ------------------------------------------------------- | -------------------------------------- |
| Homepage → Product | Skip link → Header nav → Hero CTA → Wine cards → Footer | Cards are single tab stop, Enter opens |
| Product Detail     | Back → Image → Name → Add to cart → Reviews → Related   | Price not focusable (decorative)       |
| Checkout           | Cart summary → Address form → Payment → Place order     | Linear, no branches                    |
| Age Gate           | Heading → Yes button → No button                        | Traps focus until answered             |

### Skip Navigation

```html
<a href="#main-content" class="skip-link"> Ga naar inhoud </a>
```

- First tab stop on every page
- Visible on focus (hidden otherwise)
- Skips header navigation

### Modal/Drawer Behavior

| Component     | Focus Trap          | Escape Close   | Return Focus   |
| ------------- | ------------------- | -------------- | -------------- |
| CartDrawer    | Yes                 | Yes            | CartButton     |
| AgeGate       | Yes                 | No (mandatory) | N/A            |
| CookieConsent | No (banner)         | No             | N/A            |
| SearchBar     | Yes (when expanded) | Yes            | Search trigger |

---

## Semantic HTML

### Page Landmarks

```html
<body>
  <a href="#main" class="skip-link">Ga naar inhoud</a>
  <header role="banner">        <!-- Header component -->
    <nav aria-label="Hoofdnavigatie">
  </header>
  <main id="main">              <!-- Page content -->
  <aside>                        <!-- CartDrawer -->
  <footer role="contentinfo">    <!-- Footer component -->
</body>
```

### Heading Hierarchy

| Level | Usage                                              |
| ----- | -------------------------------------------------- |
| `h1`  | Page title (1 per page)                            |
| `h2`  | Section titles (HeroSection, CollectionGrid, etc.) |
| `h3`  | Subsections (individual wine cards, form sections) |
| `h4`  | Detail headings (review titles, pairing sections)  |

---

## Component Accessibility

### BrutalButton

| Requirement | Implementation                                |
| ----------- | --------------------------------------------- |
| Role        | Native `<button>` element                     |
| Focus       | 4px wine-500 outline                          |
| Disabled    | `aria-disabled="true"`, reduced opacity       |
| Loading     | `aria-busy="true"`, spinner + "Laden..." text |
| Icon-only   | `aria-label` required                         |

### WineCard

| Requirement | Implementation                               |
| ----------- | -------------------------------------------- |
| Role        | `<article>` with heading                     |
| Link        | Entire card is clickable (single anchor)     |
| Image       | `alt="{{wine name}} fles"`                   |
| Price       | `aria-label="Prijs: {{price}} euro"`         |
| Rating      | `aria-label="Beoordeling: {{score}} van 5"`  |
| Stock       | `aria-label="Op voorraad"` / `"Uitverkocht"` |

### CartDrawer

| Requirement | Implementation                            |
| ----------- | ----------------------------------------- |
| Role        | `role="dialog"`, `aria-modal="true"`      |
| Label       | `aria-labelledby="cart-title"`            |
| Focus trap  | Tab cycles within drawer                  |
| Close       | Escape key, X button, overlay click       |
| Quantity    | Input with `aria-label="Aantal {{wine}}"` |

### AgeGate

| Requirement | Implementation                         |
| ----------- | -------------------------------------- |
| Role        | `role="alertdialog"`                   |
| Focus trap  | Mandatory, no escape                   |
| Label       | `aria-labelledby="age-gate-title"`     |
| Buttons     | Clear labels: "Ja, ik ben 18+" / "Nee" |

### StarRating

| Requirement | Implementation                                   |
| ----------- | ------------------------------------------------ |
| Role        | `role="group"`, `aria-label="Beoordeling"`       |
| Stars       | `role="radio"`, `aria-checked`                   |
| Read-only   | `role="img"`, `aria-label="{{n}} van 5 sterren"` |

---

## Forms

### Checkout Form

- [ ] Every input has visible `<label>`
- [ ] Required fields marked with "(verplicht)" text
- [ ] Error messages linked via `aria-describedby`
- [ ] Address autocomplete: `autocomplete="street-address"`, etc.
- [ ] Payment method: `<fieldset>` + `<legend>`

### Review Form

- [ ] Star rating keyboard accessible (arrow keys)
- [ ] Text area with `<label>` and character count
- [ ] Submit button states (disabled → loading → success/error)

### Search

- [ ] `role="search"` on form
- [ ] `aria-expanded` on results dropdown
- [ ] `aria-activedescendant` for result navigation
- [ ] Escape clears and closes

---

## Images & Media

### Wine Images

| Context       | Alt Text Pattern                           | Example                                |
| ------------- | ------------------------------------------ | -------------------------------------- |
| Product grid  | `"{{Naam}} — {{type}} wijn uit {{regio}}"` | "Barolo 2019 — rode wijn uit Piemonte" |
| Hero          | `"{{Beschrijving van scene}}"`             | "Donkere fles tegen dramatisch licht"  |
| Decorative bg | `alt=""`                                   | Gradient, mesh backgrounds             |

### 3D/AR Content

| Component     | Fallback                          |
| ------------- | --------------------------------- |
| WineBottle3D  | Static image with `alt` text      |
| ARSceneViewer | Photo of wine label               |
| WineParticles | `aria-hidden="true"` (decorative) |

---

## Testing Protocol

### Automated

| Tool                   | Integration      | Runs       |
| ---------------------- | ---------------- | ---------- |
| axe-core               | Playwright tests | Per PR     |
| eslint-plugin-jsx-a11y | ESLint config    | On save    |
| Lighthouse a11y        | CI pipeline      | Per deploy |

### Manual Testing Checklist

Per release:

- [ ] Full keyboard navigation (Tab through all pages)
- [ ] VoiceOver + Safari (macOS) — primary flow
- [ ] Zoom 200% — all content accessible
- [ ] Reduced motion — animations disabled
- [ ] High contrast mode — content readable
- [ ] Mobile screen reader (VoiceOver iOS) — primary flow

### Screen Reader Announcements

| Action           | Expected Announcement                      |
| ---------------- | ------------------------------------------ |
| Add to cart      | "{{Wijn}} toegevoegd aan winkelwagen"      |
| Remove from cart | "{{Wijn}} verwijderd uit winkelwagen"      |
| Age gate passed  | "Leeftijdsverificatie geslaagd"            |
| Checkout success | "Bestelling geplaatst. Ordernummer {{nr}}" |
| Search results   | "{{n}} resultaten gevonden voor {{query}}" |

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all brutal transitions */
  * {
    transition: none !important;
  }

  /* Disable particle effects */
  .wine-particles,
  .cursor-trail,
  .celebration-burst {
    display: none;
  }

  /* Disable marquee */
  .marquee-strip {
    animation: none;
  }

  /* Disable 3D */
  .wine-bottle-3d {
    display: none;
  }
  .wine-bottle-3d-fallback {
    display: block;
  }
}
```

---

_Template: ~/Development/shared/communicating-design/templates/07-accessibility.md_
_Audit checklist: ~/Development/shared/communicating-design/checklists/accessibility-audit.md_
