import { test, expect } from "../fixtures";

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.page).toHaveTitle(/vino12/i);
    await expect(homePage.heading).toBeVisible();
  });

  test("wijnen page loads", async ({ wijnenPage }) => {
    await wijnenPage.goto();
    await expect(wijnenPage.heading).toBeVisible();
  });

  test("winkelwagen page loads", async ({ winkelwagenPage }) => {
    await winkelwagenPage.goto();
    await expect(winkelwagenPage.heading).toBeVisible();
  });

  test("navigation between pages works", async ({ homePage }) => {
    await homePage.goto();
    await homePage.navigateToWijnen();
    await expect(homePage.page).toHaveURL(/wijnen/);
  });
});
