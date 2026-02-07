import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        },
        burgundy: { DEFAULT: "#660033", light: "#8C1A57", dark: "#400020" },
        emerald: "#00674F",
        champagne: { DEFAULT: "#F7E6CA", light: "#FBF2E3", dark: "#E8CFA3" },
        offwhite: "#FAFAF5",
        ink: "#000000",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"IBM Plex Mono"', "monospace"],
        body: ["var(--font-body)", '"Darker Grotesque"', "sans-serif"],
        accent: ["var(--font-accent)", '"Space Mono"', "monospace"],
      },
      fontSize: {
        "display-hero": [
          "clamp(3.5rem, 10vw, 14rem)",
          {
            lineHeight: "0.9",
            letterSpacing: "-0.04em",
            fontWeight: "700",
          },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 6rem)",
          {
            lineHeight: "0.95",
            letterSpacing: "-0.03em",
            fontWeight: "700",
          },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 3.5rem)",
          {
            lineHeight: "1",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
      },
      boxShadow: {
        brutal: "4px 4px 0px rgba(0,0,0,0.8)",
        "brutal-lg": "6px 6px 0px rgba(0,0,0,0.8)",
        "brutal-wine": "4px 4px 0px #722F37",
      },
      borderWidth: {
        brutal: "4px",
        "brutal-lg": "6px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
