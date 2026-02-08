import { describe, it, expect } from "vitest";
import {
  generatePassportQR,
  generatePassportQRSvg,
  getVerificationUrl,
} from "./qr";

describe("getVerificationUrl", () => {
  it("builds correct URL", () => {
    const url = getVerificationUrl("wine-123", "https://vino12.nl");
    expect(url).toBe("https://vino12.nl/verificatie/wine-123");
  });

  it("handles different base URLs", () => {
    const url = getVerificationUrl("abc", "http://localhost:3000");
    expect(url).toBe("http://localhost:3000/verificatie/abc");
  });
});

describe("generatePassportQR", () => {
  it("returns data URL", async () => {
    const dataUrl = await generatePassportQR("wine-123", "https://vino12.nl");
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
});

describe("generatePassportQRSvg", () => {
  it("returns SVG string", async () => {
    const svg = await generatePassportQRSvg("wine-123", "https://vino12.nl");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });
});
