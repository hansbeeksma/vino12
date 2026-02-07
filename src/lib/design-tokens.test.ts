import { describe, it, expect } from "vitest";
import {
  colors,
  typography,
  spacing,
  brutal,
  grid,
  animation,
  breakpoints,
  textStyles,
} from "./design-tokens";

describe("design-tokens", () => {
  describe("colors", () => {
    it("has wine palette with all shades", () => {
      expect(colors.wine.DEFAULT).toBe("#722F37");
      expect(colors.wine[50]).toBe("#FAF0F1");
      expect(colors.wine[500]).toBe("#722F37");
      expect(colors.wine[950]).toBe("#140709");
    });

    it("has burgundy secondary color", () => {
      expect(colors.burgundy.DEFAULT).toBe("#660033");
    });

    it("has champagne accent color", () => {
      expect(colors.champagne.DEFAULT).toBe("#F7E6CA");
    });

    it("has neutral colors", () => {
      expect(colors.offwhite).toBe("#FAFAF5");
      expect(colors.ink).toBe("#000000");
      expect(colors.emerald).toBe("#00674F");
    });

    it("has semantic colors", () => {
      expect(colors.success).toBeDefined();
      expect(colors.error).toBeDefined();
      expect(colors.warning).toBeDefined();
      expect(colors.info).toBeDefined();
    });

    it("wine shades get progressively darker", () => {
      const shades = [
        50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
      ] as const;
      for (let i = 0; i < shades.length; i++) {
        expect(colors.wine[shades[i]]).toBeDefined();
      }
    });
  });

  describe("typography", () => {
    it("has three font families", () => {
      expect(typography.fontFamily.display[0]).toBe("IBM Plex Mono");
      expect(typography.fontFamily.body[0]).toBe("Darker Grotesque");
      expect(typography.fontFamily.accent[0]).toBe("Space Mono");
    });

    it("has Major Third (1.25) type scale", () => {
      expect(typography.fontSize.md).toBe("1rem");
      expect(typography.fontSize.xs).toBeDefined();
      expect(typography.fontSize["5xl"]).toBeDefined();
    });

    it("has font weights from light to black", () => {
      expect(typography.fontWeight.light).toBe("300");
      expect(typography.fontWeight.black).toBe("900");
    });
  });

  describe("brutal tokens", () => {
    it("has zero border-radius (neo-brutalist)", () => {
      expect(brutal.borderRadius).toBe("0px");
    });

    it("has offset shadows", () => {
      expect(brutal.shadow.DEFAULT).toContain("4px 4px");
      expect(brutal.shadow.lg).toContain("6px 6px");
    });

    it("has wine-colored shadow option", () => {
      expect(brutal.shadow.wine).toContain("#722F37");
    });

    it("has border widths", () => {
      expect(brutal.borderWidth.DEFAULT).toBe("4px");
      expect(brutal.borderWidth.lg).toBe("6px");
      expect(brutal.borderWidth.sm).toBe("2px");
    });
  });

  describe("grid", () => {
    it("has responsive column counts", () => {
      expect(grid.columns.mobile).toBe(4);
      expect(grid.columns.tablet).toBe(8);
      expect(grid.columns.desktop).toBe(12);
    });

    it("has max width of 1280px", () => {
      expect(grid.maxWidth).toBe("80rem");
    });
  });

  describe("animation", () => {
    it("has brutalist steps(1) easing", () => {
      expect(animation.easing.brutal).toBe("steps(1)");
    });

    it("has instant duration option", () => {
      expect(animation.duration.instant).toBe("0ms");
    });
  });

  describe("breakpoints", () => {
    it("has standard responsive breakpoints", () => {
      expect(breakpoints.sm).toBe("640px");
      expect(breakpoints.md).toBe("768px");
      expect(breakpoints.lg).toBe("1024px");
      expect(breakpoints.xl).toBe("1280px");
    });
  });

  describe("textStyles", () => {
    it("has display-hero style with clamp sizing", () => {
      expect(textStyles["display-hero"].fontSize).toContain("clamp");
      expect(textStyles["display-hero"].fontFamily).toEqual(
        typography.fontFamily.display,
      );
    });

    it("has label style with uppercase transform", () => {
      expect(textStyles.label.textTransform).toBe("uppercase");
      expect(textStyles.label.letterSpacing).toBe(
        typography.letterSpacing.widest,
      );
    });

    it("has price style using display font", () => {
      expect(textStyles.price.fontFamily).toEqual(
        typography.fontFamily.display,
      );
      expect(textStyles.price.fontWeight).toBe(typography.fontWeight.bold);
    });

    it("body styles use body font family", () => {
      expect(textStyles["body-lg"].fontFamily).toEqual(
        typography.fontFamily.body,
      );
      expect(textStyles["body-md"].fontFamily).toEqual(
        typography.fontFamily.body,
      );
      expect(textStyles["body-sm"].fontFamily).toEqual(
        typography.fontFamily.body,
      );
    });
  });

  describe("spacing", () => {
    it("uses 8px base grid", () => {
      expect(spacing[2]).toBe("0.5rem");
    });

    it("has pixel value", () => {
      expect(spacing.px).toBe("1px");
    });

    it("has zero value", () => {
      expect(spacing[0]).toBe("0");
    });
  });
});
