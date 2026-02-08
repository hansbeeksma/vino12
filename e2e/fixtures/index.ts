import { test as base } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HomePage } from "../pages/home-page";
import { WijnenPage } from "../pages/wijnen-page";
import { WinkelwagenPage } from "../pages/winkelwagen-page";
import { AfrekenenPage } from "../pages/afrekenen-page";
import { SuccesPage } from "../pages/succes-page";
import {
  createServiceClient,
  cleanupTestData,
  hasSupabase,
} from "../helpers/supabase";

type Fixtures = {
  homePage: HomePage;
  wijnenPage: WijnenPage;
  winkelwagenPage: WinkelwagenPage;
  afrekenenPage: AfrekenenPage;
  succesPage: SuccesPage;
  serviceClient: SupabaseClient | null;
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
  serviceClient: async ({}, use) => {
    if (!hasSupabase) {
      await use(null);
      return;
    }
    const client = createServiceClient();
    await use(client);
    await cleanupTestData(client);
  },
});

export { expect } from "@playwright/test";
