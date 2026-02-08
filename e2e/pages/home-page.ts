import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly navLinks: Locator;
  readonly wijnenLink: Locator;
  readonly winkelwagenLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1").first();
    this.navLinks = page.locator("nav a");
    this.wijnenLink = page.locator('a[href*="wijnen"]').first();
    this.winkelwagenLink = page.locator('a[href*="winkelwagen"]').first();
  }

  async goto() {
    await this.page.goto("/");
  }

  async navigateToWijnen() {
    await this.wijnenLink.click();
    await this.page.waitForURL("**/wijnen**");
  }

  async navigateToWinkelwagen() {
    await this.winkelwagenLink.click();
    await this.page.waitForURL("**/winkelwagen**");
  }
}
