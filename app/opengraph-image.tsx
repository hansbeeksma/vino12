import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vino12 — 6 Rood. 6 Wit. Perfecte Balans.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Top wine color bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#722F37",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 140,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.03em",
            }}
          >
            VINO
          </span>
          <span
            style={{
              fontSize: 140,
              fontWeight: 800,
              color: "#722F37",
              letterSpacing: "-0.03em",
            }}
          >
            12
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#000000",
            marginBottom: 16,
            letterSpacing: "0.05em",
          }}
        >
          6 ROOD. 6 WIT. PERFECTE BALANS.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(0,0,0,0.5)",
            letterSpacing: "0.1em",
          }}
        >
          12 PREMIUM WIJNEN · €175 PER BOX · GRATIS VERZENDING
        </div>

        {/* Bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#000000",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
