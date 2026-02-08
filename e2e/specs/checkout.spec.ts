import { test, expect } from "../fixtures";

const TEST_CUSTOMER = {
  email: "test@vino12.nl",
  firstName: "Jan",
  lastName: "Tester",
  street: "Wijnstraat",
  houseNumber: "12",
  postalCode: "1234 AB",
  city: "Amsterdam",
};

test.describe("Checkout Flow", () => {
  test("empty cart shows empty state on checkout page", async ({
    afrekenenPage,
  }) => {
    await afrekenenPage.goto();
    await expect(afrekenenPage.emptyCartMessage).toBeVisible();
  });

  test("happy path: add wine → cart → checkout → confirmation", async ({
    page,
    afrekenenPage,
    succesPage,
  }) => {
    // Mock the checkout API to simulate Mollie redirect
    await page.route("**/api/checkout", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            orderNumber: "VINO-TEST-001",
            checkoutUrl: null, // Skip Mollie redirect, go to success page
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 1. Navigate to wine catalog
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    // 2. Click first wine to go to detail page
    const firstWineLink = page.locator('a[href^="/wijn/"]').first();
    await expect(firstWineLink).toBeVisible();
    await firstWineLink.click();
    await page.waitForURL("**/wijn/**");

    // 3. Add wine to cart
    const addToCartButton = page.getByRole("button", {
      name: /in winkelwagen/i,
    });
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 4. Navigate to cart
    await page.goto("/winkelwagen");
    await page.waitForLoadState("networkidle");

    // Verify item is in cart
    const cartHeading = page.locator("h1").first();
    await expect(cartHeading).toBeVisible();

    // 5. Go to checkout
    await page.goto("/afrekenen");
    await page.waitForLoadState("networkidle");

    // Verify checkout form is visible (not empty cart)
    await expect(afrekenenPage.emailInput).toBeVisible();

    // 6. Fill checkout form
    await afrekenenPage.fillForm(TEST_CUSTOMER);

    // 7. Submit order
    await afrekenenPage.submit();

    // 8. Should redirect to success page
    await page.waitForURL("**/succes**", { timeout: 10_000 });
    await succesPage.waitForLoad();
    await expect(succesPage.heading).toBeVisible();
  });

  test("checkout form requires age verification", async ({
    page,
    afrekenenPage,
  }) => {
    // Add item to cart via localStorage (Zustand persist)
    await page.goto("/");
    await page.evaluate(() => {
      const cartState = {
        state: {
          items: [
            {
              wine_id: "test-id",
              name: "Test Wijn",
              slug: "test-wijn",
              vintage: 2023,
              price_cents: 1500,
              image_url: null,
              volume_ml: 750,
              max_quantity: 12,
              quantity: 1,
            },
          ],
        },
        version: 0,
      };
      localStorage.setItem("vino12-cart", JSON.stringify(cartState));
    });

    // Navigate to checkout
    await afrekenenPage.goto();
    await page.waitForLoadState("networkidle");

    // Fill form without checking age box
    await afrekenenPage.emailInput.fill(TEST_CUSTOMER.email);
    await afrekenenPage.firstNameInput.fill(TEST_CUSTOMER.firstName);
    await afrekenenPage.lastNameInput.fill(TEST_CUSTOMER.lastName);
    await afrekenenPage.streetInput.fill(TEST_CUSTOMER.street);
    await afrekenenPage.houseNumberInput.fill(TEST_CUSTOMER.houseNumber);
    await afrekenenPage.postalCodeInput.fill(TEST_CUSTOMER.postalCode);
    await afrekenenPage.cityInput.fill(TEST_CUSTOMER.city);

    // Submit button should be disabled without age verification
    await expect(afrekenenPage.submitButton).toBeDisabled();

    // Check the age checkbox
    await afrekenenPage.ageCheckbox.check();

    // Now submit should be enabled
    await expect(afrekenenPage.submitButton).toBeEnabled();
  });

  test("checkout handles API error gracefully", async ({
    page,
    afrekenenPage,
  }) => {
    // Mock checkout API to return error
    await page.route("**/api/checkout", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Betaling kon niet worden verwerkt",
        }),
      });
    });

    // Add item to cart via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      const cartState = {
        state: {
          items: [
            {
              wine_id: "test-id",
              name: "Test Wijn",
              slug: "test-wijn",
              vintage: 2023,
              price_cents: 1500,
              image_url: null,
              volume_ml: 750,
              max_quantity: 12,
              quantity: 1,
            },
          ],
        },
        version: 0,
      };
      localStorage.setItem("vino12-cart", JSON.stringify(cartState));
    });

    await afrekenenPage.goto();
    await page.waitForLoadState("networkidle");

    // Fill form and submit
    await afrekenenPage.fillForm(TEST_CUSTOMER);
    await afrekenenPage.submit();

    // Should show error message, not redirect
    await expect(afrekenenPage.errorMessage).toBeVisible({ timeout: 5_000 });
    await expect(afrekenenPage.errorMessage).toContainText(
      "Betaling kon niet worden verwerkt",
    );

    // Should still be on checkout page
    await expect(page).toHaveURL(/afrekenen/);
  });
});
