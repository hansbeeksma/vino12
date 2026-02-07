import { createServiceRoleClient } from "@/lib/supabase/server";
import { submitOrderToSupplier } from "./supplier-client";
import {
  getSupplierForWine,
  updateInventoryQuantity,
} from "./supplier-service";
import { FulfillmentError, withRetry } from "./errors";
import type { FulfillmentOrder, ShippingAddress } from "./types";

interface OrderWithItems {
  id: string;
  order_number: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string | null;
  order_items: {
    wine_id: string;
    wine_name: string;
    quantity: number;
    unit_price_cents: number;
  }[];
}

export async function forwardOrderToSuppliers(orderId: string): Promise<void> {
  const supabase = createServiceRoleClient();

  // 1. Fetch order with items
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_phone, order_items(wine_id, wine_name, quantity, unit_price_cents)",
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new FulfillmentError(
      `Order not found: ${orderId}`,
      "ORDER_NOT_FOUND",
      orderId,
    );
  }

  const typedOrder = order as unknown as OrderWithItems;

  // 2. Group items by supplier
  const supplierGroups = new Map<
    string,
    {
      supplier: Awaited<ReturnType<typeof getSupplierForWine>>;
      items: typeof typedOrder.order_items;
    }
  >();

  for (const item of typedOrder.order_items) {
    const match = await getSupplierForWine(item.wine_id);
    if (!match) {
      await logFulfillmentEvent(orderId, "error", {
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        reason: "No supplier found",
      });
      continue;
    }

    const existing = supplierGroups.get(match.supplier.id);
    if (existing) {
      existing.items.push(item);
    } else {
      supplierGroups.set(match.supplier.id, {
        supplier: match,
        items: [item],
      });
    }
  }

  // 3. Parse shipping address
  const addressParts = (typedOrder.shipping_address ?? "").split(" ");
  const houseNumber = addressParts.pop() ?? "";
  const street = addressParts.join(" ");

  const shippingAddress: ShippingAddress = {
    street,
    house_number: houseNumber,
    postal_code: typedOrder.shipping_postal_code ?? "",
    city: typedOrder.shipping_city ?? "",
    country: "NL",
  };

  // 4. Forward to each supplier
  for (const [, group] of supplierGroups) {
    if (!group.supplier) continue;

    const fulfillmentOrder: FulfillmentOrder = {
      order_id: orderId,
      supplier_id: group.supplier.supplier.id,
      items: group.items.map((item) => ({
        wine_id: item.wine_id,
        supplier_sku: group.supplier?.inventory.supplier_sku ?? item.wine_id,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
      })),
      shipping_address: shippingAddress,
      status: "pending",
    };

    try {
      const result = await withRetry(
        () => submitOrderToSupplier(group.supplier!.supplier, fulfillmentOrder),
        { orderId, operation: "order_forwarding" },
      );

      if (result.status === "accepted") {
        // Decrease inventory
        for (const item of group.items) {
          if (group.supplier?.inventory.id) {
            await updateInventoryQuantity(
              group.supplier.inventory.id,
              -item.quantity,
            );
          }
        }

        await logFulfillmentEvent(orderId, "forwarded", {
          supplier_id: group.supplier.supplier.id,
          supplier_code: group.supplier.supplier.code,
          supplier_order_id: result.supplier_order_id,
          estimated_ship_date: result.estimated_ship_date,
        });
      } else {
        await logFulfillmentEvent(orderId, "rejected", {
          supplier_id: group.supplier.supplier.id,
          reason: result.rejection_reason,
        });
      }
    } catch (error) {
      await logFulfillmentEvent(orderId, "error", {
        supplier_id: group.supplier.supplier.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // 5. Update order status
  await supabase
    .from("orders")
    .update({ status: "processing" })
    .eq("id", orderId);
}

async function logFulfillmentEvent(
  orderId: string,
  eventType: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: `fulfillment_${eventType}`,
    description: `Fulfillment ${eventType}`,
    metadata,
  });
}
