import { type Page, type Locator } from "@playwright/test";

export class AfrekenenPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly houseNumberInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cityInput: Locator;
  readonly ageCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1").first();
    this.emailInput = page.locator('input[type="email"]');
    this.firstNameInput = page.locator('input[placeholder*="Voornaam"]');
    this.lastNameInput = page.locator('input[placeholder*="Achternaam"]');
    this.streetInput = page.locator('input[placeholder*="Straat"]');
    this.houseNumberInput = page.locator('input[placeholder*="Huisnummer"]');
    this.postalCodeInput = page.locator('input[placeholder*="Postcode"]');
    this.cityInput = page.locator('input[placeholder*="Plaats"]');
    this.ageCheckbox = page.locator('input[type="checkbox"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".border-wine.bg-wine\\/10 p");
    this.emptyCartMessage = page.getByText("Je winkelwagen is leeg");
  }

  async goto() {
    await this.page.goto("/afrekenen");
  }

  async fillForm(data: {
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  }) {
    await this.emailInput.fill(data.email);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.houseNumberInput.fill(data.houseNumber);
    await this.postalCodeInput.fill(data.postalCode);
    await this.cityInput.fill(data.city);
    await this.ageCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }
}
