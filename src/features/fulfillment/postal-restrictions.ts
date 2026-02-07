/**
 * Postal code restrictions for wine delivery in the Netherlands.
 *
 * Some areas have delivery restrictions due to:
 * - Waddeneilanden (higher shipping costs, longer delivery times)
 * - BES-eilanden (Bonaire, Sint Eustatius, Saba - no alcohol delivery)
 * - Restricted areas (military zones, etc.)
 */

// BES islands postal codes (Caribbean Netherlands - no alcohol delivery)
const BLOCKED_POSTAL_PREFIXES: string[] = [
  // No NL postal codes are fully blocked, but BES islands
  // use different postal systems (not 4-digit + 2-letter)
];

// Waddeneilanden - delivery possible but with surcharge
const SURCHARGE_POSTAL_RANGES: {
  from: number;
  to: number;
  label: string;
  surchargeCents: number;
}[] = [
  { from: 8880, to: 8899, label: "Terschelling", surchargeCents: 750 },
  { from: 8900, to: 8909, label: "Leeuwarden regio", surchargeCents: 0 },
  { from: 9160, to: 9169, label: "Schiermonnikoog", surchargeCents: 750 },
  { from: 9161, to: 9166, label: "Schiermonnikoog", surchargeCents: 750 },
  { from: 8890, to: 8899, label: "Vlieland", surchargeCents: 750 },
  { from: 1790, to: 1799, label: "Texel", surchargeCents: 500 },
  { from: 9160, to: 9170, label: "Schiermonnikoog", surchargeCents: 750 },
];

// Known areas with no delivery by major carriers
const NO_DELIVERY_POSTCODES = new Set<string>([
  // Empty for now - add specific postcodes if needed
]);

export interface PostalCodeCheck {
  allowed: boolean;
  reason?: string;
  surchargeCents: number;
  area?: string;
}

export function checkPostalCode(postalCode: string): PostalCodeCheck {
  // Normalize: remove spaces, uppercase
  const normalized = postalCode.replace(/\s/g, "").toUpperCase();

  // Validate format (4 digits + 2 letters)
  if (!/^\d{4}[A-Z]{2}$/.test(normalized)) {
    return {
      allowed: false,
      reason: "Ongeldig postcodenummer. Gebruik formaat: 1234 AB",
      surchargeCents: 0,
    };
  }

  const numericPart = parseInt(normalized.substring(0, 4), 10);

  // Check blocked prefixes
  for (const prefix of BLOCKED_POSTAL_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      return {
        allowed: false,
        reason: "Bezorging naar dit gebied is niet mogelijk",
        surchargeCents: 0,
      };
    }
  }

  // Check no-delivery postcodes
  if (NO_DELIVERY_POSTCODES.has(normalized)) {
    return {
      allowed: false,
      reason: "Bezorging naar dit adres is helaas niet beschikbaar",
      surchargeCents: 0,
    };
  }

  // Check surcharge areas
  for (const range of SURCHARGE_POSTAL_RANGES) {
    if (numericPart >= range.from && numericPart <= range.to) {
      return {
        allowed: true,
        surchargeCents: range.surchargeCents,
        area: range.label,
        reason:
          range.surchargeCents > 0
            ? `Eilandtoeslag: €${(range.surchargeCents / 100).toFixed(2).replace(".", ",")}`
            : undefined,
      };
    }
  }

  // Standard delivery
  return {
    allowed: true,
    surchargeCents: 0,
  };
}

/**
 * Check if postal code is valid for checkout.
 * Returns error message if not allowed, null if OK.
 */
export function validateDeliveryPostalCode(postalCode: string): string | null {
  const check = checkPostalCode(postalCode);
  if (!check.allowed) {
    return check.reason ?? "Bezorging niet mogelijk";
  }
  return null;
}
