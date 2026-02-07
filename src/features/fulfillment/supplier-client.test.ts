import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  submitOrderToSupplier,
  fetchSupplierInventory,
} from "./supplier-client";
import { FulfillmentError } from "./errors";

const mockSupplier = {
  id: "sup-1",
  code: "wineimport",
  name: "Wine Import BV",
  api_endpoint: "https://api.wineimport.test",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
};

const mockOrder = {
  order_id: "ord-123",
  items: [
    { wine_id: "w-1", supplier_sku: "WI-001", quantity: 6, price_cents: 1200 },
  ],
  shipping_address: {
    street: "Keizersgracht",
    house_number: "42",
    house_number_addition: null,
    postal_code: "1015AB",
    city: "Amsterdam",
    country: "NL",
  },
};

describe("submitOrderToSupplier", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            supplier_order_id: "WI-ORD-999",
            status: "accepted",
          }),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws SUPPLIER_UNAVAILABLE if no api_endpoint", async () => {
    const noEndpoint = { ...mockSupplier, api_endpoint: null };

    await expect(
      submitOrderToSupplier(noEndpoint as never, mockOrder),
    ).rejects.toThrow(FulfillmentError);

    try {
      await submitOrderToSupplier(noEndpoint as never, mockOrder);
    } catch (e) {
      expect((e as FulfillmentError).code).toBe("SUPPLIER_UNAVAILABLE");
      expect((e as FulfillmentError).retryable).toBe(false);
    }
  });

  it("sends POST to supplier API with correct payload", async () => {
    await submitOrderToSupplier(mockSupplier as never, mockOrder);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.wineimport.test/orders",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("returns supplier order response on success", async () => {
    const result = await submitOrderToSupplier(
      mockSupplier as never,
      mockOrder,
    );
    expect(result.supplier_order_id).toBe("WI-ORD-999");
    expect(result.status).toBe("accepted");
  });

  it("throws retryable error for 500+ status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: () => Promise.resolve("Service Unavailable"),
      }),
    );

    try {
      await submitOrderToSupplier(mockSupplier as never, mockOrder);
    } catch (e) {
      expect(e).toBeInstanceOf(FulfillmentError);
      expect((e as FulfillmentError).code).toBe("SUPPLIER_UNAVAILABLE");
      expect((e as FulfillmentError).retryable).toBe(true);
    }
  });

  it("throws non-retryable error for 4xx status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      }),
    );

    try {
      await submitOrderToSupplier(mockSupplier as never, mockOrder);
    } catch (e) {
      expect(e).toBeInstanceOf(FulfillmentError);
      expect((e as FulfillmentError).code).toBe("SUPPLIER_REJECTED");
      expect((e as FulfillmentError).retryable).toBe(false);
    }
  });
});

describe("fetchSupplierInventory", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws if no api_endpoint", async () => {
    const noEndpoint = { ...mockSupplier, api_endpoint: null };

    await expect(fetchSupplierInventory(noEndpoint as never)).rejects.toThrow(
      FulfillmentError,
    );
  });

  it("returns inventory data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              { sku: "WI-001", quantity_available: 48, price_cents: 1200 },
            ],
            synced_at: "2026-02-07T12:00:00Z",
          }),
      }),
    );

    const result = await fetchSupplierInventory(mockSupplier as never);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].sku).toBe("WI-001");
    expect(result.items[0].quantity_available).toBe(48);
  });

  it("throws SYNC_FAILED for non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Error"),
      }),
    );

    try {
      await fetchSupplierInventory(mockSupplier as never);
    } catch (e) {
      expect(e).toBeInstanceOf(FulfillmentError);
      expect((e as FulfillmentError).code).toBe("SYNC_FAILED");
    }
  });
});
