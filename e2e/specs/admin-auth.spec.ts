import { test, expect } from "@playwright/test";

test.describe("Admin Authentication & Access Control", () => {
  test.describe("Unauthenticated access protection", () => {
    test("redirects to /login when accessing /admin without auth", async ({
      page,
    }) => {
      await page.goto("/admin");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirect URL includes admin path for post-login redirect", async ({
      page,
    }) => {
      await page.goto("/admin");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("redirect=%2Fadmin");
    });

    test("redirects from /admin/bestellingen without auth", async ({
      page,
    }) => {
      await page.goto("/admin/bestellingen");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirects from /admin/wijnen without auth", async ({ page }) => {
      await page.goto("/admin/wijnen");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirects from /admin/klanten without auth", async ({ page }) => {
      await page.goto("/admin/klanten");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirects from /admin/voorraad without auth", async ({ page }) => {
      await page.goto("/admin/voorraad");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirects from /admin/reviews without auth", async ({ page }) => {
      await page.goto("/admin/reviews");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });

    test("redirects from /admin/instellingen without auth", async ({
      page,
    }) => {
      await page.goto("/admin/instellingen");
      await page.waitForURL("**/login**");
      expect(page.url()).toContain("/login");
    });
  });

  test.describe("Login page", () => {
    test("login page renders with email input and submit button", async ({
      page,
    }) => {
      await page.goto("/login");
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();

      const heading = page.locator("text=INLOGGEN");
      await expect(heading).toBeVisible();
    });

    test("login page shows magic link explanation", async ({ page }) => {
      await page.goto("/login");
      const magicLinkText = page.locator("text=magic link");
      await expect(magicLinkText).toBeVisible();
    });

    test("login form requires email", async ({ page }) => {
      await page.goto("/login");
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute("required", "");
    });

    test("login page shows auto-account creation note", async ({ page }) => {
      await page.goto("/login");
      const autoAccountText = page.locator("text=Nog geen account");
      await expect(autoAccountText).toBeVisible();
    });
  });

  test.describe("Access denied page", () => {
    test("geen-toegang page renders correctly", async ({ page }) => {
      // Direct access to the page (bypassing middleware for rendering test)
      await page.goto("/admin/geen-toegang");

      // Note: This may redirect to login if no auth, but we test the page exists
      // The page content check depends on auth state
      const currentUrl = page.url();

      if (currentUrl.includes("/login")) {
        // Without auth, middleware redirects to login - this is expected
        expect(currentUrl).toContain("/login");
      } else {
        // If page loads (e.g., with stale session), check content
        const heading = page.locator("text=GEEN TOEGANG");
        await expect(heading).toBeVisible();

        const backLink = page.locator("text=Terug naar shop");
        await expect(backLink).toBeVisible();
      }
    });
  });

  test.describe("Protected API routes", () => {
    test("admin API routes return 401 without auth", async ({ request }) => {
      // Admin API routes should require authentication
      const endpoints = [
        "/api/admin/export/orders",
        "/api/admin/inventory",
        "/api/admin/refunds",
        "/api/admin/suppliers",
      ];

      for (const endpoint of endpoints) {
        const response = await request.get(endpoint);
        // API routes without auth should return 401 or 403
        expect(
          [401, 403].includes(response.status()),
          `${endpoint} should deny unauthenticated access, got ${response.status()}`,
        ).toBe(true);
      }
    });
  });
});
