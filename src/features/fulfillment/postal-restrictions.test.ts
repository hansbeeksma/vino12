import { describe, it, expect } from "vitest";
import {
  checkPostalCode,
  validateDeliveryPostalCode,
} from "./postal-restrictions";

describe("checkPostalCode", () => {
  describe("valid standard postcodes", () => {
    it("allows a regular Amsterdam postcode", () => {
      const result = checkPostalCode("1012AB");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(0);
      expect(result.area).toBeUndefined();
    });

    it("allows a regular Rotterdam postcode", () => {
      const result = checkPostalCode("3011AA");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(0);
    });

    it("handles spaces in postcode", () => {
      const result = checkPostalCode("1012 AB");
      expect(result.allowed).toBe(true);
    });

    it("handles lowercase letters", () => {
      const result = checkPostalCode("1012ab");
      expect(result.allowed).toBe(true);
    });

    it("handles mixed case with spaces", () => {
      const result = checkPostalCode("1012 Ab");
      expect(result.allowed).toBe(true);
    });
  });

  describe("invalid postcode formats", () => {
    it("rejects empty string", () => {
      const result = checkPostalCode("");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("Ongeldig");
    });

    it("rejects digits only", () => {
      const result = checkPostalCode("1012");
      expect(result.allowed).toBe(false);
    });

    it("rejects letters only", () => {
      const result = checkPostalCode("ABCD");
      expect(result.allowed).toBe(false);
    });

    it("rejects too short", () => {
      const result = checkPostalCode("101A");
      expect(result.allowed).toBe(false);
    });

    it("rejects wrong format (letters first)", () => {
      const result = checkPostalCode("AB1012");
      expect(result.allowed).toBe(false);
    });

    it("rejects special characters", () => {
      const result = checkPostalCode("1012-AB");
      expect(result.allowed).toBe(false);
    });
  });

  describe("Waddeneilanden surcharges", () => {
    it("applies surcharge for Texel (1791)", () => {
      const result = checkPostalCode("1791AA");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(500);
      expect(result.area).toBe("Texel");
      expect(result.reason).toContain("5,00");
    });

    it("applies surcharge for Terschelling (8881)", () => {
      const result = checkPostalCode("8881AB");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(750);
      expect(result.area).toBe("Terschelling");
    });

    it("applies surcharge for Vlieland range (overlaps Terschelling)", () => {
      // 8891 falls in Terschelling range (8880-8899) which is checked first
      const result = checkPostalCode("8891CD");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(750);
    });

    it("applies surcharge for Schiermonnikoog (9162)", () => {
      const result = checkPostalCode("9162EF");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(750);
      expect(result.area).toBe("Schiermonnikoog");
    });
  });

  describe("edge cases", () => {
    it("no surcharge for Leeuwarden area", () => {
      const result = checkPostalCode("8901GH");
      expect(result.allowed).toBe(true);
      expect(result.surchargeCents).toBe(0);
    });

    it("returns surcharge as 0 for standard delivery", () => {
      const result = checkPostalCode("5600AB");
      expect(result).toEqual({
        allowed: true,
        surchargeCents: 0,
      });
    });
  });
});

describe("validateDeliveryPostalCode", () => {
  it("returns null for valid standard postcode", () => {
    expect(validateDeliveryPostalCode("1012AB")).toBeNull();
  });

  it("returns null for surcharge area (still deliverable)", () => {
    expect(validateDeliveryPostalCode("1791AA")).toBeNull();
  });

  it("returns error message for invalid format", () => {
    const result = validateDeliveryPostalCode("invalid");
    expect(result).not.toBeNull();
    expect(result).toContain("Ongeldig");
  });
});
