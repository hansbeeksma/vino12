import { describe, it, expect, vi } from "vitest";
import { FulfillmentError, isFulfillmentError, withRetry } from "./errors";

describe("FulfillmentError", () => {
  it("creates error with all properties", () => {
    const error = new FulfillmentError(
      "test error",
      "SUPPLIER_UNAVAILABLE",
      "order-123",
      "supplier-abc",
      true,
    );

    expect(error.message).toBe("test error");
    expect(error.code).toBe("SUPPLIER_UNAVAILABLE");
    expect(error.orderId).toBe("order-123");
    expect(error.supplierId).toBe("supplier-abc");
    expect(error.retryable).toBe(true);
    expect(error.name).toBe("FulfillmentError");
  });

  it("defaults retryable to false", () => {
    const error = new FulfillmentError("test", "UNKNOWN");
    expect(error.retryable).toBe(false);
  });

  it("is instanceof Error", () => {
    const error = new FulfillmentError("test", "UNKNOWN");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FulfillmentError);
  });
});

describe("isFulfillmentError", () => {
  it("returns true for FulfillmentError", () => {
    const error = new FulfillmentError("test", "UNKNOWN");
    expect(isFulfillmentError(error)).toBe(true);
  });

  it("returns false for regular Error", () => {
    expect(isFulfillmentError(new Error("test"))).toBe(false);
  });

  it("returns false for non-error", () => {
    expect(isFulfillmentError("string")).toBe(false);
    expect(isFulfillmentError(null)).toBe(false);
    expect(isFulfillmentError(undefined)).toBe(false);
  });
});

describe("withRetry", () => {
  it("returns result on first success", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await withRetry(fn, { operation: "test" });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on transient failure then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValue("ok");

    const result = await withRetry(fn, { operation: "test" });

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-retryable FulfillmentError", async () => {
    const error = new FulfillmentError(
      "permanent",
      "SUPPLIER_REJECTED",
      undefined,
      undefined,
      false,
    );
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { operation: "test" })).rejects.toThrow(
      "permanent",
    );

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throws after max retries with context", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("keep failing"));

    await expect(
      withRetry(fn, { operation: "sync inventory", orderId: "ord-1" }),
    ).rejects.toThrow(/sync inventory failed after 3 attempts/);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("final error is a FulfillmentError with correct code", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    try {
      await withRetry(fn, { operation: "test" });
    } catch (error) {
      expect(isFulfillmentError(error)).toBe(true);
      if (isFulfillmentError(error)) {
        expect(error.code).toBe("FORWARDING_FAILED");
        expect(error.retryable).toBe(false);
      }
    }
  });
});
