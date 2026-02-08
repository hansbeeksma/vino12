import { describe, it, expect } from "vitest";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

/**
 * Contract schemas for Supabase table structures.
 *
 * These validate that the database schema matches what the application expects.
 * Run with local Supabase: `npm run db:start` first.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const hasSupabase = SUPABASE_ANON_KEY.length > 0;
const describeIf = hasSupabase ? describe : describe.skip;

// -- Table Schema Contracts --

export const WineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(["red", "white", "rose", "sparkling", "dessert", "orange"]),
  price_cents: z.number().int().positive(),
  is_active: z.boolean(),
  stock_quantity: z.number().int().min(0),
  vintage: z.number().int().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const RegionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  created_at: z.string(),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.string(),
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  total_cents: z.number().int(),
  created_at: z.string(),
});

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  created_at: z.string(),
});

// -- Offline schema validation --

describe("Supabase Contract Schemas — Offline Validation", () => {
  it("WineSchema accepts valid wine", () => {
    const valid = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Château Test",
      slug: "chateau-test",
      type: "red",
      price_cents: 1499,
      is_active: true,
      stock_quantity: 10,
      vintage: 2022,
      created_at: "2026-02-08T12:00:00+00:00",
      updated_at: "2026-02-08T12:00:00+00:00",
    };

    expect(() => WineSchema.parse(valid)).not.toThrow();
  });

  it("WineSchema rejects invalid wine type", () => {
    const invalid = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test",
      slug: "test",
      type: "beer",
      price_cents: 1499,
      is_active: true,
      stock_quantity: 10,
      vintage: null,
      created_at: "2026-02-08T12:00:00+00:00",
      updated_at: "2026-02-08T12:00:00+00:00",
    };

    expect(() => WineSchema.parse(invalid)).toThrow();
  });

  it("OrderSchema rejects invalid status", () => {
    const invalid = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      order_number: "VINO-001",
      status: "unknown",
      total_cents: 2998,
      created_at: "2026-02-08T12:00:00+00:00",
    };

    expect(() => OrderSchema.parse(invalid)).toThrow();
  });
});

// -- Live database contract tests --

describeIf("Supabase Contract — Live Database Validation", () => {
  it("wines table matches WineSchema contract", async () => {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await client
      .from("wines")
      .select(
        "id, name, slug, type, price_cents, is_active, stock_quantity, vintage, created_at, updated_at",
      )
      .limit(1);

    expect(error).toBeNull();

    if (data && data.length > 0) {
      const result = WineSchema.safeParse(data[0]);
      if (!result.success) {
        console.error("Wine schema mismatch:", result.error.format());
      }
      expect(result.success).toBe(true);
    }
  });

  it("regions table matches RegionSchema contract", async () => {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await client
      .from("regions")
      .select("id, name, country, created_at")
      .limit(1);

    expect(error).toBeNull();

    if (data && data.length > 0) {
      const result = RegionSchema.safeParse(data[0]);
      if (!result.success) {
        console.error("Region schema mismatch:", result.error.format());
      }
      expect(result.success).toBe(true);
    }
  });

  it("orders table matches OrderSchema contract (via service role)", async () => {
    if (!SUPABASE_SERVICE_KEY) return;

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await client
      .from("orders")
      .select("id, order_number, status, total_cents, created_at")
      .limit(1);

    expect(error).toBeNull();

    if (data && data.length > 0) {
      const result = OrderSchema.safeParse(data[0]);
      if (!result.success) {
        console.error("Order schema mismatch:", result.error.format());
      }
      expect(result.success).toBe(true);
    }
  });

  it("customers table matches CustomerSchema contract (via service role)", async () => {
    if (!SUPABASE_SERVICE_KEY) return;

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await client
      .from("customers")
      .select("id, email, first_name, last_name, created_at")
      .limit(1);

    expect(error).toBeNull();

    if (data && data.length > 0) {
      const result = CustomerSchema.safeParse(data[0]);
      if (!result.success) {
        console.error("Customer schema mismatch:", result.error.format());
      }
      expect(result.success).toBe(true);
    }
  });
});
