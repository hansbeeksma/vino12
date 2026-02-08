import { type Page, type Locator } from "@playwright/test";

export class SuccesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly orderNumber: Locator;
  readonly backToHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "BEDANKT!" });
    this.orderNumber = page.locator("text=Bestelnummer:");
    this.backToHomeButton = page.getByRole("link", {
      name: /terug naar home/i,
    });
  }

  async waitForLoad() {
    await this.heading.waitFor({ state: "visible", timeout: 10_000 });
  }
}
