import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/vino12/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("age verification gate is shown", async ({ page }) => {
    await page.goto("/verificatie/leeftijd");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("nav a, header a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
