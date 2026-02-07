import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Supplier, InventoryItem } from "./types";

export async function getActiveSuppliers(): Promise<Supplier[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error(`Failed to fetch suppliers: ${error.message}`);
  return (data ?? []) as Supplier[];
}

export async function getSupplierById(
  supplierId: string,
): Promise<Supplier | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch supplier: ${error.message}`);
  return data as Supplier | null;
}

export async function getSupplierForWine(
  wineId: string,
): Promise<{ supplier: Supplier; inventory: InventoryItem } | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*, suppliers(*)")
    .eq("wine_id", wineId)
    .eq("is_primary", true)
    .gt("quantity_available", 0)
    .maybeSingle();

  if (error || !data) return null;

  return {
    supplier: data.suppliers as unknown as Supplier,
    inventory: {
      id: data.id,
      wine_id: data.wine_id,
      supplier_id: data.supplier_id,
      supplier_sku: data.supplier_sku,
      quantity_available: data.quantity_available,
      price_cents: data.price_cents,
      is_primary: data.is_primary,
      last_synced_at: data.last_synced_at,
    },
  };
}

export async function updateInventoryQuantity(
  inventoryId: string,
  quantityChange: number,
): Promise<void> {
  const supabase = createServiceRoleClient();

  const { data: current, error: fetchError } = await supabase
    .from("inventory")
    .select("quantity_available")
    .eq("id", inventoryId)
    .single();

  if (fetchError || !current) {
    throw new Error(`Inventory item not found: ${inventoryId}`);
  }

  const newQuantity = Math.max(0, current.quantity_available + quantityChange);

  const { error: updateError } = await supabase
    .from("inventory")
    .update({
      quantity_available: newQuantity,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", inventoryId);

  if (updateError) {
    throw new Error(`Failed to update inventory: ${updateError.message}`);
  }
}

export async function getLowStockItems(
  threshold: number = 5,
): Promise<(InventoryItem & { wine_name: string; supplier_name: string })[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*, wines(name), suppliers(name)")
    .lte("quantity_available", threshold)
    .eq("is_primary", true)
    .order("quantity_available", { ascending: true });

  if (error) throw new Error(`Failed to fetch low stock: ${error.message}`);

  return (data ?? []).map((item) => ({
    id: item.id,
    wine_id: item.wine_id,
    supplier_id: item.supplier_id,
    supplier_sku: item.supplier_sku,
    quantity_available: item.quantity_available,
    price_cents: item.price_cents,
    is_primary: item.is_primary,
    last_synced_at: item.last_synced_at,
    wine_name: (item.wines as { name: string } | null)?.name ?? "Onbekend",
    supplier_name:
      (item.suppliers as { name: string } | null)?.name ?? "Onbekend",
  }));
}

export async function getInventoryStats(): Promise<{
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
}> {
  const supabase = createServiceRoleClient();

  const [allResult, lowResult, outResult] = await Promise.all([
    supabase
      .from("inventory")
      .select("quantity_available, price_cents")
      .eq("is_primary", true),
    supabase
      .from("inventory")
      .select("id", { count: "exact" })
      .eq("is_primary", true)
      .lte("quantity_available", 5)
      .gt("quantity_available", 0),
    supabase
      .from("inventory")
      .select("id", { count: "exact" })
      .eq("is_primary", true)
      .eq("quantity_available", 0),
  ]);

  const items = allResult.data ?? [];
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity_available * item.price_cents,
    0,
  );

  return {
    totalItems: items.length,
    lowStockCount: lowResult.count ?? 0,
    outOfStockCount: outResult.count ?? 0,
    totalValue,
  };
}
