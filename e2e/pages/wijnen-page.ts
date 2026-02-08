import { type Page, type Locator } from "@playwright/test";

export class WijnenPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly wineCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1").first();
    this.wineCards = page.locator("[data-testid='wine-card']");
  }

  async goto() {
    await this.page.goto("/wijnen");
  }
}
