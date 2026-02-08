import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const hasSupabase = SUPABASE_SERVICE_KEY.length > 0;

/**
 * Service role client for test data seeding (bypasses RLS).
 */
export function createServiceClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/**
 * Anon client that respects RLS policies.
 */
export function createAnonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Seed a test wine and its required dependencies (region, producer).
 * Returns the created wine record.
 */
export async function seedTestWine(
  client: SupabaseClient,
  overrides: Record<string, unknown> = {},
) {
  const suffix = Date.now().toString(36);

  // Create region
  const { data: region } = await client
    .from("regions")
    .insert({
      name: `Test Region ${suffix}`,
      country: "France",
    })
    .select()
    .single();

  // Create producer
  const { data: producer } = await client
    .from("producers")
    .insert({
      name: `Test Producer ${suffix}`,
      region_id: region?.id,
    })
    .select()
    .single();

  // Create wine
  const { data: wine, error } = await client
    .from("wines")
    .insert({
      name: `Test Cabernet ${suffix}`,
      slug: `test-cabernet-${suffix}`,
      type: "red",
      price_cents: 1499,
      stock_quantity: 10,
      is_active: true,
      producer_id: producer?.id,
      region_id: region?.id,
      vintage: 2022,
      ...overrides,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to seed wine: ${error.message}`);

  return { wine: wine!, region: region!, producer: producer! };
}

/**
 * Clean up test data by prefix pattern.
 * Uses service role to bypass RLS.
 */
export async function cleanupTestData(client: SupabaseClient) {
  // Delete test wines (cascade will handle related records)
  await client.from("wines").delete().like("name", "Test %");
  await client.from("producers").delete().like("name", "Test Producer%");
  await client.from("regions").delete().like("name", "Test Region%");
}

/**
 * Seed a test customer.
 */
export async function seedTestCustomer(
  client: SupabaseClient,
  overrides: Record<string, unknown> = {},
) {
  const suffix = Date.now().toString(36);

  const { data, error } = await client
    .from("customers")
    .insert({
      email: `test-${suffix}@example.com`,
      first_name: "Test",
      last_name: `User ${suffix}`,
      ...overrides,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to seed customer: ${error.message}`);
  return data!;
}
