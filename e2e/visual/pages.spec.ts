import { test, expect } from "@playwright/test";

test.describe("Visual Regression — Key Pages", () => {
  test.beforeEach(async ({ context }) => {
    // Pre-set age verification cookie to bypass age gate
    await context.addCookies([
      {
        name: "vino12_age_verified",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  });

  test("wijnen catalog", async ({ page }) => {
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("wijnen-catalog.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  });

  test("winkelwagen (empty)", async ({ page }) => {
    await page.goto("/winkelwagen");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("winkelwagen-empty.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  });

  test("wijnclub", async ({ page }) => {
    await page.goto("/wijnclub");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("wijnclub.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  });

  test("afrekenen", async ({ page }) => {
    await page.goto("/afrekenen");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("afrekenen.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  });

  test("login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("login.png", {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    });
  });
});
