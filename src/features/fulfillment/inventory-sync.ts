import { createServiceRoleClient } from "@/lib/supabase/server";
import { fetchSupplierInventory } from "./supplier-client";
import { getActiveSuppliers } from "./supplier-service";
import type { Supplier } from "./types";

interface SyncResult {
  supplierId: string;
  supplierCode: string;
  itemsSynced: number;
  itemsCreated: number;
  itemsUpdated: number;
  errors: string[];
}

export async function syncAllSupplierInventory(): Promise<SyncResult[]> {
  const suppliers = await getActiveSuppliers();
  const results: SyncResult[] = [];

  for (const supplier of suppliers) {
    const result = await syncSupplierInventory(supplier);
    results.push(result);
  }

  return results;
}

export async function syncSupplierInventory(
  supplier: Supplier,
): Promise<SyncResult> {
  const result: SyncResult = {
    supplierId: supplier.id,
    supplierCode: supplier.code,
    itemsSynced: 0,
    itemsCreated: 0,
    itemsUpdated: 0,
    errors: [],
  };

  if (!supplier.api_endpoint) {
    result.errors.push("No API endpoint configured");
    await logSyncEvent(supplier.id, "skipped", result);
    return result;
  }

  try {
    const inventoryData = await fetchSupplierInventory(supplier);
    const supabase = createServiceRoleClient();

    for (const item of inventoryData.items) {
      try {
        // Find existing inventory record by supplier + SKU
        const { data: existing } = await supabase
          .from("inventory")
          .select("id, quantity_available, price_cents")
          .eq("supplier_id", supplier.id)
          .eq("supplier_sku", item.sku)
          .maybeSingle();

        if (existing) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("inventory")
            .update({
              quantity_available: item.quantity_available,
              price_cents: item.price_cents,
              last_synced_at: inventoryData.synced_at,
            })
            .eq("id", existing.id);

          if (updateError) {
            result.errors.push(
              `Failed to update SKU ${item.sku}: ${updateError.message}`,
            );
          } else {
            result.itemsUpdated++;
          }
        } else {
          // Find wine by supplier SKU mapping
          const { data: wine } = await supabase
            .from("wines")
            .select("id")
            .eq("supplier_sku", item.sku)
            .maybeSingle();

          if (wine) {
            const { error: insertError } = await supabase
              .from("inventory")
              .insert({
                wine_id: wine.id,
                supplier_id: supplier.id,
                supplier_sku: item.sku,
                quantity_available: item.quantity_available,
                price_cents: item.price_cents,
                is_primary: true,
                last_synced_at: inventoryData.synced_at,
              });

            if (insertError) {
              result.errors.push(
                `Failed to create SKU ${item.sku}: ${insertError.message}`,
              );
            } else {
              result.itemsCreated++;
            }
          }
        }

        result.itemsSynced++;
      } catch (itemError) {
        result.errors.push(
          `Error processing SKU ${item.sku}: ${String(itemError)}`,
        );
      }
    }

    await logSyncEvent(supplier.id, "completed", result);
  } catch (error) {
    result.errors.push(
      `Sync failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    await logSyncEvent(supplier.id, "failed", result);
  }

  return result;
}

async function logSyncEvent(
  supplierId: string,
  status: string,
  result: SyncResult,
): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase.from("inventory_sync_log").insert({
    supplier_id: supplierId,
    status,
    items_synced: result.itemsSynced,
    items_created: result.itemsCreated,
    items_updated: result.itemsUpdated,
    errors: result.errors.length > 0 ? result.errors : null,
    synced_at: new Date().toISOString(),
  });
}
