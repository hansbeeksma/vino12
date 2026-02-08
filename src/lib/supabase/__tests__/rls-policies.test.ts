import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll } from "vitest";

/**
 * RLS Policy Integration Tests
 *
 * These tests validate Row Level Security policies against a running
 * Supabase instance. Run `npm run db:start` before running these tests.
 *
 * Test matrix:
 * | Table                  | Anon (SELECT) | Anon (INSERT) | Service Role |
 * |------------------------|---------------|---------------|--------------|
 * | wines                  | active only   | DENY          | FULL         |
 * | regions                | READ          | DENY          | FULL         |
 * | grapes                 | READ          | DENY          | FULL         |
 * | producers              | READ          | DENY          | FULL         |
 * | categories             | READ          | DENY          | FULL         |
 * | wine_reviews           | approved only | DENY          | FULL         |
 * | orders                 | DENY          | DENY          | FULL         |
 * | customers              | DENY          | DENY          | FULL         |
 * | age_verifications      | DENY          | DENY          | FULL         |
 * | suppliers              | DENY          | DENY          | FULL         |
 * | inventory              | DENY          | DENY          | FULL         |
 * | badge_definitions      | READ          | DENY          | FULL         |
 * | customer_badges        | DENY          | DENY          | FULL         |
 * | customer_points        | DENY          | DENY          | FULL         |
 * | wine_activity          | READ          | DENY          | FULL         |
 * | supply_chain_events    | READ          | DENY          | FULL         |
 * | analytics_events       | DENY          | DENY          | FULL         |
 * | analytics_daily_metrics| DENY          | DENY          | FULL         |
 * | analytics_cohorts      | DENY          | DENY          | FULL         |
 * | landing_signups        | DENY          | DENY          | FULL         |
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const hasSupabase = SUPABASE_ANON_KEY.length > 0;

// Skip entire suite if no Supabase credentials
const describeIf = hasSupabase ? describe : describe.skip;

describeIf("RLS Policies — Anon Access", () => {
  let anonClient: SupabaseClient;

  beforeAll(() => {
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  });

  describe("Public catalog (READ allowed)", () => {
    it("can read active wines", async () => {
      const { data, error } = await anonClient.from("wines").select("id, name");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read regions", async () => {
      const { data, error } = await anonClient
        .from("regions")
        .select("id, name");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read grapes", async () => {
      const { data, error } = await anonClient
        .from("grapes")
        .select("id, name");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read producers", async () => {
      const { data, error } = await anonClient
        .from("producers")
        .select("id, name");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read categories", async () => {
      const { data, error } = await anonClient
        .from("categories")
        .select("id, name");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read badge_definitions", async () => {
      const { data, error } = await anonClient
        .from("badge_definitions")
        .select("id, name, slug");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read wine_activity (social proof)", async () => {
      const { data, error } = await anonClient
        .from("wine_activity")
        .select("id, activity_type");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it("can read supply_chain_events (traceability)", async () => {
      const { data, error } = await anonClient
        .from("supply_chain_events")
        .select("id, event_type, wine_id");
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe("Protected tables (DENY for anon)", () => {
    it("cannot read orders", async () => {
      const { data, error } = await anonClient.from("orders").select("id");
      // RLS returns empty array (not error) when no matching policy
      expect(data).toEqual([]);
    });

    it("cannot read customers", async () => {
      const { data, error } = await anonClient.from("customers").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read addresses", async () => {
      const { data, error } = await anonClient.from("addresses").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read age_verifications", async () => {
      const { data, error } = await anonClient
        .from("age_verifications")
        .select("id");
      expect(data).toEqual([]);
    });

    it("cannot read suppliers", async () => {
      const { data, error } = await anonClient.from("suppliers").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read inventory", async () => {
      const { data, error } = await anonClient.from("inventory").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read wine_club_subscriptions", async () => {
      const { data, error } = await anonClient
        .from("wine_club_subscriptions")
        .select("id");
      expect(data).toEqual([]);
    });

    it("cannot read customer_badges", async () => {
      const { data } = await anonClient.from("customer_badges").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read customer_points", async () => {
      const { data } = await anonClient.from("customer_points").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read analytics_events", async () => {
      const { data } = await anonClient.from("analytics_events").select("id");
      expect(data).toEqual([]);
    });

    it("cannot read analytics_daily_metrics", async () => {
      const { data } = await anonClient
        .from("analytics_daily_metrics")
        .select("date");
      expect(data).toEqual([]);
    });

    it("cannot read analytics_cohorts", async () => {
      const { data } = await anonClient
        .from("analytics_cohorts")
        .select("user_id");
      expect(data).toEqual([]);
    });

    it("cannot read landing_signups", async () => {
      const { data } = await anonClient.from("landing_signups").select("id");
      expect(data).toEqual([]);
    });
  });

  describe("Write protection (DENY for anon)", () => {
    it("cannot insert wines", async () => {
      const { error } = await anonClient.from("wines").insert({
        name: "Hack Wine",
        slug: "hack-wine",
        vintage: 2024,
        price_cents: 100,
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert orders", async () => {
      const { error } = await anonClient.from("orders").insert({
        order_number: "HACK-001",
        status: "pending",
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert customers", async () => {
      const { error } = await anonClient.from("customers").insert({
        email: "hacker@evil.com",
      });
      expect(error).not.toBeNull();
    });

    it("cannot delete wines", async () => {
      const { error } = await anonClient
        .from("wines")
        .delete()
        .eq("id", "00000000-0000-0000-0000-000000000000");
      expect(error).not.toBeNull();
    });

    it("cannot update wines", async () => {
      const { error } = await anonClient
        .from("wines")
        .update({ name: "Hacked" })
        .eq("id", "00000000-0000-0000-0000-000000000000");
      expect(error).not.toBeNull();
    });

    it("cannot insert analytics_events", async () => {
      const { error } = await anonClient.from("analytics_events").insert({
        event_name: "hack_attempt",
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert supply_chain_events", async () => {
      const { error } = await anonClient.from("supply_chain_events").insert({
        wine_id: "00000000-0000-0000-0000-000000000000",
        event_type: "harvest",
        location: "Hack",
        actor: "Hacker",
        hash: "fake",
        signature: "fake",
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert wine_activity", async () => {
      const { error } = await anonClient.from("wine_activity").insert({
        wine_id: "00000000-0000-0000-0000-000000000000",
        activity_type: "fake_purchase",
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert landing_signups", async () => {
      const { error } = await anonClient.from("landing_signups").insert({
        email: "hacker@evil.com",
        variant: "a",
      });
      expect(error).not.toBeNull();
    });

    it("cannot insert badge_definitions", async () => {
      const { error } = await anonClient.from("badge_definitions").insert({
        slug: "hacked-badge",
        name: "Hacked",
        description: "Injected",
        requirement_type: "hack",
      });
      expect(error).not.toBeNull();
    });
  });
});

describeIf("RLS Policies — Service Role Access", () => {
  let serviceClient: SupabaseClient;

  beforeAll(() => {
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  });

  it("service role can read all orders (bypasses RLS)", async () => {
    const { data, error } = await serviceClient.from("orders").select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read all customers", async () => {
    const { data, error } = await serviceClient.from("customers").select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read suppliers", async () => {
    const { data, error } = await serviceClient.from("suppliers").select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read inventory", async () => {
    const { data, error } = await serviceClient.from("inventory").select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read age_verifications", async () => {
    const { data, error } = await serviceClient
      .from("age_verifications")
      .select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read analytics_events", async () => {
    const { data, error } = await serviceClient
      .from("analytics_events")
      .select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read analytics_daily_metrics", async () => {
    const { data, error } = await serviceClient
      .from("analytics_daily_metrics")
      .select("date");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read landing_signups", async () => {
    const { data, error } = await serviceClient
      .from("landing_signups")
      .select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read customer_badges", async () => {
    const { data, error } = await serviceClient
      .from("customer_badges")
      .select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("service role can read customer_points", async () => {
    const { data, error } = await serviceClient
      .from("customer_points")
      .select("id");
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});

describeIf("RLS Policies — Review Visibility", () => {
  let anonClient: SupabaseClient;

  beforeAll(() => {
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  });

  it("anon can only read approved reviews", async () => {
    const { data, error } = await anonClient
      .from("wine_reviews")
      .select("id, is_approved");
    expect(error).toBeNull();
    if (data && data.length > 0) {
      // All returned reviews must be approved
      data.forEach((review) => {
        expect(review.is_approved).toBe(true);
      });
    }
  });
});
