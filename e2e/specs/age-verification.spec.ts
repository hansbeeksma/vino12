import { test, expect } from "@playwright/test";

test.describe("Age Verification Gate", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies to ensure fresh state
    await context.clearCookies();
  });

  test("age gate appears on first visit", async ({ page }) => {
    await page.goto("/");
    const ageGate = page.locator("text=BEN JE 18+?");
    await expect(ageGate).toBeVisible();
  });

  test("confirming 18+ dismisses gate and sets cookie", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=BEN JE 18+?")).toBeVisible();

    // Click confirm button
    await page.locator("text=Ja, ik ben 18 of ouder").click();

    // Gate should disappear
    await expect(page.locator("text=BEN JE 18+?")).not.toBeVisible();

    // Cookie should be set
    const cookies = await page.context().cookies();
    const ageCookie = cookies.find((c) => c.name === "vino12_age_verified");
    expect(ageCookie).toBeDefined();
    expect(ageCookie!.value).toBe("true");
  });

  test("denying redirects away from site", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=BEN JE 18+?")).toBeVisible();

    // Click deny - should redirect to google.com
    await Promise.all([
      page.waitForURL("**/google.com**", { timeout: 5000 }).catch(() => null),
      page.locator("text=Nee, ik ben jonger dan 18").click(),
    ]);

    // Verify navigation away from vino12
    expect(page.url()).not.toContain("localhost:3000");
  });

  test("cookie persists across page navigations", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=Ja, ik ben 18 of ouder").click();
    await expect(page.locator("text=BEN JE 18+?")).not.toBeVisible();

    // Navigate to another page
    await page.goto("/wijnen");
    // Age gate should NOT appear again
    await expect(page.locator("text=BEN JE 18+?")).not.toBeVisible();
  });

  test("deep link to product page shows age gate without cookie", async ({
    page,
  }) => {
    await page.goto("/wijnen");
    await expect(page.locator("text=BEN JE 18+?")).toBeVisible();
  });

  test("deep link to winkelwagen shows age gate without cookie", async ({
    page,
  }) => {
    await page.goto("/winkelwagen");
    await expect(page.locator("text=BEN JE 18+?")).toBeVisible();
  });

  test("age gate not shown when cookie already exists", async ({
    page,
    context,
  }) => {
    // Pre-set the cookie
    await context.addCookies([
      {
        name: "vino12_age_verified",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/");
    await expect(page.locator("text=BEN JE 18+?")).not.toBeVisible();
  });
});
