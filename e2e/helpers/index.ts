import { type Page } from "@playwright/test";

/**
 * Wait for Next.js hydration to complete
 */
export async function waitForHydration(page: Page) {
  await page.waitForLoadState("networkidle");
}

/**
 * Accept age verification gate if present
 */
export async function acceptAgeVerification(page: Page) {
  const ageGate = page.locator("[data-testid='age-verification']");
  if (await ageGate.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.locator("[data-testid='age-confirm-button']").click();
  }
}
