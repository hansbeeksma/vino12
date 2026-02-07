import { chromium } from "playwright";

const BASE = "https://vino12.com";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function log(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  console.log(`${passed ? "✅" : "❌"} ${name}${error ? ` — ${error}` : ""}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`\nTesting ${BASE}\n${"=".repeat(50)}\n`);

  // Test 1: Homepage loads
  try {
    const res = await page.goto(BASE, { waitUntil: "networkidle" });
    log("Homepage loads", res?.status() === 200);
  } catch (e) {
    log("Homepage loads", false, String(e));
  }

  // Test 2: Title correct
  try {
    const title = await page.title();
    log("Title contains Vino12", title.includes("Vino12"));
  } catch (e) {
    log("Title contains Vino12", false, String(e));
  }

  // Test 3: Header visible
  try {
    const header = await page.locator("header").isVisible();
    log("Header visible", header);
  } catch (e) {
    log("Header visible", false, String(e));
  }

  // Test 4: VINO12 branding in header
  try {
    const brand = await page.locator("header a").first().textContent();
    log("VINO12 branding present", brand?.includes("VINO") ?? false);
  } catch (e) {
    log("VINO12 branding present", false, String(e));
  }

  // Test 5: Hero section visible
  try {
    const hero = await page.locator("text=6 ROOD. 6 WIT. PERFECTE BALANS.").isVisible();
    log("Hero section visible", hero);
  } catch (e) {
    log("Hero section visible", false, String(e));
  }

  // Test 6: Bestel button in header
  try {
    const bestel = await page.locator("header button:has-text('Bestel')").isVisible();
    log("Bestel button in header", bestel);
  } catch (e) {
    log("Bestel button in header", false, String(e));
  }

  // Test 7: Wine images loaded (check at least one)
  try {
    await page.locator("#collectie").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const images = await page.locator("img[alt*='Bourgogne'], img[alt*='Beaujolais'], img[alt*='Rhône'], img[alt*='Loire'], img[alt*='Mendoza'], img[alt*='Marlborough'], img[alt*='Baixas'], img[alt*='Gallura'], img[alt*='Chablis'], img[alt*='Condrieu'], img[alt*='Alsace'], img[alt*='Saint-Émilion']").count();
    log(`Wine images found (${images})`, images >= 12);
  } catch (e) {
    log("Wine images found", false, String(e));
  }

  // Test 8: Wine cards rendered (12 total)
  try {
    const cards = await page.locator("a[href^='/wijn/']").count();
    log(`Wine cards rendered (${cards})`, cards >= 12);
  } catch (e) {
    log("Wine cards rendered", false, String(e));
  }

  // Test 9: Navigate to a wine detail page
  try {
    await page.goto(`${BASE}/wijn/pinot-noir-bourgogne`, { waitUntil: "networkidle" });
    const name = await page.locator("h1").textContent();
    log("Wine detail page loads (Pinot Noir)", name?.includes("Pinot Noir") ?? false);
  } catch (e) {
    log("Wine detail page loads", false, String(e));
  }

  // Test 10: Wine detail has product image
  try {
    const img = await page.locator("img[src*='pinot-noir-bourgogne']").isVisible();
    log("Wine detail has product image", img);
  } catch (e) {
    log("Wine detail has product image", false, String(e));
  }

  // Test 11: Wine detail has tasting notes
  try {
    const tasting = await page.locator("text=Proefnotities").isVisible();
    log("Tasting notes section visible", tasting);
  } catch (e) {
    log("Tasting notes section visible", false, String(e));
  }

  // Test 12: Navigate back to homepage and test cart
  try {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("header button:has-text('Bestel')").click();
    await page.waitForTimeout(500);
    const drawer = await page.getByRole("heading", { name: "Winkelwagen" }).isVisible();
    log("Cart drawer opens on click", drawer);
  } catch (e) {
    log("Cart drawer opens on click", false, String(e));
  }

  // Test 13: Cart shows empty state
  try {
    const empty = await page.locator("text=Je winkelwagen is leeg").isVisible();
    log("Cart shows empty state", empty);
  } catch (e) {
    log("Cart shows empty state", false, String(e));
  }

  // Test 14: Add box from cart drawer
  try {
    await page.locator("button:has-text('Voeg Vino12 Box Toe')").click();
    await page.waitForTimeout(500);
    const boxName = await page.locator("text=Vino12 Box").first().isVisible();
    const price = await page.locator("text=€175").first().isVisible();
    log("Add box from cart drawer", boxName && price);
  } catch (e) {
    log("Add box from cart drawer", false, String(e));
  }

  // Test 15: Cart quantity controls work
  try {
    const qty = await page.locator("text=1").first().isVisible();
    await page.locator("button:has-text('+')").click();
    await page.waitForTimeout(300);
    const total = await page.locator("text=€350").isVisible();
    log("Cart quantity + works (€350)", total);
  } catch (e) {
    log("Cart quantity + works", false, String(e));
  }

  // Test 16: Checkout button visible
  try {
    const checkout = await page.locator("button:has-text('Afrekenen')").isVisible();
    log("Checkout button visible", checkout);
  } catch (e) {
    log("Checkout button visible", false, String(e));
  }

  // Test 17: Close cart
  try {
    await page.locator("button:has-text('Sluiten')").click();
    await page.waitForTimeout(500);
    const drawerGone = !(await page.locator("text=Winkelwagen").isVisible());
    log("Cart drawer closes", drawerGone);
  } catch (e) {
    log("Cart drawer closes", false, String(e));
  }

  // Test 18: CTA section has Bestel Nu button
  try {
    await page.locator("#bestel").scrollIntoViewIfNeeded();
    const cta = await page.locator("#bestel button:has-text('Bestel Nu')").isVisible();
    log("CTA 'Bestel Nu' button present", cta);
  } catch (e) {
    log("CTA 'Bestel Nu' button present", false, String(e));
  }

  // Test 19: Hero Bestel button triggers cart
  try {
    await page.goto(BASE, { waitUntil: "networkidle" });
    // Clear cart first
    await page.evaluate(() => localStorage.removeItem("vino12-cart"));
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("button:has-text('Bestel — €175')").click();
    await page.waitForTimeout(500);
    const drawerOpen = await page.locator("text=Vino12 Box").first().isVisible();
    log("Hero 'Bestel — €175' opens cart with box", drawerOpen);
  } catch (e) {
    log("Hero 'Bestel — €175' opens cart with box", false, String(e));
  }

  // Test 20: Checkout API responds
  try {
    const apiRes = await page.evaluate(async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
      return { status: res.status, body: await res.json() };
    });
    const hasUrl = apiRes.body?.url?.includes("stripe.com");
    log(`Checkout API returns Stripe URL (status: ${apiRes.status})`, hasUrl ?? false);
  } catch (e) {
    log("Checkout API returns Stripe URL", false, String(e));
  }

  // Test 21: Succes page loads
  try {
    await page.goto(`${BASE}/succes`, { waitUntil: "networkidle" });
    const proost = await page.locator("text=PROOST").isVisible();
    log("Succes page loads with 'PROOST'", proost);
  } catch (e) {
    log("Succes page loads", false, String(e));
  }

  // Test 22: Check all 12 wine detail pages
  const slugs = [
    "pinot-noir-bourgogne", "gamay-beaujolais", "grenache-cotes-du-rhone",
    "merlot-saint-emilion", "cabernet-franc-loire", "cabernet-sauvignon-mendoza",
    "sauvignon-blanc-marlborough", "albarino-rias-baixas", "vermentino-gallura",
    "chardonnay-chablis", "viognier-condrieu", "riesling-alsace",
  ];
  let allPagesOk = true;
  const failedPages: string[] = [];
  for (const slug of slugs) {
    try {
      const res = await page.goto(`${BASE}/wijn/${slug}`, { waitUntil: "networkidle" });
      if (res?.status() !== 200) {
        allPagesOk = false;
        failedPages.push(slug);
      }
    } catch {
      allPagesOk = false;
      failedPages.push(slug);
    }
  }
  log(
    `All 12 wine pages return 200`,
    allPagesOk,
    failedPages.length ? `Failed: ${failedPages.join(", ")}` : undefined
  );

  await browser.close();

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n${"=".repeat(50)}`);
  console.log(`\nResultaat: ${passed}/${results.length} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log("Gefaald:");
    results.filter((r) => !r.passed).forEach((r) => console.log(`  ❌ ${r.name}: ${r.error || "failed"}`));
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
