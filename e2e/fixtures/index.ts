import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { WijnenPage } from "../pages/wijnen-page";
import { WinkelwagenPage } from "../pages/winkelwagen-page";
import { AfrekenenPage } from "../pages/afrekenen-page";
import { SuccesPage } from "../pages/succes-page";

type Fixtures = {
  homePage: HomePage;
  wijnenPage: WijnenPage;
  winkelwagenPage: WinkelwagenPage;
  afrekenenPage: AfrekenenPage;
  succesPage: SuccesPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  wijnenPage: async ({ page }, use) => {
    await use(new WijnenPage(page));
  },
  winkelwagenPage: async ({ page }, use) => {
    await use(new WinkelwagenPage(page));
  },
  afrekenenPage: async ({ page }, use) => {
    await use(new AfrekenenPage(page));
  },
  succesPage: async ({ page }, use) => {
    await use(new SuccesPage(page));
  },
});

export { expect } from "@playwright/test";
