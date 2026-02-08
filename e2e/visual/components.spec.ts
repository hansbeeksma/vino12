import { test, expect } from "@playwright/test";

test.describe("Visual Regression — Components", () => {
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

  test("age gate modal", async ({ page, context }) => {
    // Clear the age cookie to see the gate
    await context.clearCookies();
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for age gate to be visible
    const ageGate = page.locator("text=BEN JE 18+?");
    await expect(ageGate).toBeVisible();

    await expect(page).toHaveScreenshot("age-gate.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    });
  });

  test("navigation header", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header").first();
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot("header.png", {
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
      });
    }
  });

  test("footer", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const footer = page.locator("footer").first();
    if (await footer.isVisible()) {
      await expect(footer).toHaveScreenshot("footer.png", {
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
      });
    }
  });

  test("wine card on catalog page", async ({ page }) => {
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('a[href^="/wijn/"]').first();
    if (await firstCard.isVisible()) {
      await expect(firstCard).toHaveScreenshot("wine-card.png", {
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
      });
    }
  });
});
