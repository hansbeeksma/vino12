import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const KEY_PAGES = [
  { name: "Homepage", path: "/" },
  { name: "Wijnen catalog", path: "/wijnen" },
  { name: "Winkelwagen", path: "/winkelwagen" },
  { name: "Wijnclub", path: "/wijnclub" },
  { name: "Afrekenen", path: "/afrekenen" },
];

test.describe("Accessibility — WCAG 2.2 AA", () => {
  for (const { name, path } of KEY_PAGES) {
    test(`${name} (${path}) has no critical a11y violations`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      if (critical.length > 0) {
        const summary = critical.map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} elements)`,
        );
        expect(
          critical,
          `A11y violations on ${name}:\n${summary.join("\n")}`,
        ).toEqual([]);
      }
    });
  }

  test("wine detail page has no critical a11y violations", async ({ page }) => {
    // Navigate to first wine from catalog
    await page.goto("/wijnen");
    await page.waitForLoadState("networkidle");

    const firstWineLink = page.locator('a[href^="/wijn/"]').first();
    if (await firstWineLink.isVisible()) {
      await firstWineLink.click();
      await page.waitForURL("**/wijn/**");
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      if (critical.length > 0) {
        const summary = critical.map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} elements)`,
        );
        expect(
          critical,
          `A11y violations on wine detail:\n${summary.join("\n")}`,
        ).toEqual([]);
      }
    }
  });
});
