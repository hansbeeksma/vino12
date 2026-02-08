import { type Page, type Locator } from "@playwright/test";

export class WinkelwagenPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1").first();
    this.cartItems = page.locator("[data-testid='cart-item']");
    this.checkoutButton = page.locator("[data-testid='checkout-button']");
  }

  async goto() {
    await this.page.goto("/winkelwagen");
  }
}
