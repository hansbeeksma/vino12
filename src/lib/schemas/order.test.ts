import { describe, it, expect } from "vitest";
import { addressSchema, orderStatusSchema, paymentStatusSchema } from "./order";

describe("addressSchema", () => {
  const validAddress = {
    street: "Herengracht",
    house_number: "123",
    postal_code: "1015 BA",
    city: "Amsterdam",
  };

  it("accepts valid Dutch address", () => {
    const result = addressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("accepts postal code without space", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      postal_code: "1015BA",
    });
    expect(result.success).toBe(true);
  });

  it("defaults country to NL", () => {
    const result = addressSchema.parse(validAddress);
    expect(result.country).toBe("NL");
  });

  it("accepts house_number_addition", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      house_number_addition: "B",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty street", () => {
    const result = addressSchema.safeParse({ ...validAddress, street: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty house_number", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      house_number: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid postal code", () => {
    const invalid = ["12345", "ABCD EF", "123 AB", "12345 AB", "1234 ab"];
    for (const postal_code of invalid) {
      const result = addressSchema.safeParse({
        ...validAddress,
        postal_code,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects empty city", () => {
    const result = addressSchema.safeParse({ ...validAddress, city: "" });
    expect(result.success).toBe(false);
  });
});

describe("orderStatusSchema", () => {
  it("accepts all valid statuses", () => {
    const statuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    for (const status of statuses) {
      expect(orderStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(orderStatusSchema.safeParse("unknown").success).toBe(false);
  });
});

describe("paymentStatusSchema", () => {
  it("accepts all valid statuses", () => {
    const statuses = [
      "pending",
      "paid",
      "failed",
      "expired",
      "cancelled",
      "refunded",
      "partially_refunded",
    ];
    for (const status of statuses) {
      expect(paymentStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(paymentStatusSchema.safeParse("completed").success).toBe(false);
  });
});
