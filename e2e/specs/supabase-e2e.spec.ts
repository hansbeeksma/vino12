import { test, expect } from "../fixtures";
import { seedTestWine, hasSupabase } from "../helpers/supabase";

const describeIf = hasSupabase ? test.describe : test.describe.skip;

describeIf("Supabase E2E — Wine Catalog", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "vino12_age_verified",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("seeded wine appears in catalog", async ({ page, serviceClient }) => {
    if (!serviceClient) return;

    const { wine } = await seedTestWine(serviceClient, {
      is_active: true,
      is_featured: false,
    });

    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    // The seeded wine should appear in the catalog
    const wineElement = page.locator(`text=${wine.name}`);
    await expect(wineElement).toBeVisible({ timeout: 10000 });
  });

  test("inactive wine does not appear in catalog", async ({
    page,
    serviceClient,
  }) => {
    if (!serviceClient) return;

    const { wine } = await seedTestWine(serviceClient, {
      is_active: false,
    });

    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    // Inactive wine should NOT appear
    const wineElement = page.locator(`text=${wine.name}`);
    await expect(wineElement).not.toBeVisible();
  });

  test("wine detail page shows correct info", async ({
    page,
    serviceClient,
  }) => {
    if (!serviceClient) return;

    const { wine, producer, region } = await seedTestWine(serviceClient, {
      is_active: true,
      price_cents: 2499,
      vintage: 2021,
    });

    await page.goto(`/wijn/${wine.slug}`);
    await page.waitForLoadState("networkidle");

    // Wine name should be displayed
    await expect(page.locator(`text=${wine.name}`)).toBeVisible({
      timeout: 10000,
    });
  });
});

describeIf("Supabase E2E — Data Integrity", () => {
  test("service client can CRUD wines", async ({ serviceClient }) => {
    if (!serviceClient) return;

    // Create
    const { wine } = await seedTestWine(serviceClient);
    expect(wine.id).toBeDefined();
    expect(wine.name).toContain("Test Cabernet");

    // Read
    const { data: readWine } = await serviceClient
      .from("wines")
      .select("*")
      .eq("id", wine.id)
      .single();
    expect(readWine?.name).toBe(wine.name);

    // Update
    const { data: updated } = await serviceClient
      .from("wines")
      .update({ price_cents: 1999 })
      .eq("id", wine.id)
      .select()
      .single();
    expect(updated?.price_cents).toBe(1999);

    // Delete
    const { error } = await serviceClient
      .from("wines")
      .delete()
      .eq("id", wine.id);
    expect(error).toBeNull();
  });
});
