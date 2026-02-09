import { test, expect } from "../fixtures";

/**
 * Conversion Funnel E2E Tests
 *
 * Tests the complete conversion funnel tracking:
 * 1. page_visit - Initial page load
 * 2. product_viewed - Wine detail page visit
 * 3. add_to_cart - Add wine to cart
 * 4. checkout_started - Checkout page visit
 * 5. order_completed - Order confirmation
 *
 * Validates that funnel events are tracked via /api/analytics/funnel
 */

const TEST_CUSTOMER = {
  email: "funnel-test@vino12.nl",
  firstName: "Funnel",
  lastName: "Tester",
  street: "Analytics Laan",
  houseNumber: "42",
  postalCode: "1234 AB",
  city: "Amsterdam",
};

test.describe("Conversion Funnel Tracking", () => {
  test("tracks complete funnel: visit → product → cart → checkout → order", async ({
    page,
    afrekenenPage,
  }) => {
    const funnelEvents: Array<{
      event_type: string;
      timestamp: number;
    }> = [];

    // Intercept all funnel API calls
    await page.route("**/api/analytics/funnel", async (route) => {
      const request = route.request();

      if (request.method() === "POST") {
        const postData = request.postDataJSON();
        funnelEvents.push({
          event_type: postData.event_type,
          timestamp: Date.now(),
        });

        // Allow the request to pass through to API
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { id: `test-${Date.now()}` },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock checkout API to simulate order completion
    await page.route("**/api/checkout", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            orderNumber: "VINO-FUNNEL-TEST-001",
            checkoutUrl: null,
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Step 1: PAGE VISIT - Navigate to wine catalog
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    // Wait for page_visit event
    await page.waitForTimeout(500);
    expect(
      funnelEvents.some((e) => e.event_type === "page_visit"),
    ).toBeTruthy();

    // Step 2: PRODUCT VIEWED - Click first wine to detail page
    const firstWineLink = page.locator('a[href^="/wijn/"]').first();
    await expect(firstWineLink).toBeVisible();
    await firstWineLink.click();
    await page.waitForURL("**/wijn/**");
    await page.waitForLoadState("networkidle");

    // Wait for product_viewed event
    await page.waitForTimeout(500);
    expect(
      funnelEvents.some((e) => e.event_type === "product_viewed"),
    ).toBeTruthy();

    // Step 3: ADD TO CART - Add wine to cart
    const addToCartButton = page.getByRole("button", {
      name: /in winkelwagen/i,
    });
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Wait for add_to_cart event
    await page.waitForTimeout(500);
    expect(
      funnelEvents.some((e) => e.event_type === "add_to_cart"),
    ).toBeTruthy();

    // Step 4: CHECKOUT STARTED - Navigate to checkout
    await page.goto("/afrekenen");
    await page.waitForLoadState("networkidle");

    // Wait for checkout_started event
    await page.waitForTimeout(500);
    expect(
      funnelEvents.some((e) => e.event_type === "checkout_started"),
    ).toBeTruthy();

    // Step 5: ORDER COMPLETED - Fill form and submit order
    await expect(afrekenenPage.emailInput).toBeVisible();
    await afrekenenPage.fillForm(TEST_CUSTOMER);
    await afrekenenPage.submit();

    // Wait for success page
    await page.waitForURL("**/succes**", { timeout: 10_000 });
    await page.waitForLoadState("networkidle");

    // Wait for order_completed event
    await page.waitForTimeout(500);
    expect(
      funnelEvents.some((e) => e.event_type === "order_completed"),
    ).toBeTruthy();

    // Validate all 5 funnel stages were tracked
    expect(funnelEvents.length).toBeGreaterThanOrEqual(5);

    // Validate event order (some may be duplicated, but order should be preserved)
    const eventTypes = funnelEvents.map((e) => e.event_type);
    const firstPageVisit = eventTypes.indexOf("page_visit");
    const firstProductView = eventTypes.indexOf("product_viewed");
    const firstAddToCart = eventTypes.indexOf("add_to_cart");
    const firstCheckoutStart = eventTypes.indexOf("checkout_started");
    const firstOrderComplete = eventTypes.indexOf("order_completed");

    expect(firstPageVisit).toBeLessThan(firstProductView);
    expect(firstProductView).toBeLessThan(firstAddToCart);
    expect(firstAddToCart).toBeLessThan(firstCheckoutStart);
    expect(firstCheckoutStart).toBeLessThan(firstOrderComplete);
  });

  test("funnel events include session tracking", async ({ page }) => {
    let capturedEvent: {
      event_type: string;
      session_id: string;
      device_type: string;
      browser: string;
    } | null = null;

    // Intercept funnel API to capture event structure
    await page.route("**/api/analytics/funnel", async (route) => {
      if (route.request().method() === "POST") {
        capturedEvent = route.request().postDataJSON();

        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // Trigger a funnel event
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Validate event structure
    expect(capturedEvent).toBeTruthy();
    expect(capturedEvent.session_id).toBeTruthy();
    expect(capturedEvent.event_type).toBe("page_visit");
    expect(capturedEvent.device_type).toMatch(/mobile|desktop|tablet/);
    expect(capturedEvent.browser).toBeTruthy();
  });

  test("maintains same session_id across funnel", async ({ page }) => {
    const sessionIds = new Set<string>();

    await page.route("**/api/analytics/funnel", async (route) => {
      if (route.request().method() === "POST") {
        const event = route.request().postDataJSON();
        sessionIds.add(event.session_id);

        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // Trigger multiple funnel events
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const firstWineLink = page.locator('a[href^="/wijn/"]').first();
    await firstWineLink.click();
    await page.waitForURL("**/wijn/**");
    await page.waitForTimeout(500);

    // All events should share the same session_id
    expect(sessionIds.size).toBe(1);
  });

  test("handles funnel API errors gracefully", async ({ page }) => {
    let apiCallCount = 0;

    await page.route("**/api/analytics/funnel", async (route) => {
      apiCallCount++;

      if (route.request().method() === "POST") {
        // Simulate API error
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal server error" }),
        });
      } else {
        await route.continue();
      }
    });

    // Page should still load even if funnel tracking fails
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    // Verify page loaded successfully
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify funnel API was called (but failed)
    expect(apiCallCount).toBeGreaterThan(0);
  });
});
