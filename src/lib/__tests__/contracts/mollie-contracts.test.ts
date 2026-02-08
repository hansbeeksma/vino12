import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * Contract schemas for Mollie API responses.
 *
 * These schemas define the expected shape of Mollie API responses.
 * If Mollie changes their API, these tests will catch it.
 *
 * Run with MOLLIE_API_KEY=test_... to validate against live test API.
 */

const hasMollieKey = !!process.env.MOLLIE_API_KEY;
const describeIf = hasMollieKey ? describe : describe.skip;

// -- Mollie Response Schemas --

export const MollieAmountSchema = z.object({
  value: z.string(),
  currency: z.string(),
});

export const MolliePaymentSchema = z.object({
  resource: z.literal("payment"),
  id: z.string().startsWith("tr_"),
  mode: z.enum(["live", "test"]),
  status: z.enum([
    "open",
    "canceled",
    "pending",
    "authorized",
    "expired",
    "failed",
    "paid",
  ]),
  amount: MollieAmountSchema,
  description: z.string(),
  redirectUrl: z.string().url().optional().nullable(),
  createdAt: z.string(),
  _links: z.object({
    self: z.object({ href: z.string().url() }),
    checkout: z.object({ href: z.string().url() }).optional().nullable(),
    dashboard: z.object({ href: z.string().url() }).optional(),
  }),
});

export const MollieRefundSchema = z.object({
  resource: z.literal("refund"),
  id: z.string().startsWith("re_"),
  amount: MollieAmountSchema,
  status: z.enum(["queued", "pending", "processing", "refunded", "failed"]),
  createdAt: z.string(),
});

// -- Schema validation tests (offline, no API key needed) --

describe("Mollie Contract Schemas — Offline Validation", () => {
  it("MolliePaymentSchema accepts valid payment", () => {
    const validPayment = {
      resource: "payment",
      id: "tr_test123",
      mode: "test",
      status: "open",
      amount: { value: "10.00", currency: "EUR" },
      description: "Test payment",
      redirectUrl: "https://example.com/return",
      createdAt: "2026-02-08T12:00:00+00:00",
      _links: {
        self: { href: "https://api.mollie.com/v2/payments/tr_test123" },
        checkout: { href: "https://www.mollie.com/checkout/test" },
      },
    };

    expect(() => MolliePaymentSchema.parse(validPayment)).not.toThrow();
  });

  it("MolliePaymentSchema rejects invalid payment (wrong id prefix)", () => {
    const invalidPayment = {
      resource: "payment",
      id: "invalid_123",
      mode: "test",
      status: "open",
      amount: { value: "10.00", currency: "EUR" },
      description: "Test",
      createdAt: "2026-02-08T12:00:00+00:00",
      _links: {
        self: { href: "https://api.mollie.com/v2/payments/invalid_123" },
      },
    };

    expect(() => MolliePaymentSchema.parse(invalidPayment)).toThrow();
  });

  it("MolliePaymentSchema rejects invalid status", () => {
    const invalidPayment = {
      resource: "payment",
      id: "tr_test123",
      mode: "test",
      status: "unknown_status",
      amount: { value: "10.00", currency: "EUR" },
      description: "Test",
      createdAt: "2026-02-08T12:00:00+00:00",
      _links: {
        self: { href: "https://api.mollie.com/v2/payments/tr_test123" },
      },
    };

    expect(() => MolliePaymentSchema.parse(invalidPayment)).toThrow();
  });

  it("MollieRefundSchema accepts valid refund", () => {
    const validRefund = {
      resource: "refund",
      id: "re_test456",
      amount: { value: "5.00", currency: "EUR" },
      status: "pending",
      createdAt: "2026-02-08T12:00:00+00:00",
    };

    expect(() => MollieRefundSchema.parse(validRefund)).not.toThrow();
  });
});

// -- Live API contract tests (require MOLLIE_API_KEY) --

describeIf("Mollie Contract — Live API Validation", () => {
  it("create payment matches contract schema", async () => {
    const createMollieClient = (await import("@mollie/api-client")).default;
    const client = createMollieClient({
      apiKey: process.env.MOLLIE_API_KEY!,
    });

    const payment = await client.payments.create({
      amount: { value: "10.00", currency: "EUR" },
      description: "Contract test payment",
      redirectUrl: "https://example.com/return",
    });

    const result = MolliePaymentSchema.safeParse(payment);
    if (!result.success) {
      console.error("Schema mismatch:", result.error.format());
    }
    expect(result.success).toBe(true);

    // Cleanup: cancel the test payment
    try {
      await client.payments.cancel(payment.id);
    } catch {
      // Test payments may not be cancellable
    }
  });
});
