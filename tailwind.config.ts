import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: "#722F37",
        burgundy: "#660033",
        emerald: "#00674F",
        champagne: "#F7E6CA",
        offwhite: "#FAFAF5",
        ink: "#000000",
      },
      fontFamily: {
        display: ["var(--font-display)", '"IBM Plex Mono"', "monospace"],
        body: ["var(--font-body)", '"Darker Grotesque"', "sans-serif"],
        accent: ["var(--font-accent)", '"Space Mono"', "monospace"],
      },
      fontSize: {
        "display-hero": [
          "clamp(3.5rem, 10vw, 14rem)",
          { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 6rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 3.5rem)",
          { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" },
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
    },
  },
  plugins: [],
};
export default config;
