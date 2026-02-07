/**
 * VINO12 Design Tokens
 *
 * Single source of truth voor alle design decisions.
 * Neo-brutalist wine e-commerce identity.
 *
 * Gebaseerd op:
 * - Notebook B: Gulden Snede, chiaroscuro, serif+sans-serif
 * - Existing codebase: brutalist aesthetic
 * - Type scale ratio: 1.25 (Major Third)
 */

// ─── Color Tokens ───────────────────────────────────────────────

export const colors = {
  // Primary - Wine palette
  wine: {
    DEFAULT: "#722F37",
    50: "#FAF0F1",
    100: "#F0D4D7",
    200: "#D9A0A7",
    300: "#C16D77",
    400: "#A94A56",
    500: "#722F37",
    600: "#5E262E",
    700: "#4A1E24",
    800: "#36151B",
    900: "#220D11",
    950: "#140709",
  },

  // Secondary
  burgundy: {
    DEFAULT: "#660033",
    light: "#8C1A57",
    dark: "#400020",
  },

  // Accent
  champagne: {
    DEFAULT: "#F7E6CA",
    light: "#FBF2E3",
    dark: "#E8CFA3",
  },

  // Neutrals
  offwhite: "#FAFAF5",
  ink: "#000000",
  emerald: "#00674F",

  // Semantic
  success: "#00674F",
  error: "#C41E3A",
  warning: "#E89B00",
  info: "#2563EB",
} as const;

// ─── Typography Tokens ──────────────────────────────────────────

/**
 * Type scale: Major Third (1.25)
 * Base: 16px
 *
 * Notebook B: "Serif voor traditie, Sans-Serif voor moderniteit"
 * VINO12: Mono voor brutalist edge, Grotesque voor readability
 */
export const typography = {
  fontFamily: {
    display: ["IBM Plex Mono", "monospace"],
    body: ["Darker Grotesque", "sans-serif"],
    accent: ["Space Mono", "monospace"],
  },

  // Major Third scale (1.25 ratio)
  // 10 / 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61
  fontSize: {
    xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    base: "0.875rem", // 14px
    md: "1rem", // 16px (base)
    lg: "1.25rem", // 20px
    xl: "1.563rem", // 25px
    "2xl": "1.953rem", // 31px
    "3xl": "2.441rem", // 39px
    "4xl": "3.052rem", // 49px
    "5xl": "3.815rem", // 61px
  },

  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  lineHeight: {
    tight: "0.9",
    snug: "0.95",
    normal: "1.1",
    relaxed: "1.4",
    loose: "1.6",
  },

  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// ─── Spacing Tokens ─────────────────────────────────────────────

/**
 * 8px base grid system
 * Notebook B: "Brede marges voor exclusiviteit en rust"
 */
export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px  (base)
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
} as const;

// ─── Brutal Tokens ──────────────────────────────────────────────

/**
 * Neo-brutalist specific tokens
 * Sharp edges, thick borders, offset shadows
 */
export const brutal = {
  borderWidth: {
    DEFAULT: "4px",
    lg: "6px",
    sm: "2px",
  },

  shadow: {
    DEFAULT: "4px 4px 0px rgba(0,0,0,0.8)",
    lg: "6px 6px 0px rgba(0,0,0,0.8)",
    wine: "4px 4px 0px #722F37",
    champagne: "4px 4px 0px #F7E6CA",
    none: "none",
  },

  // Hover: translate + remove shadow
  hover: {
    translate: "4px",
    transition: "none",
  },

  // No border-radius ever
  borderRadius: "0px",
} as const;

// ─── Grid Tokens ────────────────────────────────────────────────

/**
 * Notebook B: "Hiërarchisch grid homepage, Modulair grid shop"
 */
export const grid = {
  maxWidth: "80rem", // 1280px
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gutter: {
    mobile: "1rem", // 16px
    tablet: "1.5rem", // 24px
    desktop: "2rem", // 32px
  },
  margin: {
    mobile: "1rem",
    tablet: "2rem",
    desktop: "4rem",
  },
} as const;

// ─── Animation Tokens ───────────────────────────────────────────

export const animation = {
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    slow: "400ms",
  },
  easing: {
    // Brutalist: no easing, instant state changes
    brutal: "steps(1)",
    // Smooth when needed (marquee, carousel)
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
  },
} as const;

// ─── Breakpoints ────────────────────────────────────────────────

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ─── Composite Tokens ───────────────────────────────────────────

/** Semantic text styles combining multiple tokens */
export const textStyles = {
  "display-hero": {
    fontFamily: typography.fontFamily.display,
    fontSize: "clamp(3.5rem, 10vw, 14rem)",
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
    fontWeight: typography.fontWeight.bold,
  },
  "display-lg": {
    fontFamily: typography.fontFamily.display,
    fontSize: "clamp(2rem, 5vw, 6rem)",
    lineHeight: typography.lineHeight.snug,
    letterSpacing: typography.letterSpacing.tight,
    fontWeight: typography.fontWeight.bold,
  },
  "display-md": {
    fontFamily: typography.fontFamily.display,
    fontSize: "clamp(1.5rem, 3vw, 3.5rem)",
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.tight,
    fontWeight: typography.fontWeight.bold,
  },
  "heading-lg": {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize["3xl"],
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.bold,
  },
  "heading-md": {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize["2xl"],
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.bold,
  },
  "heading-sm": {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semibold,
  },
  "body-lg": {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.regular,
  },
  "body-md": {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.regular,
  },
  "body-sm": {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.regular,
  },
  label: {
    fontFamily: typography.fontFamily.accent,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.widest,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase" as const,
  },
  price: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize["2xl"],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
  },
} as const;
