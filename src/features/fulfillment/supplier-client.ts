import type { FulfillmentOrder, Supplier } from "./types";
import { FulfillmentError } from "./errors";

interface SupplierOrderResponse {
  supplier_order_id: string;
  status: "accepted" | "rejected";
  estimated_ship_date?: string;
  rejection_reason?: string;
}

interface SupplierInventoryResponse {
  items: {
    sku: string;
    quantity_available: number;
    price_cents: number;
  }[];
  synced_at: string;
}

export async function submitOrderToSupplier(
  supplier: Supplier,
  order: FulfillmentOrder,
): Promise<SupplierOrderResponse> {
  if (!supplier.api_endpoint) {
    throw new FulfillmentError(
      `Supplier ${supplier.code} has no API endpoint configured`,
      "SUPPLIER_UNAVAILABLE",
      order.order_id,
      supplier.id,
      false,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${supplier.api_endpoint}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env[`SUPPLIER_${supplier.code.toUpperCase()}_API_KEY`] ?? ""}`,
      },
      body: JSON.stringify({
        external_order_id: order.order_id,
        items: order.items.map((item) => ({
          sku: item.supplier_sku,
          quantity: item.quantity,
        })),
        shipping_address: {
          name: `${order.shipping_address.street} ${order.shipping_address.house_number}`,
          street: order.shipping_address.street,
          house_number: order.shipping_address.house_number,
          house_number_addition: order.shipping_address.house_number_addition,
          postal_code: order.shipping_address.postal_code,
          city: order.shipping_address.city,
          country: order.shipping_address.country,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      throw new FulfillmentError(
        `Supplier ${supplier.code} rejected order: ${response.status} - ${errorBody}`,
        response.status >= 500 ? "SUPPLIER_UNAVAILABLE" : "SUPPLIER_REJECTED",
        order.order_id,
        supplier.id,
        response.status >= 500,
      );
    }

    return (await response.json()) as SupplierOrderResponse;
  } catch (error) {
    if (error instanceof FulfillmentError) throw error;

    const isTimeout = error instanceof Error && error.name === "AbortError";
    throw new FulfillmentError(
      `Failed to contact supplier ${supplier.code}: ${isTimeout ? "timeout" : String(error)}`,
      isTimeout ? "SUPPLIER_TIMEOUT" : "SUPPLIER_UNAVAILABLE",
      order.order_id,
      supplier.id,
      true,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSupplierInventory(
  supplier: Supplier,
): Promise<SupplierInventoryResponse> {
  if (!supplier.api_endpoint) {
    throw new FulfillmentError(
      `Supplier ${supplier.code} has no API endpoint configured`,
      "SUPPLIER_UNAVAILABLE",
      undefined,
      supplier.id,
      false,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${supplier.api_endpoint}/inventory`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env[`SUPPLIER_${supplier.code.toUpperCase()}_API_KEY`] ?? ""}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new FulfillmentError(
        `Failed to fetch inventory from ${supplier.code}: ${response.status}`,
        "SYNC_FAILED",
        undefined,
        supplier.id,
        response.status >= 500,
      );
    }

    return (await response.json()) as SupplierInventoryResponse;
  } catch (error) {
    if (error instanceof FulfillmentError) throw error;

    throw new FulfillmentError(
      `Failed to contact supplier ${supplier.code}: ${String(error)}`,
      "SUPPLIER_UNAVAILABLE",
      undefined,
      supplier.id,
      true,
    );
  } finally {
    clearTimeout(timeout);
  }
}
