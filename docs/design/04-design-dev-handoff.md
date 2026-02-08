---
project: "VINO12"
version: "1.0.0"
last_updated: "2026-02-08"
maturity: "foundation"
status: "draft"
owner: "Sam Swaab"
figma_url: ""
storybook_url: ""
design_tokens_path: "src/lib/design-tokens.ts"
---

# VINO12 Design-to-Dev Handoff

> Token sync, component status, and QA workflow

---

## Token Sync Workflow

### Source of Truth

| Layer       | Source                | Format     | Location                   |
| ----------- | --------------------- | ---------- | -------------------------- |
| Definition  | `design-tokens.ts`    | TypeScript | `src/lib/design-tokens.ts` |
| Integration | `tailwind.config.ts`  | Config     | Root                       |
| Runtime     | CSS Custom Properties | CSS        | `src/app/globals.css`      |

### Sync Process

```
1. Update design-tokens.ts (single source of truth)
2. Tailwind config imports from design-tokens.ts
3. globals.css references Tailwind utilities
4. Components use Tailwind classes or CSS variables
5. Run visual regression check
```

### Token Naming Convention

```
TypeScript: colors.wine[500], typography.fontSize.lg
Tailwind:   text-wine-500, text-lg, font-display
CSS:        var(--wine-500), var(--font-size-lg)
```

---

## Component Status Tracker

### P0: Production Ready

| Component       | Design | Dev  | Tests  |  Docs  |  A11y   |
| --------------- | :----: | :--: | :----: | :----: | :-----: |
| BrutalButton    |  Done  | Done | Needed | Needed | Partial |
| BrutalCard      |  Done  | Done | Needed | Needed | Partial |
| BrutalBadge     |  Done  | Done | Needed | Needed | Partial |
| WineCard        |  Done  | Done | Needed | Needed | Partial |
| Header          |  Done  | Done | Needed | Needed | Partial |
| Footer          |  Done  | Done | Needed | Needed | Partial |
| AgeGate         |  Done  | Done | Needed | Needed | Partial |
| CookieConsent   |  Done  | Done | Needed | Needed | Partial |
| AddToCartButton |  Done  | Done | Needed | Needed | Partial |
| CartDrawer      |  Done  | Done | Needed | Needed | Partial |
| HeroSection     |  Done  | Done | Needed | Needed | Partial |

### P1: Needs Improvement

| Component       | Design  | Dev  |   Tests   |  Docs  |  A11y  | Issue            |
| --------------- | :-----: | :--: | :-------: | :----: | :----: | ---------------- |
| SearchBar       | Partial | Done |  Needed   | Needed | Needed | Combobox pattern |
| ReviewForm      | Partial | Done | Has tests | Needed | Needed | Validation a11y  |
| StoriesCarousel | Partial | Done |  Needed   | Needed | Needed | Carousel a11y    |
| WineCarousel    | Partial | Done |  Needed   | Needed | Needed | Carousel a11y    |

### P2: Alpha / Experimental

| Component                        | Notes                                 |
| -------------------------------- | ------------------------------------- |
| WineBottle3D, WineBottleShowcase | Three.js, needs fallback images       |
| ARSceneViewer, ARWineOverlay     | AR features, needs camera permissions |
| WineScanner, ScanResult          | Computer vision, needs fallback       |
| VoiceCommand\*                   | Voice UI, needs mic permissions       |
| PhysicsPlayground                | Experimental effect                   |

---

## Design QA Checklist

Before marking any component as "production ready":

### Visual

- [ ] Matches design spec (brutal borders: 4px #000)
- [ ] Uses design tokens (no hardcoded colors/spacing)
- [ ] Border radius is 0px
- [ ] Shadows use brutal offset pattern
- [ ] Typography uses correct font family + weight

### States

- [ ] Default state
- [ ] Hover: translate(4px, 4px) + shadow: none (instant)
- [ ] Active: translate + bg darken
- [ ] Focus: 4px wine-500 outline
- [ ] Disabled: reduced opacity, no interaction
- [ ] Loading: `aria-busy`, spinner or skeleton
- [ ] Error: error color + icon + text

### Responsive

- [ ] Mobile (< 640px): single column, touch-friendly
- [ ] Tablet (640-1024px): 2 column grid
- [ ] Desktop (1024px+): full grid, max-width 1280px
- [ ] Content doesn't overflow at 320px

### Accessibility

- [ ] Keyboard navigable (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader announces correctly
- [ ] Contrast ratios meet WCAG AA
- [ ] Focus visible on all interactive elements
- [ ] `prefers-reduced-motion` respected

### Code

- [ ] Uses existing design tokens from `design-tokens.ts`
- [ ] No `!important` overrides (except border-radius: 0)
- [ ] No inline styles
- [ ] Component props are typed

---

## Figma-to-Code Mapping

### Brutal Components

| Design Element   | Code                                                        |
| ---------------- | ----------------------------------------------------------- |
| 4px black border | `border-4 border-ink` or `brutal-border` class              |
| Offset shadow    | `shadow-brutal` (4px 4px 0 rgba(0,0,0,0.8))                 |
| Wine shadow      | `shadow-brutal-wine` (4px 4px 0 #722F37)                    |
| No radius        | `rounded-none` (global default)                             |
| Hover translate  | `hover:translate-x-1 hover:translate-y-1 hover:shadow-none` |

### Typography Mapping

| Design            | Code                                                      |
| ----------------- | --------------------------------------------------------- |
| Display hero text | `font-display text-[clamp(3.5rem,10vw,14rem)] font-bold`  |
| Section heading   | `font-display text-3xl font-bold`                         |
| Body text         | `font-body text-md`                                       |
| Label / badge     | `font-accent text-sm font-bold uppercase tracking-widest` |
| Price             | `font-display text-2xl font-bold`                         |

### Color Mapping

| Design         | Code                            |
| -------------- | ------------------------------- |
| Primary wine   | `text-wine-500` / `bg-wine-500` |
| Background     | `bg-offwhite`                   |
| Text           | `text-ink`                      |
| Secondary bg   | `bg-champagne`                  |
| Premium accent | `bg-burgundy`                   |
| Success        | `text-emerald`                  |

---

_Template: ~/Development/shared/communicating-design/templates/04-design-dev-handoff.md_
